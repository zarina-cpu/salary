// Точка входа приложения
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// Получаем корневой элемент из index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Не найден элемент с id="root" в index.html');
}

// Создаём корень React 18
const root = ReactDOM.createRoot(rootElement);

// Рендерим приложение в StrictMode для лучших практик
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);