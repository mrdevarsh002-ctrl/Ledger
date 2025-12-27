import { useState } from 'react';
import { motion } from 'motion/react';
import { getTranslation, Language } from '../translations';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
  language: Language;
  theme: 'light' | 'dark';
  onClose: () => void;
  onSendResetLink: (email: string) => Promise<void>;
}

export function ForgotPasswordModal({ language, theme, onClose, onSendResetLink }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const t = getTranslation(language);
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSendResetLink(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-md ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden`}
        >
          <div className={`${isDark ? 'bg-gradient-to-br from-green-900/40 to-blue-900/40' : 'bg-gradient-to-br from-green-50 to-blue-50'} px-8 pt-12 pb-8`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-green-600' : 'bg-green-500'} flex items-center justify-center shadow-lg`}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {t.resetLinkSent}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {t.checkYourEmail}
            </motion.p>
          </div>

          <div className="px-8 py-8">
            <p className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.resetLinkDescription}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`w-full py-3 rounded-xl ${
                isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white flex items-center justify-center gap-2 transition-colors shadow-lg`}
            >
              <ArrowLeft className="w-5 h-5" />
              {t.backToLogin}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden`}
      >
        <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-br from-blue-50 to-purple-50'} px-8 pt-12 pb-8`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center shadow-lg`}>
              <Mail className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {t.resetPassword}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {t.resetLinkDescription.split('.')[0]}
          </motion.p>
        </div>

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
                {t.sendResetLink}
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                {t.sendResetLink}
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl ${
              isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
            } ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center justify-center gap-2 transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backToLogin}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
