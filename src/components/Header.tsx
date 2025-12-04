import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import styles from './Header.module.css';
import logoImage from '../assets/logo.png';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {/* Logo clickeable */}
          <Link to="/dashboard" className={styles.logoContainer}>
            <div className={styles.logo}>
              <img src={logoImage} alt="CINTLI Montessori" className={styles.logoImage} />
            </div>
          </Link>

          {/* Botón hamburguesa (solo móvil) */}
          <button 
            className={styles.hamburger} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
          </button>

          {/* Navegación */}
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            <NavLink
              to="/dashboard/actividades-recreativas"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={closeMenu}
            >
              Actividades recreativas
            </NavLink>
            <NavLink
              to="/dashboard/actividades-culturales"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActivePurple : ''}`
              }
              onClick={closeMenu}
            >
              Actividades culturales
            </NavLink>
            <NavLink
              to="/dashboard/eventos-sociales"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActiveYellow : ''}`
              }
              onClick={closeMenu}
            >
              Eventos sociales
            </NavLink>
            
            {/* Botón de cerrar sesión en menú móvil */}
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className={styles.logoutButtonMobile}
            >
              Cerrar Sesión
            </button>
          </nav>

          {/* Usuario info - solo desktop */}
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.username || user?.email || 'Usuario'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
