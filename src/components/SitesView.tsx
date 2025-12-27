import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, TrendingUp, TrendingDown, Plus, DollarSign, Trash2 } from 'lucide-react';
import { Site, Transaction } from '../App';
import { getTranslation, Language } from '../translations';

interface SitesViewProps {
  sites: Site[];
  transactions: Transaction[];
  onDeleteSite: (id: string) => void;
  onAddSite: () => void;
  language: Language;
  theme: 'light' | 'dark';
}

export function SitesView({ sites, transactions, onDeleteSite, onAddSite, language, theme }: SitesViewProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  if (selectedSite) {
    return (
      <SiteDetailsView 
        site={selectedSite} 
        transactions={transactions}
        onBack={() => setSelectedSite(null)} 
        language={language}
        theme={theme}
      />
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.sitesTitle}
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t.sitesDescription}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddSite}
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
          } transition-colors`}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Sites Overview Stats */}
      <div className={`rounded-2xl p-6 text-white ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
          : 'bg-gradient-to-br from-gray-900 to-gray-800'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5" />
          <p className="text-sm opacity-80">{t.totalSites}</p>
        </div>
        <p className="text-3xl mb-2">{sites.length}</p>
        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <div className="flex-1">
            <p className="text-xs opacity-80 mb-1">Total Budget</p>
            <p className="text-lg">₹{sites.reduce((sum, s) => sum + s.budget, 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-80 mb-1">Active Sites</p>
            <p className="text-lg">{sites.length}</p>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <div className="space-y-3">
        {sites.map((site, index) => (
          <SiteCard 
            key={site.id} 
            site={site} 
            index={index}
            transactions={transactions}
            onClick={() => setSelectedSite(site)}
            onDelete={() => onDeleteSite(site.id)}
            theme={theme}
          />
        ))}
      </div>

      {/* Extra/Uncategorized Transactions */}
      <ExtraTransactionsCard transactions={transactions} theme={theme} />
    </div>
  );
}

interface SiteCardProps {
  site: Site;
  index: number;
  transactions: Transaction[];
  onClick: () => void;
  onDelete: () => void;
  theme: 'light' | 'dark';
}

