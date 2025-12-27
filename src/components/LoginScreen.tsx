import { useState } from 'react';
import { motion } from 'motion/react';
import { getTranslation, Language } from '../translations';
import { LogIn, Sparkles, Globe, Moon, Sun, Activity } from 'lucide-react';
import { ConnectionDiagnostic } from './ConnectionDiagnostic';

interface LoginScreenProps {
  language: Language;
  theme: 'light' | 'dark';
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ language, theme, onLogin, onSwitchToSignup, onLanguageChange, onThemeChange, onForgotPassword }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const t = getTranslation(language);
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Provide more specific error messages
      if (err.message.includes('fetch')) {
        setError('⚠️ Connection error. Please check:\n• Your internet connection\n• Supabase project is active\n• Database tables are set up');
      } else if (err.message.includes('Invalid login credentials')) {
        setError(t.invalidCredentials);
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please confirm your email before logging in.');
      } else {
        setError(err.message || t.invalidCredentials);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const languages: Language[] = ['en', 'gu', 'hi'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    onLanguageChange(languages[nextIndex]);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center px-6`}>
      {/* Settings Buttons */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
          className={`w-10 h-10 rounded-full ${
            isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'
          } shadow-lg flex items-center justify-center`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLanguage}
          className={`w-10 h-10 rounded-full ${
            isDark ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600'
          } shadow-lg flex items-center justify-center`}
        >
          <Globe className="w-5 h-5" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-br from-blue-50 to-purple-50'} px-8 pt-12 pb-8`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {t.welcomeBack}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {t.signInToContinue}
          </motion.p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
            >
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              className={`w-full px-4 py-3 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
          </div>

          <div className="space-y-2">
            <label className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              required
              className={`w-full px-4 py-3 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl ${
              isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white flex items-center justify-center gap-2 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                {t.signingIn}
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                {t.signIn}
              </>
            )}
          </motion.button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onSwitchToSignup}
              className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
            >
              {t.dontHaveAccount} <span className="underline">{t.signUp}</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onForgotPassword}
              className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
            >
              {t.forgotPassword}
            </button>
          </div>

          {/* Connection Diagnostic Button */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
            <motion.button
              type="button"
              onClick={() => setShowDiagnostic(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`mt-4 px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } flex items-center justify-center gap-2 mx-auto transition-colors`}
            >
              <Activity className="w-4 h-4" />
              <span className="text-sm">Connection Issues? Run Diagnostics</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Connection Diagnostic Modal */}
      {showDiagnostic && (
        <ConnectionDiagnostic
          theme={theme}
          onClose={() => setShowDiagnostic(false)}
        />
      )}
    </div>
  );
}