import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2 } from 'lucide-react';
import { getTranslation, Language } from '../translations';

interface AddSiteModalProps {
  onClose: () => void;
  onSubmit: (site: { name: string; budget: number }) => void;
  language: Language;
  theme: 'light' | 'dark';
}

export function AddSiteModal({ onClose, onSubmit, language, theme }: AddSiteModalProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && budget && Number(budget) > 0) {
      onSubmit({
        name: name.trim(),
        budget: Number(budget),
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className={`relative w-full max-w-md m-4 rounded-3xl shadow-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Building2 className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h2 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Add New Site
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Create a new construction site
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Site Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter site name (e.g., Dwarka Site A)"
                className={`w-full h-12 rounded-xl px-4 border transition-colors focus:outline-none focus:ring-2 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Budget (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter budget amount"
                className={`w-full h-12 rounded-xl px-4 border transition-colors focus:outline-none focus:ring-2 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
                min="1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`flex-1 h-12 rounded-xl transition-colors ${
                  isDark
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.cancel}
              </motion.button>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Add Site
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
