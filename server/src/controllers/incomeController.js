// Контроллер доходов: обработка HTTP-запросов
import * as incomeService from '../services/incomeService.js';

/**
 * GET /api/v1/incomes
 * Получение списка доходов с пагинацией и фильтрами
 */
export const getAll = (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    };

    const result = incomeService.getAll(filters);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/incomes/:id
 * Получение дохода по ID
 */
export const getById = (req, res, next) => {
  try {
    const { id } = req.params;
    const income = incomeService.getById(id);

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/incomes
 * Создание нового дохода
 */
export const create = (req, res, next) => {
  try {
    const incomeData = {
      amount: Number(req.body.amount),
      date: req.body.date,
      category: req.body.category,
      comment: req.body.comment,
    };

    const income = incomeService.create(incomeData);

    res.status(201).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/incomes/:id
 * Обновление существующего дохода
 */
export const update = (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Собираем только переданные поля
    if (req.body.amount !== undefined) updateData.amount = Number(req.body.amount);
    if (req.body.date !== undefined) updateData.date = req.body.date;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.comment !== undefined) updateData.comment = req.body.comment;

    const income = incomeService.update(id, updateData);

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/incomes/:id
 * Удаление дохода по ID
 */
export const remove = (req, res, next) => {
  try {
    const { id } = req.params;
    incomeService.remove(id);

    res.json({
      success: true,
      message: 'Доход успешно удалён',
    });
  } catch (error) {
    next(error);
  }
};