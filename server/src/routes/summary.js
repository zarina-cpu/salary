// Роутер для сводки (аналитика)
import { Router } from 'express';
import * as summaryController from '../controllers/summaryController.js';
import { validateQuery } from '../middleware/validate.js';

const router = Router();

/**
 * GET /api/v1/summary/balance
 * Получение общего баланса (доходы, расходы, разница)
 * Query: date_from, date_to (опционально)
 */
router.get('/balance', validateQuery, summaryController.getBalance);

/**
 * GET /api/v1/summary/by-category
 * Получение статистики по категориям (для круговой диаграммы)
 * Query: type (income|expense), date_from, date_to (опционально)
 */
router.get('/by-category', summaryController.getByCategory);

/**
 * GET /api/v1/summary/by-month
 * Получение помесячной статистики (для столбчатого графика)
 * Query: date_from, date_to, months_count (опционально)
 */
router.get('/by-month', summaryController.getByMonth);

export default router;