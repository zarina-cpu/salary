// Сервис сводки: агрегация данных для дашборда и аналитики
import db from '../db/connection.js';

/**
 * Получение общего баланса: сумма доходов, расходов и разница
 * @param {Object} filters - { date_from, date_to } (опционально)
 * @returns {Object} { totalIncome, totalExpense, balance }
 */
export const getBalance = (filters = {}) => {
  const conditions = [];
  const params = [];

  if (filters.date_from) {
    conditions.push('date >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    conditions.push('date <= ?');
    params.push(filters.date_to);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Сумма доходов
  const incomeSql = `SELECT COALESCE(SUM(amount), 0) as total FROM incomes ${whereClause}`;
  const incomeRow = db.prepare(incomeSql).get(...params);
  const totalIncome = incomeRow.total;

  // Сумма расходов
  const expenseSql = `SELECT COALESCE(SUM(amount), 0) as total FROM expenses ${whereClause}`;
  const expenseRow = db.prepare(expenseSql).get(...params);
  const totalExpense = expenseRow.total;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

/**
 * Получение статистики по категориям (для круговой диаграммы)
 * @param {string} type - 'income' или 'expense'
 * @param {Object} filters - { date_from, date_to } (опционально)
 * @returns {Array} Массив объектов { category, total, percentage }
 */
export const getByCategory = (type = 'expense', filters = {}) => {
  const tableName = type === 'income' ? 'incomes' : 'expenses';

  const conditions = [];
  const params = [];

  if (filters.date_from) {
    conditions.push('date >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    conditions.push('date <= ?');
    params.push(filters.date_to);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Группировка по категориям
  const sql = `
    SELECT category, SUM(amount) as total
    FROM ${tableName}
    ${whereClause}
    GROUP BY category
    ORDER BY total DESC
  `;

  const rows = db.prepare(sql).all(...params);

  // Вычисляем общую сумму для процентов
  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

  // Формируем результат с процентами
  return rows.map((row) => ({
    category: row.category,
    total: row.total,
    percentage: grandTotal > 0 ? Math.round((row.total / grandTotal) * 10000) / 100 : 0,
  }));
};

/**
 * Получение помесячной статистики (для столбчатого графика)
 * @param {Object} filters - { date_from, date_to, months_count } (опционально)
 * @returns {Array} Массив объектов { month, income, expense }
 */
export const getByMonth = (filters = {}) => {
  const monthsCount = Number(filters.months_count) || 6;

  // Если даты не указаны — берём последние N месяцев
  let dateFrom = filters.date_from;
  let dateTo = filters.date_to;

  if (!dateFrom || !dateTo) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1);
    dateFrom = dateFrom || startDate.toISOString().split('T')[0];
    dateTo = dateTo || now.toISOString().split('T')[0];
  }

  // Получаем доходы по месяцам
  const incomeSql = `
    SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
    FROM incomes
    WHERE date >= ? AND date <= ?
    GROUP BY month
    ORDER BY month
  `;
  const incomeRows = db.prepare(incomeSql).all(dateFrom, dateTo);

  // Получаем расходы по месяцам
  const expenseSql = `
    SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
    FROM expenses
    WHERE date >= ? AND date <= ?
    GROUP BY month
    ORDER BY month
  `;
  const expenseRows = db.prepare(expenseSql).all(dateFrom, dateTo);

  // Объединяем результаты
  const monthMap = new Map();

  // Добавляем доходы
  incomeRows.forEach((row) => {
    monthMap.set(row.month, { month: row.month, income: row.total, expense: 0 });
  });

  // Добавляем расходы
  expenseRows.forEach((row) => {
    const existing = monthMap.get(row.month);
    if (existing) {
      existing.expense = row.total;
    } else {
      monthMap.set(row.month, { month: row.month, income: 0, expense: row.total });
    }
  });

  // Преобразуем в массив и сортируем по дате
  return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
};