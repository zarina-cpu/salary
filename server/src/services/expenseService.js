// Сервис для работы с расходами: CRUD-операции + SQL-запросы
import crypto from 'crypto';
import db from '../db/connection.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Маппинг строки из БД (snake_case) в объект для API (camelCase)
 */
const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment,
    isRecurring: Boolean(row.is_recurring),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Получение всех расходов с пагинацией и фильтрами
 * @param {Object} filters - { page, limit, category, date_from, date_to, is_recurring }
 * @returns {Object} { data, pagination }
 */
export const getAll = (filters = {}) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const offset = (page - 1) * limit;

  // Собираем условия WHERE
  const conditions = [];
  const params = [];

  if (filters.category) {
    conditions.push('category = ?');
    params.push(filters.category);
  }

  if (filters.date_from) {
    conditions.push('date >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    conditions.push('date <= ?');
    params.push(filters.date_to);
  }

  if (filters.is_recurring !== undefined) {
    conditions.push('is_recurring = ?');
    params.push(filters.is_recurring === 'true' || filters.is_recurring === '1' ? 1 : 0);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Получаем общее количество записей для пагинации
  const countSql = `SELECT COUNT(*) as total FROM expenses ${whereClause}`;
  const countRow = db.prepare(countSql).get(...params);
  const total = countRow.total;

  // Получаем данные с пагинацией
  const dataSql = `
    SELECT id, amount, date, category, comment, is_recurring, created_at, updated_at
    FROM expenses
    ${whereClause}
    ORDER BY date DESC, created_at DESC
    LIMIT ? OFFSET ?
  `;
  const rows = db.prepare(dataSql).all(...params, limit, offset);

  return {
    data: rows.map(mapRow),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Получение расхода по ID
 * @param {string} id - UUID расхода
 * @returns {Object} Объект расхода
 */
export const getById = (id) => {
  const sql = `
    SELECT id, amount, date, category, comment, is_recurring, created_at, updated_at
    FROM expenses
    WHERE id = ?
  `;
  const row = db.prepare(sql).get(id);

  if (!row) {
    throw new AppError('Расход не найден', 404, 'EXPENSE_NOT_FOUND');
  }

  return mapRow(row);
};

/**
 * Создание нового расхода
 * @param {Object} data - { amount, date, category, comment, is_recurring }
 * @returns {Object} Созданный объект расхода
 */
export const create = (data) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const comment = data.comment || '';
  const isRecurring = data.is_recurring ? 1 : 0;

  const sql = `
    INSERT INTO expenses (id, amount, date, category, comment, is_recurring, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(sql).run(id, data.amount, data.date, data.category, comment, isRecurring, now, now);

  return getById(id);
};

/**
 * Обновление существующего расхода
 * @param {string} id - UUID расхода
 * @param {Object} data - Обновляемые поля
 * @returns {Object} Обновлённый объект расхода
 */
export const update = (id, data) => {
  // Проверяем существование записи
  const existing = getById(id);

  // Собираем поля для обновления
  const fields = [];
  const params = [];

  if (data.amount !== undefined) {
    fields.push('amount = ?');
    params.push(data.amount);
  }

  if (data.date !== undefined) {
    fields.push('date = ?');
    params.push(data.date);
  }

  if (data.category !== undefined) {
    fields.push('category = ?');
    params.push(data.category);
  }

  if (data.comment !== undefined) {
    fields.push('comment = ?');
    params.push(data.comment);
  }

  if (data.is_recurring !== undefined) {
    fields.push('is_recurring = ?');
    params.push(data.is_recurring ? 1 : 0);
  }

  // Если нечего обновлять — возвращаем текущую запись
  if (fields.length === 0) {
    return existing;
  }

  // Обновляем updated_at
  fields.push('updated_at = ?');
  params.push(new Date().toISOString());

  // Добавляем id в конец для WHERE
  params.push(id);

  const sql = `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(sql).run(...params);

  return getById(id);
};

/**
 * Удаление расхода по ID
 * @param {string} id - UUID расхода
 * @returns {boolean} true если успешно удалён
 */
export const remove = (id) => {
  // Проверяем существование записи
  getById(id);

  const sql = `DELETE FROM expenses WHERE id = ?`;
  const result = db.prepare(sql).run(id);

  if (result.changes === 0) {
    throw new AppError('Расход не найден', 404, 'EXPENSE_NOT_FOUND');
  }

  return true;
};