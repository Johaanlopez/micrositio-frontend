import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import styles from './LoginForm.module.css';
import logoImage from '../assets/logo.png';

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

const resetSchema = z.object({
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
  newPassword: z.string()
    .min(12, 'Mínimo 12 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/, 
      'Debe incluir mayúsculas, minúsculas, números y símbolos'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

const ForgotPassword: React.FC = () => {
  const [stage, setStage] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
  } = useForm<ResetFormData>();

  const onSubmitEmail = async (data: EmailFormData) => {
    setLoading(true);
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setEmail(data.email);
      setMessage('Código enviado a tu email. Revisa tu bandeja de entrada.');
      setStage('reset');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'Error al enviar el código';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetFormData) => {
    setLoading(true);
    setMessage('');

    try {
      await api.post('/auth/reset-password', {
        email,
        code: data.code,
        newPassword: data.newPassword,
      });
      setMessage('¡Contraseña actualizada! Redirigiendo al login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'Código inválido o expirado';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className={styles.title}>
              {stage === 'email' ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
            </h2>
            <p className={styles.subtitle}>
              {stage === 'email' 
                ? 'Ingresa tu email para recibir un código de recuperación'
                : `Código enviado a ${email}`
              }
            </p>
          </div>

          {stage === 'email' ? (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Correo Electrónico
                </label>
                <input
                  {...registerEmail('email')}
                  type="email"
                  id="email"
                  disabled={loading}
                  placeholder="tu@email.com"
                  className={styles.input}
                />
                {errorsEmail.email && (
                  <p className={styles.error}>{errorsEmail.email.message}</p>
                )}
              </div>

              {message && (
                <div className={`${styles.message} ${
                  message.includes('Error')
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
                    <span>Enviando...</span>
                  </div>
                ) : (
                  'ENVIAR CÓDIGO'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitReset(onSubmitReset)} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="code" className={styles.label}>
                  Código de Verificación
                </label>
                <input
                  {...registerReset('code')}
                  type="text"
                  id="code"
                  disabled={loading}
                  placeholder="123456"
                  maxLength={6}
                  className={styles.input}
                />
                {errorsReset.code && (
                  <p className={styles.error}>{errorsReset.code.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  Nueva Contraseña
                </label>
                <input
                  {...registerReset('newPassword')}
                  type="password"
                  id="newPassword"
                  disabled={loading}
                  placeholder="Mínimo 12 caracteres"
                  className={styles.input}
                />
                {errorsReset.newPassword && (
                  <p className={styles.error}>{errorsReset.newPassword.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirmar Contraseña
                </label>
                <input
                  {...registerReset('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  disabled={loading}
                  placeholder="Repite tu contraseña"
                  className={styles.input}
                />
                {errorsReset.confirmPassword && (
                  <p className={styles.error}>{errorsReset.confirmPassword.message}</p>
                )}
              </div>

              {message && (
                <div className={`${styles.message} ${
                  message.includes('Error') || message.includes('inválido')
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
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  'CAMBIAR CONTRASEÑA'
                )}
              </button>
            </form>
          )}

          <div className={styles.footer}>
            <a href="/login" className={styles.link} style={{ fontWeight: 600, textDecoration: 'underline' }}>
              Volver al login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;