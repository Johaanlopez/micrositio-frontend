import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import EmailVerification from './EmailVerification';
import GoogleAuthSetup from './GoogleAuthSetup';
import GoogleAuthLogin from './GoogleAuthLogin';
import styles from './LoginForm.module.css';
import logoImage from '../assets/logo.png';

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Requerido'),
  password: z.string().min(1, 'Requerido'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [stage, setStage] = useState<'login' | 'emailVerification' | 'googleAuth'>('login');
  const [email, setEmail] = useState('');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresSetup, setRequiresSetup] = useState(false);

  // ✅ Limpiar token viejo al cargar la página de login
  useEffect(() => {
    console.log('🧹 Limpiando tokens viejos al cargar login');
    localStorage.removeItem('token');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/auth/login', {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      });

      if (res.data?.requiresEmailVerification) {
        setEmail(data.emailOrUsername);
        setMessage(res.data.message || 'Código enviado a tu email');
        setStage('emailVerification');
      } else if (res.data?.requiresGoogleAuthSetup) {
        const token = res.data?.tempToken || res.data?.temp_token || res.data?.temptoken;
        if (token) {
          setTempToken(token);
          setRequiresSetup(true);
          setStage('googleAuth');
        }
      } else if (res.data?.requiresGoogleAuth) {
        const token = res.data?.tempToken || res.data?.temp_token || res.data?.temptoken;
        if (token) {
          setTempToken(token);
          setRequiresSetup(false);
          setStage('googleAuth');
        }
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err.message || 'Error en login';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'emailVerification') {
    return (
      <EmailVerification
        email={email}
        initialMessage={message}
        onSuccess={(token) => {
          setTempToken(token);
          setStage('googleAuth');
        }}
      />
    );
  }

  if (stage === 'googleAuth' && tempToken) {
    // Si requiresSetup es true, mostrar GoogleAuthSetup (con QR - primera vez)
    // Si no, mostrar GoogleAuthLogin (solo pedir código - ya configurado)
    if (requiresSetup) {
      return <GoogleAuthSetup tempToken={tempToken} />;
    } else {
      return <GoogleAuthLogin tempToken={tempToken} />;
    }
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
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Inicio de Sesión</h2>
            <p className={styles.subtitle}>
              Inicio de Sesión <strong>micrositio CINTLI Montessori</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="emailOrUsername" className={styles.label}>
                Usuario
              </label>
              <input
                {...register('emailOrUsername')}
                type="text"
                id="emailOrUsername"
                disabled={loading}
                placeholder="Introduce tu usuario"
                className={styles.input}
              />
              {errors.emailOrUsername && (
                <p className={styles.error}>{errors.emailOrUsername.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                disabled={loading}
                placeholder="Introduce tu contraseña"
                className={styles.input}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>

            {message && (
              <div className={`${styles.message} ${
                message.includes('Error') || message.includes('Invalid')
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
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'INICIAR SESIÓN'
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <span style={{ fontSize: '0.875rem', color: '#475569' }}>
              ¿No tienes cuenta?{' '}
            </span>
            <a href="/register" className={styles.link} style={{ fontWeight: 600, textDecoration: 'underline' }}>
              Regístrate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;