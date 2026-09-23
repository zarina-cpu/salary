// Корневой компонент приложения с роутингом
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import styles from './App.module.css';

// Временные заглушки для страниц (будут заменены на реальные компоненты в фазе C)
const DashboardPlaceholder = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
    <h2>Главная страница</h2>
    <p>Дашборд будет здесь</p>
  </div>
);

const HistoryPlaceholder = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
    <h2>История операций</h2>
    <p>Список транзакций будет здесь</p>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
    <h2>Аналитика</h2>
    <p>Графики будут здесь</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPlaceholder />} />
          <Route path="history" element={<HistoryPlaceholder />} />
          <Route path="analytics" element={<AnalyticsPlaceholder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;