// Главная страница — дашборд с реальными данными
import React, { useState, useEffect } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import Modal from '../../components/Modal/Modal';
import TransactionList from '../../components/TransactionList/TransactionList';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getBalance, getRecentTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Состояние данных
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Загрузка данных при монтировании и после изменений
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
  const handleSubmit = (transactionData) => {
    try {
      if (editingTransaction) {
        // Режим редактирования
        if (editingTransaction.type === 'income') {
          updateIncome(editingTransaction.id, transactionData);
        } else {
          updateExpense(editingTransaction.id, transactionData);
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

  // Обработчик редактирования
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  // Обработчик удаления
  const handleDelete = (id) => {
    if (!id) return;

    // Подтверждение удаления
    if (!window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }

    try {
      // Определяем тип транзакции и вызываем соответствующий сервис
      const transaction = recentTransactions.find((t) => t.id === id);
      if (!transaction) return;

      if (transaction.type === 'income') {
        deleteIncome(id);
      } else {
        deleteExpense(id);
      }

      // Перезагружаем данные
      loadData();
    } catch (error) {
      console.error('Ошибка при удалении транзакции:', error);
      alert('Произошла ошибка при удалении операции');
    }
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className={styles.dashboard}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>Главная</h1>

      {/* Карточки баланса */}
      <div className={styles.balanceGrid}>
        <BalanceCard
          title="Доходы"
          amount={balance.totalIncome}
          variant="success"
          icon="📈"
        />
        <BalanceCard
          title="Расходы"
          amount={balance.totalExpense}
          variant="danger"
          icon="📉"
        />
        <BalanceCard
          title="Баланс"
          amount={balance.balance}
          variant="primary"
          icon="💰"
        />
      </div>

      {/* Секция последних операций */}
      <section className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        <TransactionList
          transactions={recentTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Нет операций"
          emptyDescription="Добавьте первую операцию, чтобы начать учёт"
        />
      </section>

      {/* Плавающая кнопка добавления */}
      <button
        className={styles.addButton}
        onClick={() => setShowForm(true)}
        title="Добавить операцию"
      >
        +
      </button>

      {/* Модальное окно с формой */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Добавить операцию'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;