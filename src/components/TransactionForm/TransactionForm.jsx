// Форма добавления/редактирования транзакции
import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import styles from './TransactionForm.module.css';

function TransactionForm({
  onSubmit,
  onCancel,
  editData = null,
}) {
  // Начальное состояние формы
  const initialFormData = {
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    comment: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editData) {
      setFormData({
        type: editData.type || 'expense',
        category: editData.category || '',
        amount: editData.amount?.toString() || '',
        date: editData.date || new Date().toISOString().split('T')[0],
        comment: editData.comment || '',
      });
    }
  }, [editData]);

  // Получение категорий в зависимости от типа операции
  const getCategories = () => {
    return formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  };

  // Обработчик изменения типа операции
  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: '', // Сбрасываем категорию при смене типа
    }));
    setErrors((prev) => ({ ...prev, category: '' }));
  };

  // Обработчик изменения поля
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Валидация формы
  const validate = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Введите корректную сумму';
    }

    if (!formData.date) {
      newErrors.date = 'Выберите дату';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Преобразуем данные перед отправкой
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    onSubmit?.(transactionData);
  };

  const categories = getCategories();
  const isEditing = !!editData;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Тип операции</label>
        <div className={styles.typeSwitcher}>
          <button
            type="button"
            className={`${styles.typeButton} ${
              formData.type === 'income'
                ? `${styles.typeButtonActive} ${styles.typeButtonIncomeActive}`
                : ''
            }`}
            onClick={() => handleTypeChange('income')}
          >
            📈 Доход
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${
              formData.type === 'expense'
                ? `${styles.typeButtonActive} ${styles.typeButtonExpenseActive}`
                : ''
            }`}
            onClick={() => handleTypeChange('expense')}
          >
            📉 Расход
          </button>
        </div>
      </div>

      {/* Сетка полей */}
      <div className={styles.formGrid}>
        {/* Категория */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Категория <span className={styles.required}>*</span>
          </label>
          <select
            className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
            value={formData.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
          >
            <option value="">Выберите категорию</option>
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && <div className={styles.error}>{errors.category}</div>}
        </div>

        {/* Сумма */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Сумма <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`${styles.input} ${errors.amount ? styles.inputError : ''}`}
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleFieldChange('amount', e.target.value)}
          />
          {errors.amount && <div className={styles.error}>{errors.amount}</div>}
        </div>

        {/* Дата */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Дата <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
            value={formData.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
          />
          {errors.date && <div className={styles.error}>{errors.date}</div>}
        </div>

        {/* Комментарий */}
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label className={styles.label}>Комментарий</label>
          <textarea
            className={styles.textarea}
            placeholder="Добавьте комментарий (необязательно)"
            value={formData.comment}
            onChange={(e) => handleFieldChange('comment', e.target.value)}
          />
        </div>
      </div>

      {/* Футер с кнопками */}
      <div className={styles.formFooter}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={onCancel}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {isEditing ? 'Сохранить изменения' : 'Добавить операцию'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;