function SiteCard({ site, index, transactions, onClick, onDelete, theme }: SiteCardProps) {
  const isDark = theme === 'dark';
  const siteTransactions = transactions.filter(t => t.site === site.name);
  const totalSpent = siteTransactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalReceived = siteTransactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalSpent - totalReceived;
  const budgetUsed = (netAmount / site.budget) * 100;
  const remaining = site.budget - netAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative w-full rounded-2xl overflow-hidden border transition-colors ${
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-8">
            <h3 className={`text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {site.name}
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Started: {new Date(site.createdDate).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Building2 className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
          </div>
        </div>

        {/* Budget Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Budget Used
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {budgetUsed.toFixed(1)}%
            </p>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`h-full rounded-full ${
                budgetUsed > 90 ? 'bg-rose-500' : 
                budgetUsed > 70 ? 'bg-amber-500' : 
                'bg-emerald-500'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-xl p-3 ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Budget
            </p>
            <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ₹{site.budget.toLocaleString('en-IN')}
            </p>
          </div>
          <div className={`rounded-xl p-3 ${
            remaining >= 0 
              ? (isDark ? 'bg-emerald-900/30' : 'bg-emerald-50')
              : (isDark ? 'bg-rose-900/30' : 'bg-rose-50')
          }`}>
            <p className={`text-xs mb-1 ${
              remaining >= 0 
                ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                : (isDark ? 'text-rose-400' : 'text-rose-600')
            }`}>
              {remaining >= 0 ? 'Remaining' : 'Over Budget'}
            </p>
            <p className={`text-sm ${
              remaining >= 0 
                ? (isDark ? 'text-emerald-300' : 'text-emerald-700')
                : (isDark ? 'text-rose-300' : 'text-rose-700')
            }`}>
              ₹{Math.abs(remaining).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-3 mt-3 pt-3 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className={`flex items-center gap-1 text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <TrendingDown className="w-3 h-3 text-rose-500" />
            <span>₹{totalSpent.toLocaleString('en-IN')} spent</span>
          </div>
          <div className={`flex items-center gap-1 text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>₹{totalReceived.toLocaleString('en-IN')} received</span>
          </div>
        </div>
      </motion.button>

      {/* Redesigned Delete Button */}
      <div className="absolute top-3 right-3 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`group relative w-9 h-9 rounded-lg transition-all duration-200 ${
            isDark
              ? 'bg-rose-500/20 hover:bg-rose-500 border border-rose-500/30 hover:border-rose-500'
              : 'bg-rose-50 hover:bg-rose-500 border border-rose-200 hover:border-rose-500'
          }`}
        >
          <Trash2 className={`w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors ${
            isDark
              ? 'text-rose-400 group-hover:text-white'
              : 'text-rose-600 group-hover:text-white'
          }`} />
        </motion.button>
      </div>
    </motion.div>
  );
}

interface SiteDetailsViewProps {
  site: Site;
  transactions: Transaction[];
  onBack: () => void;
  language: Language;
  theme: 'light' | 'dark';
}

function SiteDetailsView({ site, transactions, onBack, language, theme }: SiteDetailsViewProps) {
  const isDark = theme === 'dark';
  const t = getTranslation(language);
  const siteTransactions = transactions
    .filter(t => t.site === site.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSpent = siteTransactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalReceived = siteTransactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalSpent - totalReceived;
  const budgetUsed = (netAmount / site.budget) * 100;
  const remaining = site.budget - netAmount;

  return (
    <div className="space-y-6 pt-6">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className={`transition-colors flex items-center gap-2 ${
          isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-600'
        }`}
      >
        ← Back to Sites
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 text-white ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
            : 'bg-gradient-to-br from-gray-900 to-gray-800'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl">{site.name}</h2>
            <p className="text-sm opacity-80">
              Started: {new Date(site.createdDate).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div>
            <p className="text-xs opacity-80 mb-1">Budget</p>
            <p className="text-lg">₹{site.budget.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Used</p>
            <p className="text-lg">{budgetUsed.toFixed(1)}%</p>
          </div>
          <div>
            <p className={`text-xs mb-1 ${remaining >= 0 ? 'opacity-80' : 'text-rose-300'}`}>
              {remaining >= 0 ? 'Remaining' : 'Over'}
            </p>
            <p className={`text-lg ${remaining < 0 ? 'text-rose-300' : ''}`}>
              ₹{Math.abs(remaining).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${
                budgetUsed > 90 ? 'bg-rose-400' : 
                budgetUsed > 70 ? 'bg-amber-400' : 
                'bg-emerald-400'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-rose-900/30' : 'bg-rose-50'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className={`w-4 h-4 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
            <p className={`text-xs ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
              Total Spent
            </p>
          </div>
          <p className={`text-xl ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <p className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Total Received
            </p>
          </div>
          <p className={`text-xl ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            ₹{totalReceived.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <h3 className={`text-base mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Transactions ({siteTransactions.length})
        </h3>
        <div className="space-y-3">
          {siteTransactions.length === 0 ? (
            <div className={`text-center py-12 rounded-2xl ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                No transactions yet for this site
              </p>
            </div>
          ) : (
            siteTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-4 border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.name.split('/')[0]}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {transaction.note}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-lg ${
                        transaction.personType === 'worker' 
                          ? (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700')
                          : (isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-700')
                      }`}>
                        {transaction.personType}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(transaction.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-base ${
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
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface ExtraTransactionsCardProps {
  transactions: Transaction[];
  theme: 'light' | 'dark';
}

function ExtraTransactionsCard({ transactions, theme }: ExtraTransactionsCardProps) {
  const isDark = theme === 'dark';
  const extraTransactions = transactions.filter(t => t.site === 'Extra');
  const [isExpanded, setIsExpanded] = useState(false);

  if (extraTransactions.length === 0) return null;

  const totalAmount = extraTransactions.reduce((sum, t) => 
    sum + (t.type === 'out' ? t.amount : -t.amount), 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden"
    >
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-amber-700" />
              <h3 className="text-base text-amber-900">Extra / Uncategorized</h3>
            </div>
            <p className="text-xs text-amber-700">
              {extraTransactions.length} {extraTransactions.length === 1 ? 'transaction' : 'transactions'} without site assignment
            </p>
          </div>
          <div className="text-right">
            <p className="text-base text-amber-900">₹{totalAmount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-amber-700">Total</p>
          </div>
        </div>
      </motion.button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="border-t border-amber-200"
        >
          <div className="p-4 space-y-3">
            {extraTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-3 border border-amber-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{transaction.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{transaction.note}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p
                    className={`text-sm ${
                      transaction.type === 'in' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {transaction.type === 'in' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}