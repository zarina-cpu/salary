// Компонент layout: обёртка с хедером и основной областью контента
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './Layout.module.css';

function Layout() {
  return (
    <div className={styles.layout}>
      {/* Шапка с навигацией */}
      <Header />

      {/* Основная область контента */}
      <main className={styles.container}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;