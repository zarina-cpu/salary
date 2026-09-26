// Круговая диаграмма расходов по категориям
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import EmptyState from '../EmptyState/EmptyState';
import { getCurrencySymbol } from '../../utils/formatters';

// Цветовая палитра для секторов
const COLORS = [
  '#4f46e5',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#14b8a6',
];

// Кастомный tooltip (принимает currency через payload)
const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
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
        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
          {data.name}
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          {data.value.toLocaleString('ru-RU')} {symbol}
        </div>
      </div>
    );
  }
  return null;
};

function PieChart({
  data = [],
  title = 'Расходы по категориям',
  emptyMessage = 'Нет данных для отображения',
  emptyDescription = 'Добавьте расходы, чтобы увидеть диаграмму',
  currency = 'UZS',
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <EmptyState
          title={emptyMessage}
          description={emptyDescription}
          icon="📊"
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;