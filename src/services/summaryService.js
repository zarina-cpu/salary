// Сервис агрегации данных для дашборда и аналитики
import { getIncomes, getTotalIncome } from './incomeService';
import { getExpenses, getTotalExpense } from './expenseService';
import { getCategoryLabel } from './categoryService';
import { formatMonth, getMonthKey } from '../utils/formatters';

/**
 * Получение общего баланса
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
 */
export const getByCategory = (type = 'expense') => {
  const items = type === 'income' ? getIncomes() : getExpenses();

  const categoryMap = {};

  (items || []).forEach((item) => {
    const categoryId = item?.category || 'other';
    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = 0;
    }
    categoryMap[categoryId] += item?.amount || 0;
  });

  const result = Object.entries(categoryMap)
    .map(([categoryId, value]) => ({
      name: getCategoryLabel(categoryId, type),
      value: Math.round(value * 100) / 100,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return result;
};

/**
 * Получение помесячной сводки для столбчатого графика
 */
export const getMonthlySummary = (monthsCount = 6) => {
  const incomes = getIncomes();
  const expenses = getExpenses();

  const monthlyMap = {};

  (incomes || []).forEach((item) => {
    const monthKey = getMonthKey(item?.date);
    if (!monthKey) return;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }
    monthlyMap[monthKey].income += item?.amount || 0;
  });

  (expenses || []).forEach((item) => {
    const monthKey = getMonthKey(item?.date);
    if (!monthKey) return;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }
    monthlyMap[monthKey].expense += item?.amount || 0;
  });

  const result = Object.entries(monthlyMap)
    .map(([monthKey, data]) => ({
      month: formatMonth(monthKey + '-01'),
      monthKey,
      income: Math.round(data.income * 100) / 100,
      expense: Math.round(data.expense * 100) / 100,
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-monthsCount);

  return result;
};

/**
 * Получение последних транзакций
 */
export const getRecentTransactions = (limit = 10) => {
  const incomes = getIncomes();
  const expenses = getExpenses();

  const allTransactions = [...(incomes || []), ...(expenses || [])];

  allTransactions.sort((a, b) => {
    const dateCompare = new Date(b?.date || 0) - new Date(a?.date || 0);
    if (dateCompare !== 0) return dateCompare;
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  return allTransactions.slice(0, limit);
};

/**
 * Получение всех транзакций с фильтрацией
 */
export const getFilteredTransactions = (filters = {}) => {
  const { type = '', category = '', dateFrom = '', dateTo = '' } = filters;

  let transactions = [];

  if (type === 'income') {
    transactions = getIncomes();
  } else if (type === 'expense') {
    transactions = getExpenses();
  } else {
    const incomes = getIncomes();
    const expenses = getExpenses();
    transactions = [...(incomes || []), ...(expenses || [])];
  }

  if (category) {
    transactions = transactions.filter((t) => t?.category === category);
  }

  if (dateFrom) {
    transactions = transactions.filter((t) => t?.date >= dateFrom);
  }

  if (dateTo) {
    transactions = transactions.filter((t) => t?.date <= dateTo);
  }

  transactions.sort((a, b) => {
    const dateCompare = new Date(b?.date || 0) - new Date(a?.date || 0);
    if (dateCompare !== 0) return dateCompare;
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  return transactions;
};