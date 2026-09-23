// Сервис для работы с доходами (CRUD операции)
import { getItem, setItem, generateId } from './storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Получение всех доходов из localStorage
 * @returns {Array} Массив объектов доходов
 */
export const getIncomes = () => {
  const incomes = getItem(STORAGE_KEYS.INCOMES, []);
  return Array.isArray(incomes) ? incomes : [];
};

/**
 * Получение дохода по ID
 * @param {string} id - Идентификатор дохода
 * @returns {Object|null} Объект дохода или null
 */
export const getIncomeById = (id) => {
  if (!id) return null;
  
  const incomes = getIncomes();
  return incomes.find((income) => income.id === id) || null;
};

/**
 * Добавление нового дохода
 * @param {Object} incomeData - Данные дохода (category, amount, date, comment)
 * @returns {Object} Созданный объект дохода с id
 */
export const addIncome = (incomeData) => {
  if (!incomeData) {
    throw new Error('Данные дохода не предоставлены');
  }

  const incomes = getIncomes();
  
  // Создаём новый объект дохода с уникальным ID
  const newIncome = {
    id: generateId(),
    type: 'income', // Фиксированный тип
    category: incomeData.category || '',
    amount: parseFloat(incomeData.amount) || 0,
    date: incomeData.date || new Date().toISOString().split('T')[0],
    comment: incomeData.comment || '',
    createdAt: new Date().toISOString(),
  };

  // Добавляем в начало массива (новые записи сверху)
  incomes.unshift(newIncome);
  
  // Сохраняем в localStorage
  setItem(STORAGE_KEYS.INCOMES, incomes);
  
  return newIncome;
};

/**
 * Обновление существующего дохода
 * @param {string} id - Идентификатор дохода
 * @param {Object} updates - Обновлённые данные
 * @returns {Object|null} Обновлённый объект дохода или null если не найден
 */
export const updateIncome = (id, updates) => {
  if (!id || !updates) {
    throw new Error('ID или данные обновления не предоставлены');
  }

  const incomes = getIncomes();
  const index = incomes.findIndex((income) => income.id === id);

  if (index === -1) {
    return null;
  }

  // Обновляем только переданные поля
  const updatedIncome = {
    ...incomes[index],
    ...updates,
    id, // ID нельзя изменить
    type: 'income', // Тип фиксированный
    updatedAt: new Date().toISOString(),
  };

  incomes[index] = updatedIncome;
  
  // Сохраняем в localStorage
  setItem(STORAGE_KEYS.INCOMES, incomes);
  
  return updatedIncome;
};

/**
 * Удаление дохода по ID
 * @param {string} id - Идентификатор дохода
 * @returns {boolean} true если успешно удалён, false если не найден
 */
export const deleteIncome = (id) => {
  if (!id) {
    throw new Error('ID не предоставлен');
  }

  const incomes = getIncomes();
  const filteredIncomes = incomes.filter((income) => income.id !== id);

  // Если длина не изменилась — доход не найден
  if (filteredIncomes.length === incomes.length) {
    return false;
  }

  // Сохраняем обновлённый массив
  setItem(STORAGE_KEYS.INCOMES, filteredIncomes);
  
  return true;
};

/**
 * Получение общей суммы всех доходов
 * @returns {number} Сумма всех доходов
 */
export const getTotalIncome = () => {
  const incomes = getIncomes();
  return incomes.reduce((total, income) => total + (income.amount || 0), 0);
};