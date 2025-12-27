import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../App';
import { getTranslation, Language } from '../translations';

interface SuppliersViewProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  language: Language;
  theme: 'light' | 'dark';
}

export function SuppliersView({ transactions, onEdit, onDelete, language, theme }: SuppliersViewProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only supplier transactions
  const supplierTransactions = transactions.filter(t => t.personType === 'supplier');

  // Group transactions by supplier name (extract name before "/" if present)
  const supplierGroups = supplierTransactions.reduce((groups, transaction) => {
    const supplierName = transaction.name.split('/')[0].trim();
    if (!groups[supplierName]) {
      groups[supplierName] = [];
    }
    groups[supplierName].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  // Calculate summary for each supplier
  const supplierSummaries = Object.entries(supplierGroups).map(([name, txns]) => {
    const totalIn = txns.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = txns.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIn - totalOut;
    const lastTransaction = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return {
      name,
      totalIn,
      totalOut,
      balance,
      transactionCount: txns.length,
      lastDate: lastTransaction.date,
      transactions: txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  });

  // Filter suppliers based on search
  const filteredSuppliers = supplierSummaries.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.suppliersTitle}
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {t.suppliersDescription}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full h-12 rounded-xl pl-12 pr-4 border transition-colors focus:outline-none focus:ring-2 ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-400 focus:border-gray-400'
          }`}
        />
      </div>

      {/* Supplier Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t.totalSuppliers}
          </p>
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {supplierSummaries.length}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'
        }`}>
          <p className={`text-xs mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            Total Received
          </p>
          <p className={`text-xl ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            ₹{supplierSummaries.reduce((sum, s) => sum + s.totalIn, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-rose-900/30' : 'bg-rose-50'
        }`}>
          <p className={`text-xs mb-1 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
            Total Paid
          </p>
          <p className={`text-xl ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
            ₹{supplierSummaries.reduce((sum, s) => sum + s.totalOut, 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-3">
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {searchQuery ? 'No suppliers found' : 'No supplier transactions yet'}
            </p>
          </div>
        ) : (
          filteredSuppliers.map((supplier, index) => (
            <SupplierCard key={supplier.name} supplier={supplier} index={index} onEdit={onEdit} onDelete={onDelete} theme={theme} />
          ))
        )}
      </div>
    </div>
  );
}

interface SupplierCardProps {
  supplier: {
    name: string;
    totalIn: number;
    totalOut: number;
    balance: number;
    transactionCount: number;
    lastDate: string;
    transactions: Transaction[];
  };
  index: number;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  theme: 'light' | 'dark';
}

function SupplierCard({ supplier, index, onEdit, onDelete, theme }: SupplierCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl overflow-hidden border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {supplier.name}
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {supplier.transactionCount} {supplier.transactionCount === 1 ? 'transaction' : 'transactions'} · Last: {new Date(supplier.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
              supplier.balance > 0 
                ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700')
                : supplier.balance < 0 
                ? (isDark ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-50 text-rose-700')
                : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700')
            }`}>
              {supplier.balance > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : supplier.balance < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              <span className="text-sm">₹{Math.abs(supplier.balance).toLocaleString('en-IN')}</span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {supplier.balance > 0 ? 'To receive' : supplier.balance < 0 ? 'To pay' : 'Settled'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className={`flex-1 rounded-lg px-3 py-2 ${
            isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'
          }`}>
            <p className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Received
            </p>
            <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              ₹{supplier.totalIn.toLocaleString('en-IN')}
            </p>
          </div>
          <div className={`flex-1 rounded-lg px-3 py-2 ${
            isDark ? 'bg-rose-900/30' : 'bg-rose-50'
          }`}>
            <p className={`text-xs ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
              Paid
            </p>
            <p className={`text-sm ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
              ₹{supplier.totalOut.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </motion.button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className={`p-4 space-y-3 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <h4 className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Transaction History
            </h4>
            {supplier.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`rounded-xl p-3 border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.note}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      {transaction.site && transaction.site !== 'Extra' && (
                        <span className={isDark ? 'ml-2 text-gray-500' : 'ml-2 text-gray-400'}>
                          · {transaction.site}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm ${
                        transaction.type === 'in' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {transaction.type === 'in' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                {transaction.additionalNotes && (
                  <p className={`text-xs mt-2 pt-2 border-t ${
                    isDark 
                      ? 'text-gray-400 border-gray-700' 
                      : 'text-gray-500 border-gray-100'
                  }`}>
                    {transaction.additionalNotes}
                  </p>
                )}
                <div className={`flex justify-end gap-3 mt-2 pt-2 border-t ${
                  isDark ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(transaction);
                    }}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      isDark
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(transaction.id);
                    }}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      isDark
                        ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-900/30'
                        : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}