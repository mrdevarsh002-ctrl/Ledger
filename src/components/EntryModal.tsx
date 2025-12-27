import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, ArrowDownLeft, Calendar, User, DollarSign, FileText, Sparkles } from 'lucide-react';
import { Transaction } from '../App';

interface EntryModalProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export function EntryModal({ onClose, onSubmit }: EntryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'given' as 'given' | 'received',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-white via-violet-50/30 to-fuchsia-50/30 backdrop-blur-xl rounded-t-3xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto mb-0 border-t-4 border-violet-500"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 px-6 py-5 flex items-center justify-between rounded-t-3xl relative overflow-hidden">
          {/* Animated background */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-white text-xl">Add New Entry</h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors border border-white/30"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Selection */}
          <div>
            <label className="block text-sm text-slate-700 mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'given', label: 'Money Given', icon: ArrowUpRight, gradient: 'from-rose-500 to-red-600', bg: 'from-rose-50 to-red-50' },
                { type: 'received', label: 'Money Received', icon: ArrowDownLeft, gradient: 'from-emerald-500 to-green-600', bg: 'from-emerald-50 to-green-50' },
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = formData.type === option.type;
                return (
                  <motion.button
                    key={option.type}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, type: option.type as 'given' | 'received' })}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? `bg-gradient-to-br ${option.bg} border-${option.type === 'given' ? 'rose' : 'emerald'}-500 shadow-lg`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="selectedType"
                        className={`absolute inset-0 bg-gradient-to-br ${option.bg} opacity-50`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="relative flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ rotate: isSelected ? [0, -10, 10, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className={`text-sm ${isSelected ? `text-${option.type === 'given' ? 'rose' : 'emerald'}-700` : 'text-slate-700'}`}>
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <motion.div layout className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-slate-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600" />
                Person/Supplier Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ramesh Kumar"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm text-slate-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-violet-600" />
                Amount (₹)
              </label>
              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  required
                />
              </motion.div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" />
                Description
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., for materials"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-600" />
                Date
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg shadow-violet-500/30 relative overflow-hidden group"
            >
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              <span className="relative z-10">Add Entry</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
