import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { getTranslation, Language } from '../translations';

interface QuickActionsProps {
  onAddClick: () => void;
  language: Language;
  theme: 'light' | 'dark';
}

export function QuickActions({ onAddClick, language, theme }: QuickActionsProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 transition-colors ${
          isDark 
            ? 'bg-white text-gray-900 hover:bg-gray-100' 
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        <Plus className="w-5 h-5" />
        <span className="tracking-tight">{t.addEntry}</span>
      </motion.button>
    </motion.div>
  );
}