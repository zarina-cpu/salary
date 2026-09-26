// Страница аналитики с реальными данными для графиков
import React, { useState, useEffect } from 'react';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { getByCategory, getMonthlySummary } from '../../services/summaryService';
import { getItem } from '../../services/storage';
import { STORAGE_KEYS } from '../../utils/constants';
import styles from './Analytics.module.css';

function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  
  // Валюта по умолчанию
  const [defaultCurrency, setDefaultCurrency] = useState(() => {
    const settings = getItem(STORAGE_KEYS.SETTINGS, {});
    return settings.currency || 'UZS';
  });

  useEffect(() => {
    const categoryStats = getByCategory('expense');
    setCategoryData(categoryStats);

    const monthlyStats = getMonthlySummary(6);
    setMonthlyData(monthlyStats);
  }, []);

  return (
    <div className={styles.analytics}>
      <h1 className={styles.title}>Аналитика</h1>

      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          <div className={styles.chartArea}>
            <PieChart
              data={categoryData}
              currency={defaultCurrency}
              emptyMessage="Нет данных о расходах"
              emptyDescription="Добавьте расходы, чтобы увидеть распределение по категориям"
            />
          </div>
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <div className={styles.chartArea}>
            <BarChart
              data={monthlyData}
              currency={defaultCurrency}
              emptyMessage="Нет данных по месяцам"
              emptyDescription="Добавьте операции, чтобы увидеть динамику по месяцам"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;