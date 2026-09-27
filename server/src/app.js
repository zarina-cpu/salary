// Сборка Express-приложения: middleware, роуты, обработка ошибок
import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';

// Создаём экземпляр Express
const app = express();

// ==========================================
// Middleware
// ==========================================

// CORS — разрешаем запросы с фронтенда
app.use(cors(config.cors));

// Парсинг JSON-тела запросов
app.use(express.json());

// Парсинг URL-encoded данных (на случай форм)
app.use(express.urlencoded({ extended: true }));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  const start = Date.now();
  
  // Логируем после отправки ответа
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });
  
  next();
});

// ==========================================
// Проверка работоспособности сервера
// ==========================================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Сервер Salary Tracker работает',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// API-роуты (версионирование /api/v1)
// ==========================================

app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/summary', summaryRouter);

// ==========================================
// Обработка ошибок (должны быть в самом конце!)
// ==========================================

// 404 — маршрут не найден
app.use(notFoundHandler);

// Централизованный обработчик ошибок
app.use(errorHandler);

export default app;