import { motion } from 'motion/react';
import { Home, History, Settings, Building2, Package } from 'lucide-react';
import { getTranslation, Language } from '../translations';

interface TabBarProps {
  activeView: 'home' | 'history' | 'settings' | 'suppliers' | 'sites';
  onViewChange: (view: 'home' | 'history' | 'settings' | 'suppliers' | 'sites') => void;
  language: Language;
  theme: 'light' | 'dark';
}

export function TabBar({ activeView, onViewChange, language, theme }: TabBarProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  
  const tabs = [
    { id: 'home' as const, icon: Home, label: t.home },
    { id: 'sites' as const, icon: Building2, label: t.sites },
    { id: 'suppliers' as const, icon: Package, label: t.suppliers },
    { id: 'history' as const, icon: History, label: t.history },
    { id: 'settings' as const, icon: Settings, label: t.settings },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
      className={`fixed bottom-0 left-0 right-0 border-t ${
        isDark 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onViewChange(tab.id)}
              className="flex flex-col items-center gap-1 relative min-w-0 flex-1"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isActive 
                  ? isDark 
                    ? 'bg-white text-gray-900' 
                    : 'bg-gray-900 text-white' 
                  : isDark 
                    ? 'text-gray-500' 
                    : 'text-gray-500'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] transition-colors truncate max-w-full ${
                isActive 
                  ? isDark 
                    ? 'text-white' 
                    : 'text-gray-900' 
                  : isDark 
                    ? 'text-gray-600' 
                    : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}