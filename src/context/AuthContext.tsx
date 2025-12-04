import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { User, LoginCredentials } from '../types/auth';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    accessToken: null,
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const isRefreshingRef = useRef(false);
  const navigate = useNavigate();

  // ✅ FIX: Función de refresh sin loops
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      console.log('⏳ Refresh ya en progreso, esperando...');
      return false;
    }

    isRefreshingRef.current = true;
    console.log('🔄 Intentando refresh token...');

    try {
      const res = await api.post('/auth/refresh', {}, { 
        withCredentials: true,
        timeout: 5000 // ✅ Timeout de 5 segundos
      });
      
      const newAccessToken = res.data?.accessToken || res.data?.access_token;
      
      if (newAccessToken) {
        console.log('✅ Token refreshed exitosamente');
        setState(prev => ({ ...prev, accessToken: newAccessToken }));
        scheduleRefresh(newAccessToken);
        return true;
      }
      
      console.warn('⚠️ Refresh no devolvió token');
      return false;
    } catch (err: any) {
      console.error('❌ Error en refresh:', err?.response?.status || err.message);
      
      // ✅ Si es 401, limpiar sesión
      if (err?.response?.status === 401) {
        setState({ user: null, isAuthenticated: false, loading: false, accessToken: null });
      }
      
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // ✅ FIX: Schedule refresh SIN llamar a checkAuth
  const scheduleRefresh = useCallback((token: string) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = exp - now;
      const refreshAt = Math.max(timeUntilExpiry - 60000, 30000); // ✅ Refresh 1 min antes o mínimo 30seg

      console.log(`⏰ Próximo refresh en ${Math.round(refreshAt / 1000)}s`);

      refreshTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Ejecutando refresh programado');
        refreshToken();
      }, refreshAt);
    } catch (err) {
      console.error('❌ Error parseando token para schedule:', err);
    }
  }, [refreshToken]);

  // ✅ FIX: checkAuth simplificado, SIN llamar a scheduleRefresh automáticamente
  const checkAuth = useCallback(async () => {
    console.log('🔍 Verificando autenticación...');
    setState(prev => ({ ...prev, loading: true }));

    try {
      const res = await api.get('/auth/me', { 
        withCredentials: true,
        timeout: 5000
      });
      
      const user = res.data?.user;
      // El token ya está en localStorage, no necesitamos recibirlo de nuevo
      const token = res.data?.accessToken || res.data?.access_token || localStorage.getItem('token');

      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        setState({ user, isAuthenticated: true, loading: false, accessToken: token });
        if (token) scheduleRefresh(token);
      } else {
        console.warn('⚠️ Respuesta sin user');
        localStorage.removeItem('token'); // ✅ Limpiar token inválido
        setState({ user: null, isAuthenticated: false, loading: false, accessToken: null });
      }
    } catch (err: any) {
      console.error('❌ Error en checkAuth:', err?.response?.status || err.message);
      // ✅ Si es 401, limpiar token expirado/inválido
      if (err?.response?.status === 401) {
        console.log('🧹 Limpiando token inválido de localStorage');
        localStorage.removeItem('token');
      }
      setState({ user: null, isAuthenticated: false, loading: false, accessToken: null });
    }
  }, [scheduleRefresh]);

  // ✅ Login sin cambios
  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await api.post('/auth/login', credentials, { withCredentials: true });
    const user = res.data?.user;
    const token = res.data?.accessToken || res.data?.access_token;

    if (user && token) {
      setState({ user, isAuthenticated: true, loading: false, accessToken: token });
      scheduleRefresh(token);
    }
  }, [scheduleRefresh]);

  // ✅ Logout con limpieza de localStorage
  const logout = useCallback(async () => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      // ✅ Limpiar token de localStorage
      localStorage.removeItem('token');
      console.log('🧹 Token eliminado de localStorage en logout');
      setState({ user: null, isAuthenticated: false, loading: false, accessToken: null });
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Check auth SOLO en mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay token, verificar sesión
      checkAuth();
    }
  }, [checkAuth]); // ✅ Solo ejecuta UNA VEZ al montar

  // ✅ Cleanup en unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
  