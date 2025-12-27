import { motion } from 'motion/react';
import { Transaction } from '../App';
import { Search, Edit2, Trash2, TrendingUp, TrendingDown, User, Building2 } from 'lucide-react';
import { useState } from 'react';
import { getTranslation, Language } from '../translations';

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allTransactions: Transaction[];
  language: Language;
  theme: 'light' | 'dark';
}

export function TransactionsList({ 
  transactions, 
  onEdit, 
  onDelete, 
  searchQuery, 
  onSearchChange, 
  allTransactions,
  language,
  theme 
}: TransactionsListProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  const [showSearchSummary, setShowSearchSummary] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return t.today;
    if (diff === 1) return t.yesterday;
    if (diff < 7) return `${diff}${language === 'en' ? 'd ago' : language === 'gu' ? ' દિવસ પહેલાં' : ' दिन पहले'}`;
    
    const month = t.months[['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][date.getMonth()] as keyof typeof t.months];
    return `${date.getDate()} ${month}`;
  };

  // Filter transactions by search query
  const filteredTransactions = searchQuery.trim()
    ? allTransactions.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : transactions;

  // Calculate summary for searched person
  const searchSummary = searchQuery.trim() ? (() => {
    const personTransactions = allTransactions.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalIn = personTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = personTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    const net = totalIn - totalOut;
    return { totalIn, totalOut, net, count: personTransactions.length };
  })() : null;

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full h-12 border rounded-xl pl-12 pr-4 focus:outline-none transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:border-gray-600' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
            }`}
          />
        </div>

        {/* Search Summary */}
        {searchSummary && searchSummary.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-4 border rounded-xl ${
              isDark 
                ? 'bg-blue-900/20 border-blue-800' 
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className={isDark ? 'text-white mb-1' : 'text-gray-900 mb-1'}>
                  {language === 'gu' ? 'શોધ સારાંશ' : language === 'hi' ? 'खोज सारांश' : 'Search Summary'}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchSummary.count} {t.transactions}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-xl ${searchSummary.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  ₹{Math.abs(searchSummary.net).toLocaleString()}
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {searchSummary.net >= 0 
                    ? language === 'gu' ? 'તમે મેળવશો' : language === 'hi' ? 'आप प्राप्त करेंगे' : 'You will receive'
                    : language === 'gu' ? 'તમે ચૂકવશો' : language === 'hi' ? 'आप भुगतान करेंगे' : 'You will pay'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <div className={`flex-1 rounded-lg p-2 border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {t.toReceive}
                </div>
                <div className="text-sm text-emerald-600">₹{searchSummary.totalIn.toLocaleString()}</div>
              </div>
              <div className={`flex-1 rounded-lg p-2 border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {t.toPay}
                </div>
                <div className="text-sm text-rose-600">₹{searchSummary.totalOut.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        )}

        {searchQuery.trim() && searchSummary && searchSummary.count === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-4 border rounded-xl text-center ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
            {t.noResults} "{searchQuery}"
          </motion.div>
        )}
      </div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
      >
        {searchQuery.trim() 
          ? language === 'gu' ? 'શોધ પરિણામો' : language === 'hi' ? 'खोज परिणામ' : 'Search Results'
          : t.recentTransactions}
      </motion.h2>

      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-2xl border group ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700' 
                : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
            } transition-all duration-200`}
          >
            {/* Colored accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              transaction.type === 'in' 
                ? 'bg-gradient-to-b from-emerald-500 to-emerald-600' 
                : 'bg-gradient-to-b from-rose-500 to-rose-600'
            }`} />

            <div className="p-4 pl-5">
              <div className="flex items-start gap-4">
                {/* Avatar with gradient background */}
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden ${ 
                    transaction.type === 'in' 
                      ? isDark 
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-900/50' 
                        : 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-md shadow-emerald-500/20'
                      : isDark 
                        ? 'bg-gradient-to-br from-rose-600 to-rose-700 shadow-lg shadow-rose-900/50' 
                        : 'bg-gradient-to-br from-rose-400 to-rose-500 shadow-md shadow-rose-500/20'
                  }`}
                >
                  <span className="text-white font-semibold z-10 relative">
                    {getInitials(transaction.name)}
                  </span>
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-white" />
                    <div className="absolute -left-2 -bottom-2 w-6 h-6 rounded-full bg-white" />
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  {/* Header with name and amount */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className={`truncate mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {transaction.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                          transaction.personType === 'worker'
                            ? isDark 
                              ? 'bg-blue-900/30 text-blue-400' 
                              : 'bg-blue-50 text-blue-600'
                            : isDark 
                              ? 'bg-purple-900/30 text-purple-400' 
                              : 'bg-purple-50 text-purple-600'
                        }`}>
                          {transaction.personType === 'worker' ? (
                            <>
                              <User className="w-3 h-3" />
                              <span>{t.worker}</span>
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3 h-3" />
                              <span>{t.supplier}</span>
                            </>
                          )}
                        </div>
                        {transaction.site && transaction.site !== 'Extra' && (
                          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            • {transaction.site}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Amount with icon */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.05, type: 'spring', stiffness: 200 }}
                      className="text-right"
                    >
                      <div className="flex items-center gap-1 justify-end mb-1">
                        {transaction.type === 'in' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-500" />
                        )}
                      </div>
                      <span className={`text-lg font-semibold tracking-tight whitespace-nowrap ${
                        transaction.type === 'in' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {transaction.type === 'in' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </span>
                    </motion.div>
                  </div>

                  {/* Note and date */}
                  <div className={`mb-3 p-2.5 rounded-lg text-xs ${
                    isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`flex-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {transaction.note}
                      </p>
                      <span className={`whitespace-nowrap ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons with modern styling */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit(transaction)}
                      className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        isDark
                          ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{t.edit}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(transaction.id)}
                      className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        isDark
                          ? 'bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-600/30'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{t.delete}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}