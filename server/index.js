// Точка входа сервера: запуск Express-приложения
import app from './src/app.js';
import { config } from './src/config/index.js';

// Импортируем подключение к БД для инициализации при старте
import './src/db/connection.js';

const PORT = config.port;

// Запускаем сервер
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Сервер Salary Tracker запущен`);
  console.log(`📍 Адрес: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API: http://localhost:${PORT}/api/v1`);
  console.log('='.repeat(60));
  console.log('');
  console.log('Доступные эндпоинты:');
  console.log('  GET    /api/v1/incomes          — список доходов');
  console.log('  GET    /api/v1/incomes/:id      — доход по ID');
  console.log('  POST   /api/v1/incomes          — создать доход');
  console.log('  PUT    /api/v1/incomes/:id      — обновить доход');
  console.log('  DELETE /api/v1/incomes/:id      — удалить доход');
  console.log('');
  console.log('  GET    /api/v1/expenses         — список расходов');
  console.log('  GET    /api/v1/expenses/:id     — расход по ID');
  console.log('  POST   /api/v1/expenses         — создать расход');
  console.log('  PUT    /api/v1/expenses/:id     — обновить расход');
  console.log('  DELETE /api/v1/expenses/:id     — удалить расход');
  console.log('');
  console.log('  GET    /api/v1/summary/balance      — общий баланс');
  console.log('  GET    /api/v1/summary/by-category  — по категориям');
  console.log('  GET    /api/v1/summary/by-month     — по месяцам');
  console.log('');
  console.log('Для остановки нажмите Ctrl+C');
  console.log('='.repeat(60));
});

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанный отказ Promise:', reason);
  process.exit(1);
});