// Роутер для работы с расходами
import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { validateExpense, validateQuery } from '../middleware/validate.js';

const router = Router();

/**
 * GET /api/v1/expenses
 * Получение списка расходов с пагинацией и фильтрами
 * Query: page, limit, category, date_from, date_to, is_recurring
 */
router.get('/', validateQuery, expenseController.getAll);

/**
 * GET /api/v1/expenses/:id
 * Получение расхода по ID
 */
router.get('/:id', expenseController.getById);

/**
 * POST /api/v1/expenses
 * Создание нового расхода
 * Body: { amount, date, category, comment?, is_recurring? }
 */
router.post('/', validateExpense(false), expenseController.create);

/**
 * PUT /api/v1/expenses/:id
 * Обновление существующего расхода
 * Body: { amount?, date?, category?, comment?, is_recurring? }
 */
router.put('/:id', validateExpense(true), expenseController.update);

/**
 * DELETE /api/v1/expenses/:id
 * Удаление расхода по ID
 */
router.delete('/:id', expenseController.remove);

export default router;