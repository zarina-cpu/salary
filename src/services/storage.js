// Обёртка localStorage для безопасной работы с хранилищем

/**
 * Получение данных из localStorage с парсингом JSON
 * @param {string} key - Ключ хранилища
 * @param {any} defaultValue - Значение по умолчанию, если ключ не найден
 * @returns {any} Распарсенные данные или defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Ошибка при чтении из localStorage (ключ: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Сохранение данных в localStorage с сериализацией JSON
 * @param {string} key - Ключ хранилища
 * @param {any} value - Данные для сохранения
 * @returns {boolean} true если успешно, false если ошибка
 */
export const setItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Ошибка при записи в localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Удаление данных из localStorage
 * @param {string} key - Ключ хранилища
 * @returns {boolean} true если успешно, false если ошибка
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Ошибка при удалении из localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Очистка всего localStorage
 * @returns {boolean} true если успешно, false если ошибка
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Ошибка при очистке localStorage:', error);
    return false;
  }
};

/**
 * Генерация уникального идентификатора (UUID)
 * @returns {string} UUID v4
 */
export const generateId = () => {
  // Используем crypto.randomUUID() если доступен
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: генерация UUID вручную
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};