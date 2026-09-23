// Карточка баланса с суммой, подписью и цветовой индикацией
import React from 'react';
import styles from './BalanceCard.module.css';

function BalanceCard({
  title = 'Баланс',
  amount = 0,
  variant = 'primary', // 'primary' | 'success' | 'danger' | 'warning'
  icon = '',
}) {
  // Форматирование суммы с разделителями тысяч и символом валюты
  const formattedAmount = (amount ?? 0).toLocaleString('ru-RU') + ' ₽';

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