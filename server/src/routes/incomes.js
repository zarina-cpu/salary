// Роутер для работы с доходами
import { Router } from 'express';
import * as incomeController from '../controllers/incomeController.js';
import { validateIncome, validateQuery } from '../middleware/validate.js';

const router = Router();

/**
 * GET /api/v1/incomes
 * Получение списка доходов с пагинацией и фильтрами
 * Query: page, limit, category, date_from, date_to
 */
router.get('/', validateQuery, incomeController.getAll);

/**
 * GET /api/v1/incomes/:id
 * Получение дохода по ID
 */
router.get('/:id', incomeController.getById);

/**
 * POST /api/v1/incomes
 * Создание нового дохода
 * Body: { amount, date, category, comment? }
 */
router.post('/', validateIncome(false), incomeController.create);

/**
 * PUT /api/v1/incomes/:id
 * Обновление существующего дохода
 * Body: { amount?, date?, category?, comment? }
 */
router.put('/:id', validateIncome(true), incomeController.update);

/**
 * DELETE /api/v1/incomes/:id
 * Удаление дохода по ID
 */
router.delete('/:id', incomeController.remove);

export default router;