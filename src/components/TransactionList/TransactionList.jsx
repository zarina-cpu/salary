// Таблица транзакций с действиями редактирования и удаления
import React from 'react';
import EmptyState from '../EmptyState/EmptyState';
import { formatDateShort, formatCurrency } from '../../utils/formatters';
import { getCategoryLabel } from '../../services/categoryService';
import styles from './TransactionList.module.css';

function TransactionList({
  transactions = [],
  onEdit,
  onDelete,
  emptyMessage = 'Нет операций',
  emptyDescription = 'Добавьте первую операцию',
  currency = 'UZS',
}) {
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

        <tbody className={styles.tbody}>
          {(transactions || []).map((transaction) => {
            const isIncome = transaction?.type === 'income';
            const typeIcon = isIncome ? '📈' : '📉';
            const typeIconClass = isIncome ? styles.typeIconIncome : styles.typeIconExpense;
            const amountClass = isIncome ? styles.amountIncome : styles.amountExpense;

            return (
              <tr key={transaction?.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.typeCell}`}>
                  <div className={`${styles.typeIcon} ${typeIconClass}`}>
                    {typeIcon}
                  </div>
                </td>

                <td className={`${styles.td} ${styles.dateCell}`}>
                  {formatDateShort(transaction?.date)}
                </td>

                <td className={`${styles.td} ${styles.categoryCell}`}>
                  {getCategoryLabel(transaction?.category, transaction?.type)}
                </td>

                <td className={`${styles.td} ${styles.amountCell} ${amountClass}`}>
                  {formatCurrency(transaction?.amount, currency, true)}
                </td>

                <td className={`${styles.td} ${styles.commentCell}`} title={transaction?.comment || ''}>
                  {transaction?.comment || '—'}
                </td>

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