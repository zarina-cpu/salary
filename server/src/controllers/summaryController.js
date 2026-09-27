// Контроллер сводки: обработка HTTP-запросов для аналитики
import * as summaryService from '../services/summaryService.js';

/**
 * GET /api/v1/summary/balance
 * Получение общего баланса (доходы, расходы, разница)
 */
export const getBalance = (req, res, next) => {
  try {
    const filters = {
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    };

    const balance = summaryService.getBalance(filters);

    res.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/summary/by-category
 * Получение статистики по категориям (для круговой диаграммы)
 */
export const getByCategory = (req, res, next) => {
  try {
    const type = req.query.type || 'expense';
    const filters = {
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    };

    // Валидация типа
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TYPE',
          message: 'Параметр type должен быть "income" или "expense"',
        },
      });
    }

    const categories = summaryService.getByCategory(type, filters);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/summary/by-month
 * Получение помесячной статистики (для столбчатого графика)
 */
export const getByMonth = (req, res, next) => {
  try {
    const filters = {
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      months_count: req.query.months_count,
    };

    const monthlyData = summaryService.getByMonth(filters);

    res.json({
      success: true,
      data: monthlyData,
    });
  } catch (error) {
    next(error);
  }
};