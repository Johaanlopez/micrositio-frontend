import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Home.module.css';
import navidadImg from '../assets/Navidad.png';
import actDeportivaImg from '../assets/actDeportiva.png';
import colegioImg from '../assets/colegio.png';

const Home: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      {/* Sección 1: Próximos eventos (Rojo) */}
      <section className={styles.sectionRed}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleRight} style={{ backgroundImage: `url(${navidadImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>Próximos eventos</h2>
            <p className={styles.description}>
              En CINTLI Montessori organizamos eventos educativos y recreativos diseñados 
              para enriquecer la experiencia de aprendizaje de nuestros estudiantes. Cada 
              actividad promueve valores, creatividad y desarrollo integral.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Festival de Primavera - 15 de Marzo</li>
              <li className={styles.listItem}>• Feria de Ciencias - 28 de Abril</li>
              <li className={styles.listItem}>• Día del Niño - 30 de Abril</li>
              <li className={styles.listItem}>○ Juegos, talleres y actividades para toda la familia</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 2: Actividades (Verde) */}
      <section className={styles.sectionGreen}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo blanco */}
          <div className={styles.circleLeft}></div>
          
          <div className={styles.contentRight}>
            <h2 className={styles.title}>Actividades</h2>
            <p className={styles.description}>
              Nuestro programa incluye actividades semanales que fomentan el desarrollo 
              físico, emocional y cognitivo. Desde deportes hasta artes, cada niño encuentra 
              su espacio para crecer y aprender.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Yoga y mindfulness para niños</li>
              <li className={styles.listItem}>• Talleres de arte y música</li>
              <li className={styles.listItem}>• Deportes y juegos cooperativos</li>
              <li className={styles.listItem}>○ Actividades diseñadas según el método Montessori</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 3: Un poco más (Azul) */}
      <section className={styles.sectionPurple}>
        <div className={styles.sectionContent}>
          {/* Triángulo decorativo blanco */}
          <div className={styles.triangleWhite}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>un poco mas.</h2>
            <p className={styles.description}>
              En CINTLI creemos en la educación integral que respeta el ritmo de cada niño. 
              Nuestros eventos y actividades están cuidadosamente planeados para crear 
              experiencias significativas que perduren toda la vida.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Educación personalizada</li>
              <li className={styles.listItem}>• Ambiente preparado Montessori</li>
              <li className={styles.listItem}>• Comunidad de aprendizaje</li>
              <li className={styles.listItem}>○ Fomentamos la independencia, creatividad y amor por el aprendizaje</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 4: Talleres (Naranja) */}
      <section className={styles.sectionOrange}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo */}
          <div className={styles.circleOrange}></div>
          
          <div className={styles.contentRight}>
            <h2 className={styles.title}>Talleres Especiales</h2>
            <p className={styles.description}>
              Ofrecemos talleres mensuales que complementan el aprendizaje diario y 
              permiten a los niños explorar nuevos intereses y desarrollar habilidades 
              especiales en un ambiente de colaboración y creatividad.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Cocina creativa y saludable</li>
              <li className={styles.listItem}>• Robótica y programación</li>
              <li className={styles.listItem}>• Teatro y expresión corporal</li>
              <li className={styles.listItem}>○ Experiencias prácticas que inspiran y motivan</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 5: Comunidad (Cyan) */}
      <section className={styles.sectionCyan}>
        <div className={styles.sectionContent}>
          {/* Círculo decorativo */}
          <div className={styles.circleCyan} style={{ backgroundImage: `url(${colegioImg})` }}></div>
          
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>Comunidad CINTLI</h2>
            <p className={styles.description}>
              Somos más que una escuela, somos una familia. Invitamos a padres y tutores 
              a participar activamente en el proceso educativo, creando un vínculo fuerte 
              entre hogar y escuela.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>• Reuniones mensuales con familias</li>
              <li className={styles.listItem}>• Voluntariado en actividades</li>
              <li className={styles.listItem}>• Red de apoyo entre padres</li>
              <li className={styles.listItem}>○ Juntos construimos el futuro de nuestros niños</li>
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

export default Home;
