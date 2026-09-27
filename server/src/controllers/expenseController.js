// Контроллер расходов: обработка HTTP-запросов
import * as expenseService from '../services/expenseService.js';

/**
 * GET /api/v1/expenses
 * Получение списка расходов с пагинацией и фильтрами
 */
export const getAll = (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      is_recurring: req.query.is_recurring,
    };

    const result = expenseService.getAll(filters);

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
 * GET /api/v1/expenses/:id
 * Получение расхода по ID
 */
export const getById = (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = expenseService.getById(id);

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/expenses
 * Создание нового расхода
 */
export const create = (req, res, next) => {
  try {
    const expenseData = {
      amount: Number(req.body.amount),
      date: req.body.date,
      category: req.body.category,
      comment: req.body.comment,
      is_recurring: req.body.is_recurring,
    };

    const expense = expenseService.create(expenseData);

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/expenses/:id
 * Обновление существующего расхода
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
    if (req.body.is_recurring !== undefined) updateData.is_recurring = req.body.is_recurring;

    const expense = expenseService.update(id, updateData);

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/expenses/:id
 * Удаление расхода по ID
 */
export const remove = (req, res, next) => {
  try {
    const { id } = req.params;
    expenseService.remove(id);

    res.json({
      success: true,
      message: 'Расход успешно удалён',
    });
  } catch (error) {
    next(error);
  }
};