import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Transaction, TransactionCategory } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const categories: TransactionCategory[] = [
  'rent',
  'groceries',
  'utilities',
  'entertainment',
  'transportation',
  'healthcare',
  'shopping',
  'income',
  'other',
];

export function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        toast.error('Please sign in to add transactions');
        return;
      }

      const { error: insertError } = await supabase
        .from('transactions')
        .insert([
          {
            type: formData.type,
            amount: Number(formData.amount),
            category: formData.category,
            description: formData.description,
            date: formData.date,
            user_id: session.user.id
          }
        ]);

      if (insertError) {
        console.error('Transaction error:', insertError);
        throw new Error(insertError.message);
      }

      toast.success('Transaction added successfully');
      onSuccess();
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        category: 'other',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error adding transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0.01"
            step="0.01"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <PlusCircle size={20} />
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}