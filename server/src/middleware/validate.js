// Middleware-валидатор для проверки входных данных
// Проверяет amount, date, category и другие поля

import { AppError } from './errorHandler.js';
import {
  getIncomeCategoryIds,
  getExpenseCategoryIds,
} from '../utils/categories.js';

// Регулярное выражение для проверки даты в формате YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Проверка, что строка является валидной датой YYYY-MM-DD
 */
const isValidDate = (dateStr) => {
  if (!DATE_REGEX.test(dateStr)) return false;
  
  // Дополнительная проверка: дата должна существовать в календаре
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateStr);
};

/**
 * Middleware для валидации данных дохода
 * @param {boolean} isUpdate - true если это обновление (все поля опциональны)
 */
export const validateIncome = (isUpdate = false) => {
  return (req, res, next) => {
    const { amount, date, category, comment } = req.body;

    try {
      // Валидация amount
      if (amount !== undefined) {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
          throw new AppError('Сумма должна быть положительным числом', 400, 'INVALID_AMOUNT');
        }
      } else if (!isUpdate) {
        throw new AppError('Поле amount обязательно', 400, 'MISSING_AMOUNT');
      }

      // Валидация date
      if (date !== undefined) {
        if (!isValidDate(date)) {
          throw new AppError('Дата должна быть в формате YYYY-MM-DD', 400, 'INVALID_DATE');
        }
      } else if (!isUpdate) {
        throw new AppError('Поле date обязательно', 400, 'MISSING_DATE');
      }

      // Валидация category
      if (category !== undefined) {
        const validCategories = getIncomeCategoryIds();
        if (!validCategories.includes(category)) {
          throw new AppError(
            `Недопустимая категория. Разрешённые: ${validCategories.join(', ')}`,
            400,
            'INVALID_CATEGORY'
          );
        }
      } else if (!isUpdate) {
        throw new AppError('Поле category обязательно', 400, 'MISSING_CATEGORY');
      }

      // Валидация comment (опционально, но если есть — должна быть строкой)
      if (comment !== undefined && typeof comment !== 'string') {
        throw new AppError('Поле comment должно быть строкой', 400, 'INVALID_COMMENT');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware для валидации данных расхода
 * @param {boolean} isUpdate - true если это обновление (все поля опциональны)
 */
export const validateExpense = (isUpdate = false) => {
  return (req, res, next) => {
    const { amount, date, category, comment, is_recurring } = req.body;

    try {
      // Валидация amount
      if (amount !== undefined) {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
          throw new AppError('Сумма должна быть положительным числом', 400, 'INVALID_AMOUNT');
        }
      } else if (!isUpdate) {
        throw new AppError('Поле amount обязательно', 400, 'MISSING_AMOUNT');
      }

      // Валидация date
      if (date !== undefined) {
        if (!isValidDate(date)) {
          throw new AppError('Дата должна быть в формате YYYY-MM-DD', 400, 'INVALID_DATE');
        }
      } else if (!isUpdate) {
        throw new AppError('Поле date обязательно', 400, 'MISSING_DATE');
      }

      // Валидация category
      if (category !== undefined) {
        const validCategories = getExpenseCategoryIds();
        if (!validCategories.includes(category)) {
          throw new AppError(
            `Недопустимая категория. Разрешённые: ${validCategories.join(', ')}`,
            400,
            'INVALID_CATEGORY'
          );
        }
      } else if (!isUpdate) {
        throw new AppError('Поле category обязательно', 400, 'MISSING_CATEGORY');
      }

      // Валидация comment
      if (comment !== undefined && typeof comment !== 'string') {
        throw new AppError('Поле comment должно быть строкой', 400, 'INVALID_COMMENT');
      }

      // Валидация is_recurring (только для расходов)
      if (is_recurring !== undefined) {
        if (is_recurring !== 0 && is_recurring !== 1 && is_recurring !== true && is_recurring !== false) {
          throw new AppError('Поле is_recurring должно быть 0 или 1', 400, 'INVALID_RECURRING');
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware для валидации query-параметров (пагинация, фильтры)
 */
export const validateQuery = (req, res, next) => {
  try {
    const { page, limit, category, date_from, date_to } = req.query;

    // Валидация page
    if (page !== undefined) {
      const pageNum = Number(page);
      if (!Number.isInteger(pageNum) || pageNum < 1) {
        throw new AppError('Параметр page должен быть целым числом >= 1', 400, 'INVALID_PAGE');
      }
    }

    // Валидация limit
    if (limit !== undefined) {
      const limitNum = Number(limit);
      if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new AppError('Параметр limit должен быть целым числом от 1 до 100', 400, 'INVALID_LIMIT');
      }
    }

    // Валидация date_from
    if (date_from !== undefined && !isValidDate(date_from)) {
      throw new AppError('Параметр date_from должен быть в формате YYYY-MM-DD', 400, 'INVALID_DATE_FROM');
    }

    // Валидация date_to
    if (date_to !== undefined && !isValidDate(date_to)) {
      throw new AppError('Параметр date_to должен быть в формате YYYY-MM-DD', 400, 'INVALID_DATE_TO');
    }

    next();
  } catch (error) {
    next(error);
  }
};