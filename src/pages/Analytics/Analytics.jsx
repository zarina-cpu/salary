// Страница аналитики с реальными данными для графиков
import React, { useState, useEffect } from 'react';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { getByCategory, getMonthlySummary } from '../../services/summaryService';
import styles from './Analytics.module.css';

function Analytics() {
  // Состояние данных для графиков
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    // Данные по категориям для круговой диаграммы (расходы)
    const categoryStats = getByCategory('expense');
    setCategoryData(categoryStats);

    // Помесячная сводка за последние 6 месяцев
    const monthlyStats = getMonthlySummary(6);
    setMonthlyData(monthlyStats);
  }, []);

  return (
    <div className={styles.analytics}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>Аналитика</h1>

      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        {/* Круговая диаграмма расходов по категориям */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          <div className={styles.chartArea}>
            <PieChart
              data={categoryData}
              emptyMessage="Нет данных о расходах"
              emptyDescription="Добавьте расходы, чтобы увидеть распределение по категориям"
            />
          </div>
        </div>

        {/* Столбчатый график доходов и расходов по месяцам */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <div className={styles.chartArea}>
            <BarChart
              data={monthlyData}
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