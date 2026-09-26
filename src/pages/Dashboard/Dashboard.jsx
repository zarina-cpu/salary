// Главная страница — дашборд с реальными данными
import React, { useState, useEffect } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import Modal from '../../components/Modal/Modal';
import TransactionList from '../../components/TransactionList/TransactionList';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getBalance, getRecentTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import { getItem, setItem } from '../../services/storage';
import { STORAGE_KEYS } from '../../utils/constants';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Состояние данных
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Валюта по умолчанию
  const [defaultCurrency, setDefaultCurrency] = useState(() => {
    const settings = getItem(STORAGE_KEYS.SETTINGS, {});
    return settings.currency || 'UZS';
  });

  // Загрузка данных
  const loadData = () => {
    const balanceData = getBalance();
    setBalance(balanceData);

    const transactions = getRecentTransactions(10);
    setRecentTransactions(transactions);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Обработчик добавления/редактирования
 // Обработчик добавления/редактирования
const handleSubmit = (transactionData) => {
  try {
    if (editingTransaction) {
      // Режим редактирования
      const oldType = editingTransaction.type;
      const newType = transactionData.type;

      if (oldType === newType) {
        // Тип не изменился — просто обновляем
        if (oldType === 'income') {
          updateIncome(editingTransaction.id, transactionData);
        } else {
          updateExpense(editingTransaction.id, transactionData);
        }
      } else {
        // Тип изменился — удаляем из старого массива и создаём в новом
        if (oldType === 'income') {
          deleteIncome(editingTransaction.id);
        } else {
          deleteExpense(editingTransaction.id);
        }

        if (newType === 'income') {
          addIncome(transactionData);
        } else {
          addExpense(transactionData);
        }
      }
    } else {
      // Режим добавления
      if (transactionData.type === 'income') {
        addIncome(transactionData);
      } else {
        addExpense(transactionData);
      }
    }

    // Перезагружаем данные
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
      const transaction = recentTransactions.find((t) => t.id === id);
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

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>

      <div className={styles.balanceGrid}>
        <BalanceCard
          title="Доходы"
          amount={balance.totalIncome}
          variant="success"
          icon="📈"
          currency={defaultCurrency}
        />
        <BalanceCard
          title="Расходы"
          amount={balance.totalExpense}
          variant="danger"
          icon="📉"
          currency={defaultCurrency}
        />
        <BalanceCard
          title="Баланс"
          amount={balance.balance}
          variant="primary"
          icon="💰"
          currency={defaultCurrency}
        />
      </div>

      <section className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        <TransactionList
          transactions={recentTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Нет операций"
          emptyDescription="Добавьте первую операцию, чтобы начать учёт"
          currency={defaultCurrency}
        />
      </section>

      <button
        className={styles.addButton}
        onClick={() => setShowForm(true)}
        title="Добавить операцию"
      >
        +
      </button>

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

export default Dashboard;