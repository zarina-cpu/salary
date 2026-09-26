// Утилиты форматирования даты и валюты
import { CURRENCIES } from './constants';

/**
 * Получение символа валюты по ID
 */
export const getCurrencySymbol = (currencyId = 'UZS') => {
  const currency = CURRENCIES.find((c) => c.id === currencyId);
  return currency?.symbol || 'сўм';
};

/**
 * Форматирование суммы в валюту
 * @param {number} amount - Сумма
 * @param {string} currencyId - ID валюты
 * @param {boolean} showSign - Показывать знак + или - (для транзакций)
 * @returns {string} Отформатированная строка
 */
export const formatCurrency = (amount, currencyId = 'UZS', showSign = false) => {
  const value = amount ?? 0;
  const symbol = getCurrencySymbol(currencyId);

  if (showSign) {
    // Для транзакций: абсолютное значение с префиксом +/−
    const absValue = Math.abs(value);
    const formatted = absValue.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    const sign = value >= 0 ? '+' : '−';
    return `${sign}${formatted} ${symbol}`;
  }

  // Для баланса и общих сумм: сохраняем знак минус
  const formatted = value.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${symbol}`;
};

/**
 * Форматирование даты в длинный формат
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Форматирование даты в короткий формат
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Форматирование месяца для графиков
 */
export const formatMonth = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Получение текущей даты в формате ISO
 */
export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Получение ключа месяца для группировки
 */
export const getMonthKey = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  } catch {
    return '';
  }
};