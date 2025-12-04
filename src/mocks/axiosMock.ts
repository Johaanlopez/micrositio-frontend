import MockAdapter from 'axios-mock-adapter';
import api from '../lib/api';

// Mock simple in-memory auth state
const mock = new MockAdapter(api, { delayResponse: 500 });

// In-memory users map
const users: Record<string, { password: string; verified: boolean; attemptsLeft: number; lockedUntil?: number; id: number; name?: string }> = {
  'user@example.com': { password: 'password123', verified: false, attemptsLeft: 5, id: 1, name: 'Usuario Ejemplo' },
  'verified@micrositio.com': { password: 'password123', verified: true, attemptsLeft: 5, id: 2, name: 'Verificado' },
};

// Browser-safe base64 helper (use window.btoa when available, fall back to Node Buffer)
function base64Encode(str: string) {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(str);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Buffer } = require('buffer');
  return Buffer.from(str).toString('base64');
}

function generateAccessToken(email: string) {
  // Very naive token (base64 payload only) for mock; not a real JWT
  const payload = { sub: email, exp: Math.floor(Date.now() / 1000) + 60 * 15 };
  return base64Encode(JSON.stringify(payload)) + '.' + 'mock';
}

function handleAuthLogin(config: any) {
  try {
    const body = JSON.parse(config.data || '{}');
    const { email, password } = body;
    const u = users[email];
    if (!u) {
      return [401, { message: 'Credenciales inválidas', attemptsLeft: 4 }];
    }
    // locked?
    if (u.lockedUntil && Date.now() < u.lockedUntil) {
      return [423, { message: 'Cuenta bloqueada', lockedUntil: u.lockedUntil }];
    }
    if (password !== u.password) {
      u.attemptsLeft = Math.max(0, (u.attemptsLeft || 5) - 1);
      if (u.attemptsLeft === 0) {
        u.lockedUntil = Date.now() + 1000 * 60 * 5; // 5 minutes
        return [423, { message: 'Cuenta bloqueada por demasiados intentos', lockedUntil: u.lockedUntil }];
      }
      return [401, { message: 'Credenciales inválidas', attemptsLeft: u.attemptsLeft }];
    }
    // success
    u.attemptsLeft = 5;
    const accessToken = generateAccessToken(email);
    const requiresEmailVerification = !u.verified;
    const response: any = { accessToken, user: { id: u.id, email, name: u.name }, requiresEmailVerification };
    return [200, response];
  } catch (e) {
    return [500, { message: 'Error del mock' }];
  }
}

// register login handlers
mock.onPost('/auth/login').reply((config: any) => handleAuthLogin(config) as any);
mock.onPost('/api/auth/login').reply((config: any) => handleAuthLogin(config) as any);

function handleAuthRefresh() {
  // return a new token for demo
  const accessToken = generateAccessToken('user@example.com');
  return [200, { accessToken, user: { id: 1, email: 'user@example.com', name: 'Usuario Ejemplo' } }];
}

mock.onPost('/auth/refresh').reply(() => handleAuthRefresh() as any);
mock.onPost('/api/auth/refresh').reply(() => handleAuthRefresh() as any);

function handleAuthLogout() {
  return [200, { ok: true }];
}

mock.onPost('/auth/logout').reply(() => handleAuthLogout() as any);
mock.onPost('/api/auth/logout').reply(() => handleAuthLogout() as any);

function handleAuthVerifyEmail(config: any) {
  const body = JSON.parse(config.data || '{}');
  const { email, code } = body;
  const u = users[email];
  if (!u) return [404, { message: 'Usuario no encontrado' }];
  // any code accepted in mock
  u.verified = true;
  const accessToken = generateAccessToken(email);
  return [200, { accessToken, user: { id: u.id, email, name: u.name } }];
}

mock.onPost('/auth/verify-email').reply((config: any) => handleAuthVerifyEmail(config) as any);
mock.onPost('/api/auth/verify-email').reply((config: any) => handleAuthVerifyEmail(config) as any);

mock.onPost('/api/auth/setup-2fa').reply((config: any) => {
  // return a fake qr data url and secret for demo
  const dummyQr = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAABX5kJ1AAAA...';
  return [200, { qr: dummyQr, secret: 'ABCDEF123456' }];
});

export default mock;
