import { useState } from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';
import { Transaction } from '../App';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-slate-900">Recent Transactions</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                className="w-full sm:w-auto pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>No transactions found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'income' ? (
                        <div className="p-1 bg-green-50 rounded">
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-1 bg-red-50 rounded">
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        </div>
                      )}
                      <span
                        className={`${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}$
                        {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                        aria-label="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
