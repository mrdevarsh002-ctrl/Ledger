import { motion } from 'motion/react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Transaction } from '../App';

interface ReportsScreenProps {
  transactions: Transaction[];
}

export function ReportsScreen({ transactions }: ReportsScreenProps) {
  const totalReceived = transactions.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0);
  const totalGiven = transactions.filter(t => t.type === 'given').reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      key="reports"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="px-5 pb-6 space-y-6"
    >
      <div className="bg-gradient-to-br from-white to-violet-50 rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-violet-600" />
          <h3 className="text-slate-900">This Month</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total Received</span>
            <span className="text-xl text-emerald-600">₹{totalReceived.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total Given</span>
            <span className="text-xl text-rose-600">₹{totalGiven.toLocaleString()}</span>
          </div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-slate-900">Net Balance</span>
            <span className={`text-2xl ${totalReceived - totalGiven >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{Math.abs(totalReceived - totalGiven).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg text-center">
        <TrendingUp className="w-12 h-12 text-violet-600 mx-auto mb-3" />
        <h3 className="text-slate-900 mb-2">Analytics Coming Soon</h3>
        <p className="text-sm text-slate-600">View detailed charts and insights about your transactions</p>
      </div>
    </motion.div>
  );
}
