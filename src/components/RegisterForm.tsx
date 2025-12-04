import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import EmailVerification from './EmailVerification';
import GoogleAuthSetup from './GoogleAuthSetup';
import styles from './RegisterForm.module.css';
import logoImage from '../assets/logo.png';

const registerSchema = z.object({
  matricula: z.string()
    .length(13, 'La matrícula debe tener exactamente 13 caracteres')
    .regex(/^[A-Za-z0-9]{13}$/, 'La matrícula debe ser alfanumérica (letras y números)'),
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres'),
  password: z.string()
    .min(10, 'Mínimo 10 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]{10,}$/,
      'Debe tener mínimo 10 caracteres, una mayúscula, un número y NO puede contener caracteres especiales'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [stage, setStage] = useState<'register' | 'googleAuthSetup' | 'emailVerification'>('register');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/auth/register', {
        matricula: data.matricula,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms
      });

      // NEW FLOW: First show Google Auth Setup (QR code)
      if (res.data?.requiresGoogleAuthSetup) {
        setUserId(res.data.userId);
        setEmail(res.data.email); // Email viene del backend
        setMessage('Registro exitoso. Configura tu autenticación de dos factores.');
        setStage('googleAuthSetup');
      }
      // OLD FLOW: Email verification first (for backward compatibility)
      else if (res.data?.requiresEmailVerification) {
        setEmail(res.data.email); // Email viene del backend
        setMessage('Registro exitoso. Revisa tu email.');
        setStage('emailVerification');
      }
    } catch (err: any) {
      const errorData = err?.response?.data;

      // If user already has an account, redirect to login
      if (errorData?.redirectToLogin) {
        setMessage(errorData?.message || 'Ya tienes una cuenta. Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      // Handle other errors
      if (errorData?.details) {
        setMessage(errorData.details.join(', '));
      } else {
        setMessage(errorData?.error || errorData?.message || 'Error en el registro');
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: Show Google Auth Setup (QR Code)
  if (stage === 'googleAuthSetup') {
    return (
      <GoogleAuthSetup
        userId={userId}
        onSuccess={async () => {
          // After 2FA is configured, send email verification code
          try {
            await api.post('/auth/send-email-code', { userId });
            setMessage('2FA configurado. Verifica tu email.');
            setStage('emailVerification');
          } catch (err: any) {
            console.error('Error sending email code:', err);
            setMessage('2FA configurado. Verifica tu email.');
            setStage('emailVerification');
          }
        }}
      />
    );
  }

  // STEP 2: Show Email Verification (after QR is scanned)
  if (stage === 'emailVerification') {
    return (
      <EmailVerification
        email={email}
        initialMessage={message}
        onSuccess={() => {
          navigate('/login');
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.circleAmarillo} />
      <div className={styles.circleVerde} />
      <div className={styles.circleAzul} />
      <div className={styles.circleNaranja} />

      <div className={styles.logo}>
        <img src={logoImage} alt="CINTLI Montessori" className={styles.logoImage} />
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formContainer} style={{ maxWidth: '32rem' }}>
          <div className={styles.header}>
            <h2 className={styles.title}>Registro de Alumno</h2>
            <p className={styles.subtitle}>
              Crea tu cuenta en <strong>micrositio CINTLI Montessori</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Matrícula */}
            <div className={styles.inputGroup}>
              <label htmlFor="matricula" className={styles.label}>
                Matrícula
              </label>
              <input
                {...register('matricula')}
                type="text"
                id="matricula"
                disabled={loading}
                placeholder="Introduce tu matrícula"
                maxLength={13}
                className={styles.input}
              />
              {errors.matricula && (
                <p className={styles.error}>{errors.matricula.message}</p>
              )}
            </div>

            {/* Username */}
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                Nombre de Usuario
              </label>
              <input
                {...register('username')}
                type="text"
                id="username"
                disabled={loading}
                placeholder="Cualquier carácter (máx. 30)"
                maxLength={30}
                className={styles.input}
              />
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                disabled={loading}
                placeholder="Mínimo 10 caracteres"
                className={styles.input}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Contraseña
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                disabled={loading}
                placeholder="Repite tu contraseña"
                className={styles.input}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Términos */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                {...register('acceptTerms')}
                type="checkbox"
                id="acceptTerms"
                disabled={loading}
                style={{ marginTop: '0.25rem', width: 'auto', accentColor: '#ef4444' }}
              />
              <label htmlFor="acceptTerms" style={{ fontSize: '0.875rem', margin: 0, color: '#334155' }}>
                Acepto los <button type="button" onClick={() => setShowTerms(true)} style={{ color: '#ef4444', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>términos y condiciones</button>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className={styles.error}>{errors.acceptTerms.message}</p>
            )}

            {message && (
              <div className={`${styles.message} ${message.includes('Error') || message.includes('inválido') || message.includes('No autorizado')
                  ? styles.messageError
                  : styles.messageSuccess
                }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? (
                <div className={styles.buttonContent}>
                  <div className={styles.spinner} />
                  <span>Registrando...</span>
                </div>
              ) : (
                'REGISTRARSE'
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <span style={{ fontSize: '0.875rem', color: '#475569' }}>
              ¿Ya tienes cuenta?{' '}
            </span>
            <a href="/login" className={styles.link} style={{ fontWeight: 600, textDecoration: 'underline' }}>
              Inicia sesión
            </a>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Términos y Condiciones</h3>
            <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
              <p>Bienvenido al micrositio de CINTLI Montessori.</p>
              <p>Al registrarte, aceptas los siguientes términos:</p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>La información proporcionada debe ser verídica.</li>
                <li>Tu cuenta es personal e intransferible.</li>
                <li>Debes mantener la confidencialidad de tu contraseña.</li>
                <li>El uso del sitio está reservado para alumnos y personal autorizado.</li>
              </ul>
              <p>Nos reservamos el derecho de suspender cuentas que violen estas normas.</p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 600,
                width: '100%'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;