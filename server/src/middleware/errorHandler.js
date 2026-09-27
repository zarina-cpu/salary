// Централизованный обработчик ошибок Express
// Перехватывает все ошибки и возвращает единый JSON-формат

/**
 * Middleware для обработки ошибок
 * Должен быть подключён последним в цепочке middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Логируем ошибку в консоль для отладки
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err);

  // HTTP-статус: берём из ошибки или используем 500
  const statusCode = err.statusCode || err.status || 500;

  // Код ошибки для клиента (машина-читаемый)
  const errorCode = err.code || 'INTERNAL_ERROR';

  // Сообщение для клиента
  let message = err.message || 'Произошла внутренняя ошибка сервера';

  // В режиме разработки добавляем стек вызовов
  const response = {
    error: {
      code: errorCode,
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(response);
};

/**
 * Middleware для обработки 404 — маршрут не найден
 * Подключается после всех роутов
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Маршрут ${req.method} ${req.originalUrl} не найден`,
    },
  });
};

/**
 * Класс кастомной ошибки с HTTP-статусом
 * Используется в сервисах и контроллерах для генерации ошибок
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}