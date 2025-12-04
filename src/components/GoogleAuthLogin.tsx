import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './GoogleAuthLogin.module.css';
import logoImage from '../assets/logo.png';
import { ShieldCheck } from 'lucide-react';

interface Props {
  tempToken: string; // provided by previous step (login or email verification)
}

const DIGITS = 6;

const GoogleAuthLogin: React.FC<Props> = ({ tempToken }) => {
  const [values, setValues] = useState<string[]>(Array(DIGITS).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backupModal, setBackupModal] = useState(false);
  const [backupInput, setBackupInput] = useState('');

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  // ✅ FIX: Prevenir múltiples envíos
  const isSubmittingRef = useRef(false);

  // TOTP timer (30s window)
  const [tick, setTick] = useState(() => {
    const s = Math.floor(Date.now() / 1000);
    return s % 30;
  });
  
  useEffect(() => {
    const id = setInterval(() => setTick(Math.floor(Date.now() / 1000) % 30), 500);
    return () => clearInterval(id);
  }, []);

  const remaining = useMemo(() => 30 - tick, [tick]);

  const focusIndex = useCallback((idx: number) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    if (!v) {
      setValues((p) => { const c = [...p]; c[idx] = ''; return c; });
      return;
    }
    const char = v.slice(-1);
    setValues((p) => { const c = [...p]; c[idx] = char; return c; });
    if (idx < DIGITS - 1) focusIndex(idx + 1);
  }, [focusIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (values[idx]) {
        setValues((p) => { const c = [...p]; c[idx] = ''; return c; });
      } else if (idx > 0) {
        focusIndex(idx - 1);
        setValues((p) => { const c = [...p]; c[idx - 1] = ''; return c; });
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) focusIndex(idx - 1);
    if (e.key === 'ArrowRight' && idx < DIGITS - 1) focusIndex(idx + 1);
  }, [values, focusIndex]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text').replace(/[^0-9]/g, '').slice(0, DIGITS);
    if (!text) return;
    const arr = text.split('');
    setValues((p) => {
      const c = [...p];
      for (let i = 0; i < DIGITS; i++) c[i] = arr[i] ?? '';
      return c;
    });
    const next = Math.min(DIGITS - 1, text.length - 1);
    focusIndex(next + 1 < DIGITS ? next + 1 : next);
  }, [focusIndex]);

  const code = useMemo(() => values.join(''), [values]);

  const submit = useCallback(async (useBackup = false) => {
    // ✅ FIX: Prevenir múltiples clics
    if (isSubmittingRef.current) {
      console.log('⏳ Ya hay una verificación en progreso');
      return;
    }

    setError(null);
    if (!useBackup && code.length !== DIGITS) {
      setError('Introduce el código de 6 dígitos');
      return;
    }
    if (useBackup && backupInput.trim().length === 0) {
      setError('Introduce un código de respaldo');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const payload: any = { tempToken };
      if (useBackup) {
        payload.backupCode = backupInput.trim();
      } else {
        payload.totpCode = code; // ✅ FIX: Backend espera "totpCode"
      }

      console.log('📤 Verificando 2FA:', useBackup ? 'backup code' : code);

      // ✅ FIX: Backend espera "totpCode" no "code"
      const res = await api.post('/auth/verify-2fa', payload, { 
        withCredentials: true,
        timeout: 10000
      });

      console.log('✅ 2FA verificado exitosamente');
      console.log('📥 Respuesta:', res.data);

      // ✅ GUARDAR TOKEN JWT en localStorage
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        console.log('💾 Token JWT guardado en localStorage');
        
        // ✅ CRITICAL FIX: Llamar a checkAuth para actualizar el estado de autenticación
        console.log('🔄 Actualizando estado de autenticación...');
        await checkAuth();
        
        console.log('🎉 Redirigiendo al dashboard...');
        navigate('/dashboard');
      } else {
        console.error('⚠️ Respuesta sin token:', res.data);
        setError('Error: No se recibió token de acceso');
      }
    } catch (err: any) {
      console.error('❌ Error verificando 2FA:', err?.response?.data || err.message);
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Código inválido o error';
      setError(msg);
      
      // Limpiar campos
      if (!useBackup) {
        setValues(Array(DIGITS).fill(''));
        focusIndex(0);
      } else {
        setBackupInput('');
      }
    } finally {
      setLoading(false);
      // ✅ Reset el flag después de 1 segundo
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 1000);
    }
  }, [code, backupInput, tempToken, navigate, checkAuth, focusIndex]);

  return (
    <div className={styles.container}>
      {/* Círculos decorativos */}
      <div className={styles.circleRojo} />
      <div className={styles.circleAmarillo} />
      <div className={styles.circleAzul} />
      <div className={styles.circleNaranja} />

      {/* Logo CINTLI */}
      <div className={styles.logo}>
        <img src={logoImage} alt="CINTLI Montessori" className={styles.logoImage} />
      </div>

      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Autenticación 2FA</h2>
          <p className={styles.subtitle}>
            Introduce el código de 6 dígitos desde tu app de autenticación
          </p>
          <div className={styles.timerBadge}>
            <div className={styles.timerDot} />
            <span className={styles.timerText}>Expira en {remaining}s</span>
          </div>
        </div>

        <div className={styles.codeContainer}>
          {Array.from({ length: DIGITS }).map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={values[i]}
              onChange={(e) => handleInput(e as any, i)}
              onKeyDown={(e) => handleKeyDown(e as any, i)}
              onPaste={handlePaste}
              disabled={loading}
              className={`${styles.codeInput} ${values[i] ? styles.filled : ''} ${error ? styles.error : ''}`}
            />
          ))}
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button
            onClick={() => submit(false)}
            disabled={loading || isSubmittingRef.current || code.length !== DIGITS}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verificar
              </>
            )}
          </button>

          <button
            onClick={() => setBackupModal(true)}
            type="button"
            disabled={loading}
            className={styles.backupButton}
          >
            Usar código de respaldo
          </button>
        </div>

        {/* Backup modal */}
        {backupModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <ShieldCheck className={styles.modalIcon} />
                <h3 className={styles.modalTitle}>Código de Respaldo</h3>
              </div>
              <p className={styles.modalDescription}>
                Introduce uno de tus códigos de respaldo para iniciar sesión.
              </p>
              <input
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                className={styles.backupInput}
                placeholder="Código de respaldo"
                disabled={loading}
              />
              <div className={styles.modalActions}>
                <button
                  onClick={() => {
                    setBackupModal(false);
                    setBackupInput('');
                  }}
                  disabled={loading}
                  className={`${styles.modalButton} ${styles.cancelButton}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    submit(true);
                    setBackupModal(false);
                  }}
                  disabled={loading}
                  className={`${styles.modalButton} ${styles.verifyButton}`}
                >
                  Usar código
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthLogin;