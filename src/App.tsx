import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/auth/AuthForm';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Dashboard } from './components/Dashboard';
import { UserProfile } from './components/UserProfile';
import { Transaction } from './types';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { useTransactions } from './hooks/useTransactions';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { transactions, loading, refreshTransactions } = useTransactions();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Personal Budget Manager</h1>
        
        <UserProfile email={user.email || 'No email provided'} />
        
        <div className="space-y-8">
          <Dashboard transactions={transactions} />
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Transaction</h2>
            <TransactionForm onSuccess={refreshTransactions} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Transactions
              {loading && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
            </h2>
            <TransactionList
              transactions={transactions}
              onDelete={refreshTransactions}
              onEdit={setSelectedTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
