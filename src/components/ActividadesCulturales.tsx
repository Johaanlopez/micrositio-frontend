import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './ActividadesCulturales.module.css';
import festivalMulticulturalImg from '../assets/festivalmulticultural.png';
import danzaImg from '../assets/danza.png';
import septImg from '../assets/15sept.png';

const ActividadesCulturales: React.FC = () => {
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
          <h1 className={styles.headerTitle}>Actividades culturales</h1>
        </div>
        
        {/* Diamantes decorativos */}
        <div className={styles.diamond1}></div>
        <div className={styles.diamond2}></div>
        <div className={styles.diamond3}></div>
      </div>

      {/* Sección 1: Introducción (Azul) */}
      <section className={styles.sectionPurple}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleRight} style={{ backgroundImage: `url(${festivalMulticulturalImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>Cultura y Arte</h2>
            <p className={styles.description}>
              Las actividades culturales en CINTLI Montessori están diseñadas para enriquecer 
              el conocimiento de nuestros estudiantes sobre diferentes culturas, tradiciones y 
              expresiones artísticas del mundo. Fomentamos el respeto, la diversidad y la 
              apreciación por el arte en todas sus formas.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Festival multicultural anual</li>
              <li className={styles.listItem}>• Visitas a museos y galerías de arte</li>
              <li className={styles.listItem}>• Exposiciones de arte estudiantil</li>
              <li className={styles.listItem}>○ Pinturas, esculturas y proyectos multimedia creados por los niños</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 2: Programas (Amarillo) */}
      <section className={styles.sectionYellow}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleLeft} style={{ backgroundImage: `url(${danzaImg})` }}></div>
          
          <div className={styles.contentRight}>
            <h2 className={styles.title}>Programas</h2>
            <p className={styles.description}>
              Ofrecemos una amplia variedad de programas culturales que incluyen música, danza, 
              teatro, literatura y artes visuales. Cada actividad está adaptada a las diferentes 
              edades y niveles de desarrollo de nuestros estudiantes.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Clases de música y canto coral</li>
              <li className={styles.listItem}>• Taller de danza folklórica mexicana</li>
              <li className={styles.listItem}>• Club de lectura y cuentacuentos</li>
              <li className={styles.listItem}>○ Exploramos historias de diferentes países y culturas del mundo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 3: Impacto (Naranja) */}
      <section className={styles.sectionOrange}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.triangleWhite} style={{ backgroundImage: `url(${septImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>Impacto</h2>
            <p className={styles.description}>
              A través de las actividades culturales, los niños desarrollan habilidades sociales, 
              creatividad, pensamiento crítico y una identidad cultural sólida. Aprendemos a 
              valorar nuestras raíces mientras celebramos la riqueza de otras culturas.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Celebración de festividades tradicionales</li>
              <li className={styles.listItem}>• Intercambios culturales con otras escuelas</li>
              <li className={styles.listItem}>• Proyectos de investigación cultural</li>
              <li className={styles.listItem}>○ Los estudiantes investigan y presentan sobre países, idiomas y costumbres</li>
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

export default ActividadesCulturales;
