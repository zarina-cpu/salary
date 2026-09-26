// Константы категорий для доходов и расходов
// Используются для валидации и отображения

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' },
  { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' },
  { id: 'other', label: 'Прочее' },
];

// Вспомогательные функции для работы с категориями

/**
 * Получить все ID категорий доходов
 */
export const getIncomeCategoryIds = () => INCOME_CATEGORIES.map(c => c.id);

/**
 * Получить все ID категорий расходов
 */
export const getExpenseCategoryIds = () => EXPENSE_CATEGORIES.map(c => c.id);

/**
 * Получить label категории по ID для доходов
 */
export const getIncomeCategoryLabel = (id) => {
  const category = INCOME_CATEGORIES.find(c => c.id === id);
  return category ? category.label : null;
};

/**
 * Получить label категории по ID для расходов
 */
export const getExpenseCategoryLabel = (id) => {
  const category = EXPENSE_CATEGORIES.find(c => c.id === id);
  return category ? category.label : null;
};