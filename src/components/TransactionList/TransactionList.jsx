// Таблица транзакций с действиями редактирования и удаления
import React from 'react';
import EmptyState from '../EmptyState/EmptyState';
import styles from './TransactionList.module.css';

// Временная функция форматирования даты (будет заменена на formatters.js в фазе E)
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

function TransactionList({
  transactions = [],
  onEdit,
  onDelete,
  emptyMessage = 'Нет операций',
  emptyDescription = 'Добавьте первую операцию',
}) {
  // Если транзакций нет — показываем заглушку
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
        icon="📭"
      />
    );
  }

  return (
    <div className={styles.transactionList}>
      <table className={styles.table}>
        {/* Заголовки колонок */}
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Тип</th>
            <th className={styles.th}>Дата</th>
            <th className={styles.th}>Категория</th>
            <th className={styles.th}>Сумма</th>
            <th className={styles.th}>Комментарий</th>
            <th className={styles.th}>Действия</th>
          </tr>
        </thead>

        {/* Тело таблицы */}
        <tbody className={styles.tbody}>
          {(transactions || []).map((transaction) => {
            const isIncome = transaction?.type === 'income';
            const typeIcon = isIncome ? '📈' : '📉';
            const typeIconClass = isIncome ? styles.typeIconIncome : styles.typeIconExpense;
            const amountClass = isIncome ? styles.amountIncome : styles.amountExpense;
            const amountPrefix = isIncome ? '+' : '−';

            return (
              <tr key={transaction?.id} className={styles.tr}>
                {/* Иконка типа */}
                <td className={`${styles.td} ${styles.typeCell}`}>
                  <div className={`${styles.typeIcon} ${typeIconClass}`}>
                    {typeIcon}
                  </div>
                </td>

                {/* Дата */}
                <td className={`${styles.td} ${styles.dateCell}`}>
                  {formatDate(transaction?.date)}
                </td>

                {/* Категория */}
                <td className={`${styles.td} ${styles.categoryCell}`}>
                  {transaction?.category || '—'}
                </td>

                {/* Сумма */}
                <td className={`${styles.td} ${styles.amountCell} ${amountClass}`}>
                  {amountPrefix}
                  {(transaction?.amount ?? 0).toLocaleString('ru-RU')} ₽
                </td>

                {/* Комментарий */}
                <td className={`${styles.td} ${styles.commentCell}`} title={transaction?.comment || ''}>
                  {transaction?.comment || '—'}
                </td>

                {/* Действия */}
                <td className={`${styles.td} ${styles.actionsCell}`}>
                  <div className={styles.actions}>
                    {onEdit && (
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => onEdit(transaction)}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => onDelete(transaction?.id)}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;