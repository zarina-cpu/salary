// Конфигурация сервера: порт, CORS, путь к БД
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Получаем текущую директорию (для ES-модулей)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  // Порт сервера
  port: process.env.PORT || 3001,

  // Настройки CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Адрес фронтенда Vite
    credentials: true,
  },

  // Путь к файлу базы данных SQLite
  dbPath: join(__dirname, '../../data/salary-tracker.db'),
};