import { motion } from 'motion/react';
import { Transaction } from '../App';

interface StatsViewProps {
  transactions: Transaction[];
  totalIn: number;
  totalOut: number;
}

export function StatsView({ transactions, totalIn, totalOut }: StatsViewProps) {
  const net = totalIn - totalOut;
  const averageIn = transactions.filter(t => t.type === 'in').length 
    ? totalIn / transactions.filter(t => t.type === 'in').length 
    : 0;
  const averageOut = transactions.filter(t => t.type === 'out').length
    ? totalOut / transactions.filter(t => t.type === 'out').length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-6 space-y-4"
    >
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-gray-600 text-sm mb-4">Overview</h3>
        
        <div className="space-y-4">
          <div>
            <div className="text-gray-600 text-xs mb-1">Net Balance</div>
            <div className={`text-3xl ${net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{Math.abs(net).toLocaleString()}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-600 text-xs mb-1">Total Receivable</div>
              <div className="text-xl text-emerald-600">₹{totalIn.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs mb-1">Total Payable</div>
              <div className="text-xl text-rose-600">₹{totalOut.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-gray-600 text-sm mb-4">Averages</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Avg. Receivable</span>
            <span className="text-emerald-600">₹{Math.round(averageIn).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Avg. Payable</span>
            <span className="text-rose-600">₹{Math.round(averageOut).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Total Transactions</span>
            <span className="text-gray-900">{transactions.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-gray-600 text-sm mb-4">Activity</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Money In</span>
            <span className="text-emerald-600">{transactions.filter(t => t.type === 'in').length} entries</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Money Out</span>
            <span className="text-rose-600">{transactions.filter(t => t.type === 'out').length} entries</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}