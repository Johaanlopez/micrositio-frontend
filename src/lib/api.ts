import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ INTERCEPTOR GLOBAL: Siempre agrega el token de localStorage (excepto en rutas de auth)
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  console.log('🔍 Interceptor ejecutado. Token encontrado:', token ? 'SÍ' : 'NO');
  console.log('🔍 URL de la petición:', cfg.url);
  
  // ✅ NO enviar token en peticiones de autenticación inicial
  const isAuthRoute = cfg.url?.includes('/auth/login') || 
                      cfg.url?.includes('/auth/register') ||
                      cfg.url?.includes('/auth/verify-email');
  
  if (token && cfg.headers && !isAuthRoute) {
    cfg.headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Header Authorization agregado');
  } else if (isAuthRoute) {
    console.log('⏭️ Saltando Authorization header para ruta de auth');
  }
  return cfg;
});

type GetToken = () => string | null | undefined;
type OnUnauthorized = () => Promise<boolean>;

/**
 * Attach auth interceptor. The getToken callback should return the in-memory access token
 * on the client. onUnauthorized should try to refresh token (via cookie) and return true
 * if refresh succeeded.
 */
export function attachAuthInterceptor(getToken: GetToken, onUnauthorized: OnUnauthorized) {
  const reqId = api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && cfg.headers) {
      cfg.headers['Authorization'] = `Bearer ${token}`;
    }
    return cfg;
  });

  const resId = api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error) => {
      const original = error?.config;
      if (!original) return Promise.reject(error);
      
      // ✅ NO retry automático en rutas de auth para evitar loops
      const isAuthRoute = original.url?.includes('/auth/login') || 
                         original.url?.includes('/auth/refresh') ||
                         original.url?.includes('/auth/verify');
      
      if (error.response && error.response.status === 401 && !original._retry && !isAuthRoute) {
        original._retry = true;
        try {
          const refreshed = await onUnauthorized();
          if (refreshed) {
            return api(original);
          }
        } catch (e) {
          // fallthrough
        }
      }
      return Promise.reject(error);
    }
  );

  return () => {
    api.interceptors.request.eject(reqId);
    api.interceptors.response.eject(resId);
  };
}

export default api;
