import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Transaction, Balance } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const balance = React.useMemo(() => {
    const total_income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const total_expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      total_income,
      total_expenses,
      net_balance: total_income - total_expenses,
    };
  }, [transactions]);

  const expensesByCategory = React.useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);

  const pieChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const barChartData = {
    labels: ['Income', 'Expenses', 'Net Balance'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [balance.total_income, balance.total_expenses, balance.net_balance],
        backgroundColor: ['#4CAF50', '#F44336', '#2196F3'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ${balance.total_income.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            ${balance.total_expenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Net Balance</h3>
          <p className={`mt-2 text-3xl font-bold ${balance.net_balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ${balance.net_balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
          <div className="h-64">
            <Bar
              data={barChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}