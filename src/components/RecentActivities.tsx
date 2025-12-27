import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, Clock, Filter } from 'lucide-react';
import { Transaction } from '../App';
import { useState } from 'react';

interface RecentActivitiesProps {
  transactions: Transaction[];
}

export function RecentActivities({ transactions }: RecentActivitiesProps) {
  const [filter, setFilter] = useState<'all' | 'given' | 'received'>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.type === filter
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Recent Activity</h3>
        </div>

        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-slate-200">
          {(['all', 'received', 'given'] as const).map((type) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                filter === type
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredTransactions.slice(0, 6).map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 hover:shadow-xl hover:border-violet-200 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Hover gradient effect */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className={`absolute inset-0 bg-gradient-to-r ${
                transaction.type === 'received'
                  ? 'from-emerald-50/50 to-transparent'
                  : 'from-rose-50/50 to-transparent'
              }`}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 bg-gradient-to-br ${
                    transaction.type === 'received'
                      ? 'from-emerald-400 to-green-500'
                      : 'from-rose-400 to-red-500'
                  } rounded-2xl flex items-center justify-center shadow-lg relative`}
                >
                  <span className="text-white text-sm">{getInitials(transaction.name)}</span>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                      transaction.type === 'received'
                        ? 'from-emerald-400 to-green-500'
                        : 'from-rose-400 to-red-500'
                    }`}
                  />
                </motion.div>
                <div>
                  <p className="text-slate-900">{transaction.name}</p>
                  <p className="text-xs text-slate-500">{transaction.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05, type: "spring" }}
                  className="flex items-center gap-1 justify-end mb-1"
                >
                  <motion.div
                    whileHover={{ rotate: transaction.type === 'received' ? -45 : 45 }}
                  >
                    {transaction.type === 'received' ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-rose-600" />
                    )}
                  </motion.div>
                  <p
                    className={`${
                      transaction.type === 'received' ? 'text-emerald-600' : 'text-rose-600'
                    } text-lg`}
                  >
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                </motion.div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <div className="w-1 h-1 rounded-full bg-slate-400" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTransactions.length > 6 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-2 border-dashed border-violet-300 rounded-2xl text-violet-700 hover:from-violet-100 hover:to-fuchsia-100 transition-all"
        >
          View All Transactions →
        </motion.button>
      )}
    </motion.div>
  );
}
