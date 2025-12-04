import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './EventosSociales.module.css';
import familiaImg from '../assets/familia.png';
import diaDeMuertosImg from '../assets/diademuertos.png';
import integracionFamiliarImg from '../assets/integracionfamiliar.png';

const EventosSociales: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Eventos sociales</h1>
        </div>
        
        {/* Círculos decorativos */}
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      {/* Sección 1: Introducción (Rojo) */}
      <section className={styles.sectionRed}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleRight} style={{ backgroundImage: `url(${familiaImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>Comunidad Unida</h2>
            <p className={styles.description}>
              Los eventos sociales son momentos especiales donde la comunidad educativa se reúne 
              para celebrar, compartir y fortalecer lazos. En CINTLI Montessori creemos en la 
              importancia de crear espacios de convivencia que enriquezcan la experiencia educativa 
              y promuevan valores como la solidaridad, el respeto y la colaboración.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Día de la familia</li>
              <li className={styles.listItem}>• Kermesse escolar</li>
              <li className={styles.listItem}>• Ceremonia de graduación</li>
              <li className={styles.listItem}>○ Celebramos los logros académicos y personales de nuestros estudiantes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 2: Tipos de eventos (Cyan) */}
      <section className={styles.sectionCyan}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleLeft} style={{ backgroundImage: `url(${diaDeMuertosImg})` }}></div>
          
          <div className={styles.contentRight}>
            <h2 className={styles.title}>Celebraciones</h2>
            <p className={styles.description}>
              Durante el año escolar organizamos diversos eventos sociales que involucran a 
              estudiantes, familias y personal educativo. Desde celebraciones tradicionales 
              hasta eventos temáticos innovadores, cada ocasión es una oportunidad para crear 
              recuerdos inolvidables.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Fiestas patrias y cívicas</li>
              <li className={styles.listItem}>• Día de muertos y posadas navideñas</li>
              <li className={styles.listItem}>• Festivales de primavera</li>
              <li className={styles.listItem}>○ Juegos, música en vivo, food trucks y actividades para toda la familia</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 3: Comunidad (Amarillo) */}
      <section className={styles.sectionYellow}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.triangleWhite} style={{ backgroundImage: `url(${integracionFamiliarImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>Un poco más.</h2>
            <p className={styles.description}>
              Los eventos sociales no solo son momentos de diversión, sino también oportunidades 
              de aprendizaje social y emocional. Los niños aprenden a trabajar en equipo, respetar 
              turnos, expresar gratitud y desarrollar empatía mientras participan en actividades 
              comunitarias.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Campañas solidarias y colectas</li>
              <li className={styles.listItem}>• Conferencias para padres de familia</li>
              <li className={styles.listItem}>• Talleres de integración familiar</li>
              <li className={styles.listItem}>○ Actividades diseñadas para fortalecer el vínculo entre padres e hijos</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.socialLinks}>
            <a href="https://www.facebook.com/escuelacintlimontessori?locale=es_LA" className={styles.socialLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="https://www.instagram.com/escuela.cintli.montessori" className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Cerrar Sesión
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EventosSociales;
