// Утилиты форматирования даты и валюты

/**
 * Форматирование суммы в валюту (рубли)
 * @param {number} amount - Сумма
 * @param {boolean} showSign - Показывать знак + или -
 * @returns {string} Отформатированная строка
 */
export const formatCurrency = (amount, showSign = false) => {
  const value = amount ?? 0;
  const formatted = Math.abs(value).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (showSign) {
    const sign = value >= 0 ? '+' : '−';
    return `${sign}${formatted} ₽`;
  }

  return `${formatted} ₽`;
};

/**
 * Форматирование даты в длинный формат (24 сентября 2026)
 * @param {string|Date} dateString - Дата в формате ISO или объект Date
 * @returns {string} Отформатированная дата
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
 * Форматирование даты в короткий формат (24.09.2026)
 * @param {string|Date} dateString - Дата в формате ISO или объект Date
 * @returns {string} Отформатированная дата
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
 * Форматирование месяца для графиков (Сен 2026)
 * @param {string|Date} dateString - Дата в формате ISO или объект Date
 * @returns {string} Отформатированный месяц
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
 * Получение текущей даты в формате ISO (YYYY-MM-DD)
 * @returns {string} Дата в формате ISO
 */
export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Получение ключа месяца для группировки (2026-09)
 * @param {string|Date} dateString - Дата в формате ISO или объект Date
 * @returns {string} Ключ месяца
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