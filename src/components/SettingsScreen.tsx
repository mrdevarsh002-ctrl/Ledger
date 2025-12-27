import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Globe, Moon, Sun, LogOut, Info, ChevronRight, Edit2, Check, FileSpreadsheet } from 'lucide-react';
import { getTranslation, Language } from '../translations';

interface SettingsScreenProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
  onNavigateToAbout: () => void;
  onImportData: () => void;
}

export function SettingsScreen({
  userName,
  onUserNameChange,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onLogout,
  onNavigateToAbout,
  onImportData,
}: SettingsScreenProps) {
  const t = getTranslation(language);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const isDark = theme === 'dark';

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUserNameChange(tempName.trim());
      setIsEditingName(false);
    }
  };

  const languages = [
    { code: 'en' as const, name: t.english, nativeName: 'English' },
    { code: 'gu' as const, name: t.gujarati, nativeName: 'ગુજરાતી' },
    { code: 'hi' as const, name: t.hindi, nativeName: 'हिंदी' },
  ];

  const currentLanguage = languages.find(l => l.code === language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-6 space-y-6"
    >
      <div>
        <h2 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.settingsTitle}
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {t.settingsDescription}
        </p>
      </div>

      {/* Profile Section */}
      <div className={`rounded-2xl p-6 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-gray-900 to-gray-800'
      } text-white`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isDark ? 'bg-white/10' : 'bg-white/10'
          }`}>
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm opacity-80 mb-1">{t.profile}</p>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-base focus:outline-none focus:border-white/40"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') {
                      setTempName(userName);
                      setIsEditingName(false);
                    }
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSaveName}
                  className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg">{userName}</p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditingName(true)}
                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-3">
        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl overflow-hidden border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={`w-full p-4 flex items-center gap-4 transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                {t.language}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {currentLanguage?.nativeName}
              </p>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${
              showLanguageMenu ? 'rotate-90' : ''
            } ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </button>
          
          {showLanguageMenu && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className={`border-t ${
                isDark 
                  ? 'border-gray-700 bg-gray-900' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {languages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full px-6 py-3 flex items-center justify-between transition-colors ${
                    language === lang.code 
                      ? isDark 
                        ? 'bg-gray-800' 
                        : 'bg-gray-100' 
                      : ''
                  } ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <div className="text-left">
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {lang.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {lang.nativeName}
                    </p>
                  </div>
                  {language === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Theme - Redesigned Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-4 border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-indigo-900' : 'bg-amber-400'
            }`}>
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-white" />
              ) : (
                <Sun className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                {t.theme}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {theme === 'dark' ? t.darkMode : t.lightMode}
              </p>
            </div>
            {/* Modern Toggle Switch */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              className={`relative w-16 h-9 rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'bg-indigo-600' 
                  : 'bg-amber-400'
              }`}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center ${
                  theme === 'dark' ? 'left-8' : 'left-1'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Import Data */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={onImportData}
          className={`w-full rounded-2xl p-4 transition-colors border flex items-center gap-4 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className={isDark ? 'text-white' : 'text-gray-900'}>
              {t.importData}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {t.importDataDescription}
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </motion.button>

        {/* About */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigateToAbout}
          className={`w-full rounded-2xl p-4 transition-colors border flex items-center gap-4 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className={isDark ? 'text-white' : 'text-gray-900'}>
              {t.about}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {t.appInformation}
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </motion.button>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className={`w-full rounded-2xl p-4 transition-colors border flex items-center gap-4 ${
            isDark 
              ? 'bg-rose-900/20 border-rose-800 hover:bg-rose-900/30' 
              : 'bg-rose-50 border-rose-200 hover:bg-rose-100'
          }`}
        >
          <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
            <LogOut className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className={isDark ? 'text-rose-400' : 'text-rose-700'}>
              {t.logout}
            </p>
            <p className={`text-xs ${isDark ? 'text-rose-500' : 'text-rose-600'}`}>
              {t.signOut}
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-rose-500' : 'text-rose-400'}`} />
        </motion.button>
      </div>
    </motion.div>
  );
}