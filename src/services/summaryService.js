// Сервис агрегации данных для дашборда и аналитики
import { getIncomes, getTotalIncome } from './incomeService';
import { getExpenses, getTotalExpense } from './expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { formatMonth, getMonthKey } from '../utils/formatters';

/**
 * Получение общего баланса (доходы, расходы, разница)
 * @returns {Object} { totalIncome, totalExpense, balance }
 */
export const getBalance = () => {
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

/**
 * Получение данных по категориям для круговой диаграммы
 * @param {string} type - 'income' или 'expense'
 * @returns {Array} Массив объектов { name, value } для recharts PieChart
 */
export const getByCategory = (type = 'expense') => {
  const isIncome = type === 'income';
  const items = isIncome ? getIncomes() : getExpenses();
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Собираем суммы по категориям
  const categoryMap = {};

  (items || []).forEach((item) => {
    const categoryId = item?.category || 'other';
    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = 0;
    }
    categoryMap[categoryId] += item?.amount || 0;
  });

  // Преобразуем в массив для recharts с метками категорий
  const result = Object.entries(categoryMap)
    .map(([categoryId, value]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        name: category?.label || categoryId,
        value: Math.round(value * 100) / 100,
      };
    })
    .filter((item) => item.value > 0) // Убираем категории с нулевой суммой
    .sort((a, b) => b.value - a.value); // Сортируем по убыванию

  return result;
};

/**
 * Получение помесячной сводки для столбчатого графика
 * @param {number} monthsCount - Количество последних месяцев для отображения
 * @returns {Array} Массив объектов { month, income, expense } для recharts BarChart
 */
export const getMonthlySummary = (monthsCount = 6) => {
  const incomes = getIncomes();
  const expenses = getExpenses();

  // Собираем данные по месяцам
  const monthlyMap = {};

  // Обрабатываем доходы
  (incomes || []).forEach((item) => {
    const monthKey = getMonthKey(item?.date);
    if (!monthKey) return;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }
    monthlyMap[monthKey].income += item?.amount || 0;
  });

  // Обрабатываем расходы
  (expenses || []).forEach((item) => {
    const monthKey = getMonthKey(item?.date);
    if (!monthKey) return;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }
    monthlyMap[monthKey].expense += item?.amount || 0;
  });

  // Преобразуем в массив и сортируем по дате
  const result = Object.entries(monthlyMap)
    .map(([monthKey, data]) => ({
      month: formatMonth(monthKey + '-01'), // Добавляем день для корректного парсинга
      monthKey,
      income: Math.round(data.income * 100) / 100,
      expense: Math.round(data.expense * 100) / 100,
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-monthsCount); // Берём последние N месяцев

  return result;
};

/**
 * Получение последних транзакций (доходы + расходы), отсортированных по дате
 * @param {number} limit - Максимальное количество транзакций
 * @returns {Array} Массив транзакций, отсортированных по дате (новые сверху)
 */
export const getRecentTransactions = (limit = 10) => {
  const incomes = getIncomes();
  const expenses = getExpenses();

  // Объединяем доходы и расходы
  const allTransactions = [...(incomes || []), ...(expenses || [])];

  // Сортируем по дате (новые сверху), затем по createdAt
  allTransactions.sort((a, b) => {
    const dateCompare = new Date(b?.date || 0) - new Date(a?.date || 0);
    if (dateCompare !== 0) return dateCompare;
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  // Возвращаем ограниченное количество
  return allTransactions.slice(0, limit);
};

/**
 * Получение всех транзакций с возможностью фильтрации
 * @param {Object} filters - Объект фильтров { type, category, dateFrom, dateTo }
 * @returns {Array} Отфильтрованный массив транзакций
 */
export const getFilteredTransactions = (filters = {}) => {
  const { type = '', category = '', dateFrom = '', dateTo = '' } = filters;

  let transactions = [];

  // Определяем какие данные загружать
  if (type === 'income') {
    transactions = getIncomes();
  } else if (type === 'expense') {
    transactions = getExpenses();
  } else {
    // Все транзакции
    const incomes = getIncomes();
    const expenses = getExpenses();
    transactions = [...(incomes || []), ...(expenses || [])];
  }

  // Фильтруем по категории
  if (category) {
    transactions = transactions.filter((t) => t?.category === category);
  }

  // Фильтруем по дате от
  if (dateFrom) {
    transactions = transactions.filter((t) => t?.date >= dateFrom);
  }

  // Фильтруем по дате до
  if (dateTo) {
    transactions = transactions.filter((t) => t?.date <= dateTo);
  }

  // Сортируем по дате (новые сверху)
  transactions.sort((a, b) => {
    const dateCompare = new Date(b?.date || 0) - new Date(a?.date || 0);
    if (dateCompare !== 0) return dateCompare;
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  return transactions;
};