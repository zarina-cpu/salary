// Страница истории операций с реальными данными и фильтрами
import React, { useState, useEffect } from 'react';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getFilteredTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import { getItem } from '../../services/storage';
import { STORAGE_KEYS } from '../../utils/constants';
import styles from './History.module.css';

function History() {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
  });

  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Валюта по умолчанию
  const [defaultCurrency, setDefaultCurrency] = useState(() => {
    const settings = getItem(STORAGE_KEYS.SETTINGS, {});
    return settings.currency || 'UZS';
  });

  const loadData = () => {
    const filtered = getFilteredTransactions(filters);
    setTransactions(filtered);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      type: '',
      category: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const getAllCategories = () => {
    if (filters.type === 'income') {
      return INCOME_CATEGORIES;
    }
    if (filters.type === 'expense') {
      return EXPENSE_CATEGORIES;
    }
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  };

  const handleSubmit = (transactionData) => {
    try {
      if (editingTransaction) {
        if (editingTransaction.type === 'income') {
          updateIncome(editingTransaction.id, transactionData);
        } else {
          updateExpense(editingTransaction.id, transactionData);
        }
      } else {
        if (transactionData.type === 'income') {
          addIncome(transactionData);
        } else {
          addExpense(transactionData);
        }
      }

      loadData();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Ошибка при сохранении транзакции:', error);
      alert('Произошла ошибка при сохранении операции');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!id) return;

    if (!window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }

    try {
      const transaction = transactions.find((t) => t.id === id);
      if (!transaction) return;

      if (transaction.type === 'income') {
        deleteIncome(id);
      } else {
        deleteExpense(id);
      }

      loadData();
    } catch (error) {
      console.error('Ошибка при удалении транзакции:', error);
      alert('Произошла ошибка при удалении операции');
    }
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const categories = getAllCategories();

  return (
    <div className={styles.history}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <h1 className={styles.title}>История операций</h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
        >
          + Добавить операцию
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterSelect}
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Все типы</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterSelect}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Все категории</option>
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата от</label>
          <input
            type="date"
            className={styles.filterInput}
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата до</label>
          <input
            type="date"
            className={styles.filterInput}
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>

        <button className={styles.resetButton} onClick={handleResetFilters}>
          Сбросить
        </button>
      </div>

      <div className={styles.transactionsContainer}>
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Нет операций"
          emptyDescription="Добавьте первую операцию или измените фильтры"
          currency={defaultCurrency}
        />
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Добавить операцию'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          editData={editingTransaction}
          defaultCurrency={defaultCurrency}
        />
      </Modal>
    </div>
  );
}

export default History;