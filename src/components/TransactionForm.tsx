import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../App';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (transaction: any) => void;
  onClose: () => void;
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Other Expense'],
};

export function TransactionForm({ transaction, onSubmit, onClose }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    category: transaction?.category || '',
    amount: transaction?.amount.toString() || '',
    type: transaction?.type || 'expense' as 'income' | 'expense',
  });

  useEffect(() => {
    if (!transaction) {
      setFormData((prev) => ({
        ...prev,
        category: '',
      }));
    }
  }, [formData.type, transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = transaction
      ? {
          ...transaction,
          ...formData,
          amount: parseFloat(formData.amount),
        }
      : {
          ...formData,
          amount: parseFloat(formData.amount),
        };

    onSubmit(submissionData);
  };

  const availableCategories = categories[formData.type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-slate-900">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-150"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`p-3 rounded-lg border-2 transition-all duration-150 ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`p-3 rounded-lg border-2 transition-all duration-150 ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm text-slate-700 mb-2">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm text-slate-700 mb-2">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm text-slate-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              required
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm text-slate-700 mb-2">
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
