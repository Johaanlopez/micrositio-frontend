import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '../lib/api';
import GoogleAuthSetup from './GoogleAuthSetup';
import styles from './EmailVerification.module.css';
import logoImage from '../assets/logo.png';

interface Props {
  email: string;
  onSuccess?: (tempToken: string) => void;
  initialMessage?: string;
}

const EmailVerification: React.FC<Props> = ({ email, onSuccess, initialMessage }) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(initialMessage || '');
  const [tempToken, setTempToken] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ FIX: Prevenir múltiples envíos
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);
    setError(null);
    
    const nextEmpty = newCode.findIndex(v => !v);
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const submit = useCallback(async () => {
    // ✅ FIX: Prevenir múltiples clics
    if (isSubmittingRef.current) {
      console.log('⏳ Ya hay una verificación en progreso');
      return;
    }

    const joined = code.join('');
    if (joined.length !== 6) {
      setError('Por favor ingresa los 6 dígitos');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Enviando código:', joined);
      
      // ✅ FIX: Sin /api porque baseURL ya lo tiene
      const res = await api.post('/auth/verify-email', { email, code: joined }, { 
        withCredentials: true,
        timeout: 10000
      });

      console.log('📥 Respuesta del servidor:', res.data);

      // ✅ FIX: Backend usa "temptoken" (minúscula)
      const token = res.data?.temptoken || res.data?.tempToken || res.data?.temp_token || res.data?.token || null;

      if (token) {
        console.log('✅ Token recibido:', token.substring(0, 20) + '...');
        console.log('🔄 Actualizando estado tempToken...');
        setTempToken(token);
        setMessage('✓ Código verificado. Configurando autenticación...');
        onSuccess?.(token);
        console.log('✅ Estado tempToken actualizado');
      } else {
        console.error('⚠️ Respuesta sin token:', res.data);
        setError('Error: No se recibió token del servidor');
      }
    } catch (err: any) {
      console.error('❌ Error en verificación:', err?.response?.data || err.message);
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Error verificando código';
      setError(errorMsg);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
      // ✅ Reset el flag después de 1 segundo
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 1000);
    }
  }, [code, email, onSuccess]);

  const resend = useCallback(async () => {
    if (resending) return;

    setResending(true);
    setError(null);
    setMessage('');

    try {
      // ✅ FIX: Sin /api
      await api.post('/auth/resend-code', { email }, { 
        withCredentials: true,
        timeout: 10000
      });
      
      setMessage('✓ Código reenviado. Revisa tu email.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Error reenviando código';
      setError(msg);
    } finally {
      setResending(false);
    }
  }, [email, resending]);

  const isComplete = useMemo(() => code.every(v => v !== ''), [code]);

  // ✅ FIX: Si hay tempToken, mostrar GoogleAuthSetup
  console.log('🔍 EmailVerification render, tempToken:', tempToken ? tempToken.substring(0, 20) + '...' : 'null');
  if (tempToken) {
    console.log('🔐 Mostrando GoogleAuthSetup con token:', tempToken.substring(0, 20) + '...');
    return <GoogleAuthSetup tempToken={tempToken} />;
  }

  return (
    <div className={styles.container}>
      {/* Decorative circles */}
      <div className={styles.circleRojo} />
      <div className={styles.circleCyan} />
      <div className={styles.circleAmarillo} />
      <div className={styles.circleVerde} />
      
      <div className={styles.logo}>
        <img src={logoImage} alt="CINTLI Montessori" className={styles.logoImage} />
      </div>

      {/* Verification form */}
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Verificar Email</h2>
            <p className={styles.subtitle}>
              Ingresa el código de 6 dígitos enviado a <strong>{email}</strong>
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Código de verificación:
            </label>
            
            <div className={styles.codeContainer} onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  disabled={loading}
                  className={`${styles.codeInput} ${digit ? styles.codeInputFilled : ''}`}
                />
              ))}
            </div>

            {error && (
              <div className={styles.error}>{error}</div>
            )}

            {message && (
              <div className={styles.message}>{message}</div>
            )}

            <button
              onClick={submit}
              disabled={!isComplete || loading || isSubmittingRef.current}
              className={styles.button}
            >
              {loading ? (
                <div className={styles.buttonContent}>
                  <div className={styles.spinner} />
                  <span>Verificando...</span>
                </div>
              ) : (
                'Verificar Código'
              )}
            </button>
          </div>

          <div className={styles.footer}>
            <button
              onClick={resend}
              disabled={resending || loading}
              className={styles.resendButton}
            >
              {resending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;