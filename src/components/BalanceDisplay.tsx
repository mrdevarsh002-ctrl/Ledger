import { motion } from 'motion/react';
import { getTranslation, Language } from '../translations';

interface BalanceDisplayProps {
  totalIn: number;
  totalOut: number;
  language: Language;
  theme: 'light' | 'dark';
}

export function BalanceDisplay({ totalIn, totalOut, language, theme }: BalanceDisplayProps) {
  const t = getTranslation(language);
  const net = totalIn - totalOut;
  const isPositive = net >= 0;
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <div className={`rounded-3xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
      }`}>
        <div className="flex items-baseline gap-2 mb-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={isDark ? 'text-gray-400' : 'text-gray-500'}
          >
            ₹
          </motion.span>
          <motion.span
            key={net}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-6xl tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {Math.abs(net).toLocaleString()}
          </motion.span>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1"
          >
            <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {t.toReceive}
            </div>
            <div className="text-xl text-emerald-600">₹{totalIn.toLocaleString()}</div>
          </motion.div>

          <div className={`w-px h-12 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex-1"
          >
            <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {t.toPay}
            </div>
            <div className="text-xl text-rose-600">₹{totalOut.toLocaleString()}</div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 px-2 flex items-center gap-2 text-sm"
      >
        <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {t.net} {isPositive ? t.netReceivable : t.netPayable}
        </span>
      </motion.div>
    </motion.div>
  );
}