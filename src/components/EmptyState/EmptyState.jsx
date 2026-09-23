// Заглушка для пустых списков с иконкой, текстом и кнопкой действия
import React from 'react';
import styles from './EmptyState.module.css';

function EmptyState({
  title = 'Нет данных',
  description = '',
  actionLabel = '',
  onAction,
  icon = '📭',
}) {
  return (
    <div className={styles.emptyState}>
      {/* Иконка */}
      {icon && <div className={styles.icon}>{icon}</div>}

      {/* Заголовок */}
      <h3 className={styles.title}>{title}</h3>

      {/* Описание */}
      {description && <p className={styles.description}>{description}</p>}

      {/* Кнопка действия (опционально) */}
      {actionLabel && onAction && (
        <button className={styles.actionButton} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;