import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Transaction } from '../App';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getTranslation, Language } from '../translations';

interface AddTransactionModalProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  editingTransaction?: Transaction | null;
  language: Language;
  theme: 'light' | 'dark';
}

export function AddTransactionModal({ 
  onClose, 
  onSubmit, 
  editingTransaction,
  language,
  theme 
}: AddTransactionModalProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: editingTransaction?.name || '',
    amount: editingTransaction?.amount?.toString() || '',
    type: editingTransaction?.type || ('in' as 'in' | 'out'),
    personType: editingTransaction?.personType || ('worker' as 'worker' | 'supplier'),
    note: editingTransaction?.note || '',
    additionalNotes: editingTransaction?.additionalNotes || '',
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract site from name using "/" delimiter
    let site = 'Extra';
    let finalName = formData.name;
    
    if (formData.name.includes('/')) {
      const parts = formData.name.split('/');
      finalName = formData.name; // Keep full name with site
      site = parts[1]?.trim() || 'Extra';
    }
    
    onSubmit({
      ...formData,
      name: finalName,
      amount: parseFloat(formData.amount),
      site: site,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md mx-auto rounded-t-3xl border-t ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}
      >
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {editingTransaction ? t.editTransaction : t.addTransaction}
          </h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, type: 'in' })}
              className={`flex-1 h-12 rounded-xl transition-colors ${
                formData.type === 'in'
                  ? 'bg-emerald-500 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.moneyIn}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, type: 'out' })}
              className={`flex-1 h-12 rounded-xl transition-colors ${
                formData.type === 'out'
                  ? 'bg-rose-500 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.moneyOut}
            </motion.button>
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.personType} <span className="text-rose-500">*</span>
            </label>
            <Select value={formData.personType} onValueChange={(value: 'worker' | 'supplier') => setFormData({ ...formData, personType: value })}>
              <SelectTrigger className={`w-full h-12 border rounded-xl ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}>
                <SelectValue placeholder={t.personType} />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                <SelectItem value="worker" className={isDark ? 'text-white hover:bg-gray-700' : ''}>
                  {t.worker}
                </SelectItem>
                <SelectItem value="supplier" className={isDark ? 'text-white hover:bg-gray-700' : ''}>
                  {t.supplier}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.personName} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.personNamePlaceholder}
              className={`w-full h-12 border rounded-xl px-4 focus:outline-none transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:border-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
              }`}
              required
            />
            <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
              {language === 'gu' 
                ? '"/\" નો ઉપયોગ સાઇટ સોંપવા માટે કરો (જેમ કે, નામ/સાઇટ નામ)' 
                : language === 'hi' 
                  ? 'साइट असाइन करने के लिए "/" का उपयोग करें (जैसे, नाम/साइट का नाम)' 
                  : 'Use "/" to assign to a site (e.g., Name/Site Name). Without "/", entry goes to "Extra"'}
            </p>
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.amount} (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-gray-600' : 'text-gray-500'
              }`}>₹</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                className={`w-full h-12 border rounded-xl pl-8 pr-4 focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:border-gray-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.note} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder={t.notePlaceholder}
              className={`w-full h-12 border rounded-xl px-4 focus:outline-none transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:border-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
              }`}
              required
            />
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.additionalNotes}
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder={t.additionalNotesPlaceholder}
              className={`w-full min-h-[80px] border rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:border-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
              }`}
            />
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'gu' ? 'તારીખ' : language === 'hi' ? 'तारीख' : 'Date'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full h-12 border rounded-xl px-4 focus:outline-none transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
              }`}
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`w-full h-12 rounded-xl transition-colors ${
              isDark 
                ? 'bg-white text-gray-900 hover:bg-gray-100' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {editingTransaction ? t.save : t.addTransaction}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
