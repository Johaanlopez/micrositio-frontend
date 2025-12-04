import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './ActividadesRecreativas.module.css';
import campamentoVeranoImg from '../assets/campamentoVerano.png';
import natacionImg from '../assets/natacion.png';
import motorasImg from '../assets/motoras.png';

const ActividadesRecreativas: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      {/* Header con título */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>Actividades recreativas</h1>
        </div>
        
        {/* Cuadrados decorativos */}
        <div className={styles.square1}></div>
        <div className={styles.square2}></div>
        <div className={styles.square3}></div>
      </div>

      {/* Sección 1: Próximos eventos (Verde) */}
      <section className={styles.sectionGreen}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleRight} style={{ backgroundImage: `url(${campamentoVeranoImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>Próximos eventos</h2>
            <p className={styles.description}>
              Nuestras actividades recreativas están diseñadas para que los niños desarrollen 
              habilidades físicas, sociales y emocionales a través del juego activo. Promovemos 
              el deporte, la creatividad y el trabajo en equipo en un ambiente seguro y divertido.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Torneo de Fútbol Infantil - 22 de Marzo</li>
              <li className={styles.listItem}>• Olimpiadas Escolares - 10 de Mayo</li>
              <li className={styles.listItem}>• Campamento de Verano - Julio y Agosto</li>
              <li className={styles.listItem}>○ Incluye natación, excursiones y talleres al aire libre</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 2: Actividades (Naranja) */}
      <section className={styles.sectionOrange}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleLeft} style={{ backgroundImage: `url(${natacionImg})` }}></div>
          
          <div className={styles.contentRight}>
            <h2 className={styles.title}>Actividades</h2>
            <p className={styles.description}>
              Ofrecemos un programa semanal variado que incluye deportes, artes marciales, 
              danza y juegos tradicionales. Cada actividad está supervisada por profesionales 
              capacitados que fomentan valores como el respeto, la disciplina y la perseverancia.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Fútbol y Básquetbol (Lunes y Miércoles)</li>
              <li className={styles.listItem}>• Yoga y Capoeira (Martes y Jueves)</li>
              <li className={styles.listItem}>• Natación (Viernes)</li>
              <li className={styles.listItem}>○ Grupos organizados por edad y nivel de habilidad</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 3: Un poco más (Cyan) */}
      <section className={styles.sectionCyan}>
        <div className={styles.sectionContent}>
          {/* Triángulo decorativo blanco */}
          <div className={styles.triangleWhite} style={{ backgroundImage: `url(${motorasImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>un poco mas.</h2>
            <p className={styles.description}>
              Las actividades recreativas en CINTLI Montessori van más allá del ejercicio físico. 
              Cada experiencia está diseñada para desarrollar la confianza, autoestima y habilidades 
              sociales que los niños necesitan para su vida diaria.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Desarrollo de habilidades motoras</li>
              <li className={styles.listItem}>• Fomento del trabajo en equipo</li>
              <li className={styles.listItem}>• Promoción de hábitos saludables</li>
              <li className={styles.listItem}>○ Aprender jugando es nuestra filosofía</li>
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

export default ActividadesRecreativas;
