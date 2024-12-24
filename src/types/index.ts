export type TransactionCategory =
  | 'rent'
  | 'groceries'
  | 'utilities'
  | 'entertainment'
  | 'transportation'
  | 'healthcare'
  | 'shopping'
  | 'income'
  | 'other';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  user_id: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  amount: number;
  period: 'weekly' | 'monthly';
  user_id: string;
}

export interface Balance {
  total_income: number;
  total_expenses: number;
  net_balance: number;
}