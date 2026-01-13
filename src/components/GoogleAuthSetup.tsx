import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, Copy, DownloadCloud, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './GoogleAuthSetup.module.css';
import logoImage from '../assets/logo.png';

interface Props {
  tempToken?: string;
  userId?: string;
  onSuccess?: () => void;
}

const DIGITS = 6;

const GoogleAuthSetup: React.FC<Props> = ({ tempToken, userId, onSuccess }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [values, setValues] = useState<string[]>(Array(DIGITS).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  // Fetch QR + backup codes
  useEffect(() => {
    // ✅ FIX: Evitar doble llamada por React StrictMode
    if (fetchingRef.current) {
      console.log('⏭️ Saltando llamada duplicada a setup-2fa (ya en progreso)');
      return;
    }
    
    fetchingRef.current = true;
    abortControllerRef.current = new AbortController();
    let mounted = true;
    
    (async () => {
      try {
        // ✅ NEW: Support both userId and tempToken
        const config: any = {
          withCredentials: true
        }
        
        const body: any = {}
        
        if (userId !== undefined && userId !== null) {
          // NEW FLOW: Registration with userId (asegurar que es número)
          body.userId = Number(userId)
        } else if (tempToken) {
          // OLD FLOW: Email verification with tempToken
          config.headers = {
            Authorization: `Bearer ${tempToken}`
          }
        } else {
          throw new Error('Missing userId or tempToken')
        }

        console.log('📤 Enviando a /auth/setup-2fa con:', { 
          hasUserId: !!userId, 
          hasTempToken: !!tempToken,
          userId: userId ? userId.substring(0, 8) + '...' : 'N/A'
        });
        
        const res = await api.post('/auth/setup-2fa', body, config);
        
        if (!mounted) return;
        const data = res.data || {};
        console.log('✅ Setup 2FA response:', { 
          hasQr: !!data.qr, 
          qrLength: data.qr?.length,
          backupCodesCount: data.backupCodes?.length || 0
        });
        setQrDataUrl(data.qr || null);
        setBackupCodes(data.backupCodes || null);
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.log('⏹️ Petición setup-2fa abortada (cleanup)');
          return;
        }
        console.error('❌ Error setup-2fa:', e.response?.data);
        setError('Error al obtener configuración 2FA');
      } finally {
        if (mounted) {
          fetchingRef.current = false;
        }
      }
    })();
    return () => {
      mounted = false;
      fetchingRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [tempToken, userId]);

  const focusIndex = useCallback((idx: number) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    if (!v) {
      setValues((p) => {
        const c = [...p];
        c[idx] = '';
        return c;
      });
      return;
    }
    const char = v.slice(-1);
    setValues((p) => {
      const c = [...p];
      c[idx] = char;
      return c;
    });
    if (idx < DIGITS - 1) focusIndex(idx + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (values[idx]) {
        setValues((p) => {
          const c = [...p];
          c[idx] = '';
          return c;
        });
      } else if (idx > 0) {
        focusIndex(idx - 1);
        setValues((p) => {
          const c = [...p];
          c[idx - 1] = '';
          return c;
        });
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) focusIndex(idx - 1);
    if (e.key === 'ArrowRight' && idx < DIGITS - 1) focusIndex(idx + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
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
  };

  const code = useMemo(() => values.join(''), [values]);

  const copyBackup = useCallback(async () => {
    if (!backupCodes) return;
    const text = backupCodes.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Códigos copiados al portapapeles');
    } catch (e) {
      console.error('Error al copiar:', e);
    }
  }, [backupCodes]);

  const downloadBackup = useCallback(() => {
    if (!backupCodes) return;
    const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [backupCodes]);

  const submit = async () => {
    setError(null);
    if (code.length !== DIGITS) {
      setError('Introduce el código TOTP de 6 dígitos');
      return;
    }
    
    console.log('🔍 DEBUG: Código a enviar:', {
      code,
      codeLength: code.length,
      codeType: typeof code,
      values,
      userId,
      tempToken
    });
    
    setLoading(true);
    try {
      // ✅ Support both flows
      const config: any = {
        withCredentials: true
      }
      
      const body: any = {
        totpCode: code
      }
      
      if (userId) {
        // NEW FLOW: Registration with userId
        body.userId = userId
      } else if (tempToken) {
        // OLD FLOW: Login with tempToken
        body.tempToken = tempToken
      }
      
      console.log('📤 Enviando a /auth/verify-2fa:', body);
      
      const res = await api.post('/auth/verify-2fa', body, config);
      const data = res.data || {};

      console.log('✅ Respuesta verify-2fa:', data);

      // GUARDAR TOKEN JWT en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('💾 Token JWT guardado en localStorage');
      }

      // If onSuccess callback is provided (registration flow), call it
      if (onSuccess) {
        onSuccess();
      } else {
        // LOGIN FLOW: Navigate to dashboard directly
        // ✅ CRITICAL FIX: Llamar a checkAuth para actualizar el estado de autenticación
        console.log('🔄 Actualizando estado de autenticación...');
        await checkAuth();
        
        console.log('🎉 Redirigiendo al dashboard...');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('❌ Error verify-2fa:', err.response?.data);
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Código inválido';
      
      // Mensaje más específico según el error
      if (errorMsg.includes('Invalid TOTP')) {
        setError('❌ Código incorrecto. Verifica que el código sea el actual (cambia cada 30 segundos).');
      } else if (errorMsg.includes('expired')) {
        setError('❌ El código expiró. Introduce el código actual de tu app.');
      } else {
        setError(errorMsg);
      }
      
      // Limpiar los inputs
      setValues(Array(DIGITS).fill(''));
      focusIndex(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Círculos de colores */}
      <div className={styles.circleAmarillo} />
      <div className={styles.circleVerde} />
      <div className={styles.circleAzul} />
      <div className={styles.circleNaranja} />
      
      <div className={styles.logo}>
        <img src={logoImage} alt="CINTLI Montessori" className={styles.logoImage} />
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Activar 2FA - Google Authenticator</h2>
            <p className={styles.subtitle}>
              Configura tu autenticación de dos factores para mayor seguridad
            </p>
          </div>

          {/* Grid con 2 columnas: Instrucciones (azul) y QR (marrón) */}
          <div className={styles.gridContainer}>
            {/* Sección de Instrucciones (AZUL) */}
            <div className={styles.instructionsSection}>
              <h4 className={styles.instructionsTitle}>📱 Instrucciones:</h4>
              <ol className={styles.instructionsList}>
                <li>
                  <span className={styles.stepNumber}>1</span>
                  <span>Instala <strong>Google Authenticator</strong> (iOS/Android)</span>
                </li>
                <li>
                  <span className={styles.stepNumber}>2</span>
                  <span>Abre la app → <em>"Escanear código QR"</em></span>
                </li>
                <li>
                  <span className={styles.stepNumber}>3</span>
                  <span>Escanea el QR mostrado a la derecha</span>
                </li>
                <li>
                  <span className={styles.stepNumber}>4</span>
                  <span>Introduce el código de 6 dígitos generado</span>
                </li>
              </ol>
            </div>

            {/* Sección de QR (MARRÓN) */}
            <div className={styles.qrSection}>
              {qrDataUrl ? (
                <div className={styles.qrBox}>
                  <img src={qrDataUrl} alt="QR 2FA" className={styles.qrImage} />
                </div>
              ) : (
                <div className={styles.qrLoadingBox}>
                  <div className={styles.qrLoadingInner}>
                    <div className={styles.spinnerBlue}></div>
                    <p className={styles.qrLoadingTextSmall}>Cargando QR...</p>
                  </div>
                </div>
              )}
              
              {backupCodes && (
                <button
                  onClick={() => setShowModal(true)}
                  className={styles.backupButton}
                >
                  <DownloadCloud className="w-4 h-4" />
                  Ver códigos de respaldo
                </button>
              )}
            </div>
          </div>

          {/* Sección de Código TOTP (VERDE) */}
          <div className={styles.codeSection}>
            <label className={styles.codeLabel}>
              Código TOTP de tu app:
            </label>
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
                  className={`${styles.codeInput} ${values[i] ? styles.filled : ''}`}
                />
              ))}
            </div>

            {error && (
              <div style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                padding: '0.875rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1rem', color: '#ef4444' }}>⚠️</span>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#991b1b',
                  margin: 0,
                  lineHeight: '1.4'
                }}>{error}</p>
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading || code.length !== DIGITS}
              className={styles.submitButton}
              style={{
                backgroundColor: loading || code.length !== DIGITS ? '#9ca3af' : '#ef4444',
                cursor: loading || code.length !== DIGITS ? 'not-allowed' : 'pointer',
                opacity: loading || code.length !== DIGITS ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading && code.length === DIGITS) {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && code.length === DIGITS) {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                }
              }}
            >
              {loading ? (
                <div className={styles.buttonContent}>
                  <div className={styles.spinner} />
                  <span>Verificando...</span>
                </div>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Verificar y activar
                </>
              )}
            </button>
          </div>

          {/* Backup codes modal */}
          {showModal && backupCodes && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h4 className={styles.modalTitle}>🔑 Códigos de respaldo</h4>
                  <button
                    onClick={() => setShowModal(false)}
                    className={styles.closeButton}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.warningBox}>
                  <p className={styles.warningText}>
                    <strong>⚠️ ¡Importante!</strong> Guarda estos códigos en un lugar seguro. Los
                    necesitarás si pierdes acceso a tu autenticador.
                  </p>
                </div>

                <div className={styles.backupCodesList}>
                  <ul className={styles.backupCodesGrid}>
                    {backupCodes.map((c, idx) => (
                      <li
                        key={idx}
                        className={styles.backupCodeItem}
                      >
                        <span className={styles.backupCodeText}>{c}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(c);
                            alert(`Código ${idx + 1} copiado`);
                          }}
                          className={styles.copyIcon}
                          title="Copiar código"
                        >
                          <Copy className={styles.iconSmall} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={copyBackup}
                    className={styles.buttonPrimary}
                  >
                    <Copy className={styles.iconSmall} />
                    Copiar todos
                  </button>
                  <button
                    onClick={downloadBackup}
                    className={styles.buttonSecondary}
                  >
                    <DownloadCloud className={styles.iconSmall} />
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthSetup;