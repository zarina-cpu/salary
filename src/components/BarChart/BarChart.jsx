// Столбчатый график доходов и расходов по месяцам
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import EmptyState from '../EmptyState/EmptyState';
import { getCurrencySymbol } from '../../utils/formatters';

// Кастомный tooltip
const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    const symbol = getCurrencySymbol(currency);
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          {label}
        </div>
        {payload.map((entry, index) => (
          <div
            key={index}
            style={{
              color: entry.color,
              fontSize: '0.875rem',
              marginBottom: '0.25rem',
            }}
          >
            {entry.name}: {entry.value.toLocaleString('ru-RU')} {symbol}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function BarChart({
  data = [],
  title = 'Доходы и расходы по месяцам',
  emptyMessage = 'Нет данных для отображения',
  emptyDescription = 'Добавьте операции, чтобы увидеть график',
  currency = 'UZS',
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <EmptyState
          title={emptyMessage}
          description={emptyDescription}
          icon="📈"
        />
      </div>
    );
  }

  const symbol = getCurrencySymbol(currency);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '0.875rem' }}
            tickFormatter={(value) => `${value.toLocaleString('ru-RU')} ${symbol}`}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingBottom: '20px' }}
          />
          <Bar
            dataKey="income"
            name="Доходы"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Расходы"
            fill="#ef4444"
            radius={[8, 8, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;