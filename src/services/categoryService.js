// Сервис для работы с пользовательскими категориями
import { getItem, setItem, generateId } from './storage';
import { STORAGE_KEYS, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';

/**
 * Получение всех пользовательских категорий
 * @returns {Array} Массив объектов { id, label, type }
 */
export const getCustomCategories = () => {
  const categories = getItem(STORAGE_KEYS.CUSTOM_CATEGORIES, []);
  return Array.isArray(categories) ? categories : [];
};

/**
 * Получение пользовательских категорий по типу
 * @param {string} type - 'income' или 'expense'
 * @returns {Array} Массив объектов { id, label }
 */
export const getCustomCategoriesByType = (type) => {
  const allCustom = getCustomCategories();
  return allCustom.filter((cat) => cat.type === type);
};

/**
 * Получение всех категорий (стандартные + пользовательские) по типу
 * @param {string} type - 'income' или 'expense'
 * @returns {Array} Массив объектов { id, label }
 */
export const getAllCategoriesByType = (type) => {
  const standard = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const custom = getCustomCategoriesByType(type);
  return [...standard, ...custom];
};

/**
 * Добавление новой пользовательской категории
 * @param {string} label - Название категории
 * @param {string} type - 'income' или 'expense'
 * @returns {Object} Созданная категория { id, label, type }
 */
export const addCustomCategory = (label, type) => {
  if (!label || !type) {
    throw new Error('Название и тип категории обязательны');
  }

  const categories = getCustomCategories();
  
  // Проверяем, нет ли уже такой категории
  const exists = categories.find(
    (cat) => cat.label.toLowerCase() === label.toLowerCase() && cat.type === type
  );
  
  if (exists) {
    return exists; // Возвращаем существующую
  }

  const newCategory = {
    id: `custom_${generateId()}`,
    label: label.trim(),
    type,
  };

  categories.push(newCategory);
  setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, categories);

  return newCategory;
};

/**
 * Удаление пользовательской категории по ID
 * @param {string} id - Идентификатор категории
 * @returns {boolean} true если успешно удалена
 */
export const deleteCustomCategory = (id) => {
  if (!id) return false;

  const categories = getCustomCategories();
  const filtered = categories.filter((cat) => cat.id !== id);

  if (filtered.length === categories.length) {
    return false;
  }

  setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, filtered);
  return true;
};

/**
 * Получение label категории по id (стандартная или пользовательская)
 * @param {string} categoryId - ID категории
 * @param {string} type - 'income' или 'expense'
 * @returns {string} Название категории
 */
export const getCategoryLabel = (categoryId, type) => {
  if (!categoryId) return '—';

  // Ищем в стандартных
  const standard = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const standardCat = standard.find((c) => c.id === categoryId);
  if (standardCat) return standardCat.label;

  // Ищем в пользовательских
  const custom = getCustomCategories();
  const customCat = custom.find((c) => c.id === categoryId);
  if (customCat) return customCat.label;

  // Если не найдена — возвращаем id
  return categoryId;
};