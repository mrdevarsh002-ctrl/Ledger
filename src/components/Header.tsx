import { motion } from 'motion/react';
import { getTranslation, Language } from '../translations';

interface HeaderProps {
  language: Language;
  theme: 'light' | 'dark';
  userName: string;
}

export function Header({ language, theme, userName }: HeaderProps) {
  const t = getTranslation(language);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.greeting.morning : hour < 17 ? t.greeting.afternoon : t.greeting.evening;
  const isDark = theme === 'dark';

  return (
    <header className="pt-12 pb-6 px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {greeting}, {userName}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {t.appName}
          </motion.h1>
        </div>
      </motion.div>
    </header>
  );
}