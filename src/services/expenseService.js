// Сервис для работы с расходами (CRUD операции)
import { getItem, setItem, generateId } from './storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Получение всех расходов из localStorage
 * @returns {Array} Массив объектов расходов
 */
export const getExpenses = () => {
  const expenses = getItem(STORAGE_KEYS.EXPENSES, []);
  return Array.isArray(expenses) ? expenses : [];
};

/**
 * Получение расхода по ID
 * @param {string} id - Идентификатор расхода
 * @returns {Object|null} Объект расхода или null
 */
export const getExpenseById = (id) => {
  if (!id) return null;
  
  const expenses = getExpenses();
  return expenses.find((expense) => expense.id === id) || null;
};

/**
 * Добавление нового расхода
 * @param {Object} expenseData - Данные расхода (category, amount, date, comment)
 * @returns {Object} Созданный объект расхода с id
 */
export const addExpense = (expenseData) => {
  if (!expenseData) {
    throw new Error('Данные расхода не предоставлены');
  }

  const expenses = getExpenses();
  
  // Создаём новый объект расхода с уникальным ID
  const newExpense = {
    id: generateId(),
    type: 'expense', // Фиксированный тип
    category: expenseData.category || '',
    amount: parseFloat(expenseData.amount) || 0,
    date: expenseData.date || new Date().toISOString().split('T')[0],
    comment: expenseData.comment || '',
    createdAt: new Date().toISOString(),
  };

  // Добавляем в начало массива (новые записи сверху)
  expenses.unshift(newExpense);
  
  // Сохраняем в localStorage
  setItem(STORAGE_KEYS.EXPENSES, expenses);
  
  return newExpense;
};

/**
 * Обновление существующего расхода
 * @param {string} id - Идентификатор расхода
 * @param {Object} updates - Обновлённые данные
 * @returns {Object|null} Обновлённый объект расхода или null если не найден
 */
export const updateExpense = (id, updates) => {
  if (!id || !updates) {
    throw new Error('ID или данные обновления не предоставлены');
  }

  const expenses = getExpenses();
  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) {
    return null;
  }

  // Обновляем только переданные поля
  const updatedExpense = {
    ...expenses[index],
    ...updates,
    id, // ID нельзя изменить
    type: 'expense', // Тип фиксированный
    updatedAt: new Date().toISOString(),
  };

  expenses[index] = updatedExpense;
  
  // Сохраняем в localStorage
  setItem(STORAGE_KEYS.EXPENSES, expenses);
  
  return updatedExpense;
};

/**
 * Удаление расхода по ID
 * @param {string} id - Идентификатор расхода
 * @returns {boolean} true если успешно удалён, false если не найден
 */
export const deleteExpense = (id) => {
  if (!id) {
    throw new Error('ID не предоставлен');
  }

  const expenses = getExpenses();
  const filteredExpenses = expenses.filter((expense) => expense.id !== id);

  // Если длина не изменилась — расход не найден
  if (filteredExpenses.length === expenses.length) {
    return false;
  }

  // Сохраняем обновлённый массив
  setItem(STORAGE_KEYS.EXPENSES, filteredExpenses);
  
  return true;
};

/**
 * Получение общей суммы всех расходов
 * @returns {number} Сумма всех расходов
 */
export const getTotalExpense = () => {
  const expenses = getExpenses();
  return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
};