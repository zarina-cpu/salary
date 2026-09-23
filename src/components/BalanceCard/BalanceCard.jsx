// Карточка баланса с суммой, подписью и цветовой индикацией
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import styles from './BalanceCard.module.css';

function BalanceCard({
  title = 'Баланс',
  amount = 0,
  variant = 'primary',
  icon = '',
  currency = 'UZS',
}) {
  // Форматирование суммы с учётом валюты
  const formattedAmount = formatCurrency(amount, currency);

  // Определяем класс варианта
  const variantClass = styles[variant] || styles.primary;

  return (
    <div className={`${styles.card} ${variantClass}`}>
      {/* Декоративная иконка */}
      {icon && <div className={styles.icon}>{icon}</div>}

      {/* Заголовок карточки */}
      <div className={styles.title}>{title}</div>

      {/* Сумма */}
      <div className={styles.amount}>{formattedAmount}</div>
    </div>
  );
}

export default BalanceCard;