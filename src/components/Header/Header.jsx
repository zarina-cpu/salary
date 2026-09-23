// Компонент хедера с навигацией
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Логотип */}
        <NavLink to="/" className={styles.logo}>
          <span className={styles.logoIcon}>💰</span>
          <span>Salary Tracker</span>
        </NavLink>

        {/* Навигация */}
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Главная
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            История
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Аналитика
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;