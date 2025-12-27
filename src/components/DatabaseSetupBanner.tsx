import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { getTranslation, Language } from '../translations';

interface DatabaseSetupBannerProps {
  onClose: () => void;
  onCheckDatabase: () => void;
  language: Language;
  theme: 'light' | 'dark';
}

const SQL_SCRIPT = `-- Smart Ledger Database Setup
-- Copy and paste this entire script into your Supabase SQL Editor

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  person_type TEXT NOT NULL CHECK (person_type IN ('worker', 'supplier')),
  note TEXT NOT NULL,
  additional_notes TEXT,
  date DATE NOT NULL,
  site TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sites table
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  created_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE USING (auth.uid() = user_id);

-- Policies for sites
CREATE POLICY "Users can view their own sites"
  ON sites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sites"
  ON sites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sites"
  ON sites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sites"
  ON sites FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE USING (auth.uid() = user_id);`;

export function DatabaseSetupBanner({ onClose, onCheckDatabase, language, theme }: DatabaseSetupBannerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);
  const isDark = theme === 'dark';

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Clipboard API failed, show textarea for manual copy
      console.log('Clipboard blocked, showing manual copy option');
      setShowTextarea(true);
    }
  };

  const handleManualCopy = () => {
    const textarea = document.getElementById('sql-script-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Manual copy failed:', error);
      }
    }
  };

  const translations = {
    en: {
      title: 'Database Setup Required',
      description: 'Your data won\'t be saved permanently until you set up the database.',
      tempMode: 'You can use the app now, but your data will be lost when you log out.',
      setupButton: 'Show Setup Instructions',
      hideButton: 'Hide Instructions',
      step1: 'Open your Supabase project dashboard',
      step2: 'Go to SQL Editor in the left sidebar',
      step3: 'Click "New Query"',
      step4: 'Copy the SQL script below and paste it',
      step5: 'Click "Run" to create the tables',
      copySQL: 'Copy SQL Script',
      copied: 'Copied!',
      dismiss: 'I\'ll do this later',
      warning: 'Without database setup, your data will NOT persist after logout!',
    },
    gu: {
      title: 'ડેટાબેસ સેટઅપ જરૂરી છે',
      description: 'તમે ડેટાબેસ સેટઅપ ન કરો ત્યાં સુધી તમારો ડેટા કાયમી રીતે સાચવવામાં આવશે નહીં.',
      tempMode: 'તમે હમણાં એપ્લિકેશનનો ઉપયોગ કરી શકો છો, પરંતુ લોગઆઉટ કર્યા પછી તમારો ડેટા ખોવાઈ જશે.',
      setupButton: 'સેટઅપ સૂચનાઓ બતાવો',
      hideButton: 'સૂચનાઓ છુપાવો',
      step1: 'તમારું Supabase પ્રોજેક્ટ ડેશબોર્ડ ખોલો',
      step2: 'ડાબી સાઇડબારમાં SQL Editor પર જાઓ',
      step3: '"New Query" પર ક્લિક કરો',
      step4: 'નીચેના SQL સ્ક્રિપ્ટને કૉપિ કરો અને પેસ્ટ કરો',
      step5: 'ટેબલ્સ બનાવવા માટે "Run" પર ક્લિક કરો',
      copySQL: 'SQL સ્ક્રિપ્ટ કૉપિ કરો',
      copied: 'કૉપિ થયું!',
      dismiss: 'હું આ પછીથી કરીશ',
      warning: 'ડેટાબેસ સેટઅપ વિના, લોગઆઉટ પછી તમારો ડેટા રહેશે નહીં!',
    },
    hi: {
      title: 'डेटाबेस सेटअप आवश्यक है',
      description: 'आपका डेटा तब तक स्थायी रूप से सहेजा नहीं जाएगा जब तक आप डेटाबेस सेट अप नहीं करते।',
      tempMode: 'आप अभी ऐप का उपयोग कर सकते हैं, लेकिन लॉगआउट के बाद आपका डेटा खो जाएगा।',
      setupButton: 'सेटअप निर्देश दिखाएं',
      hideButton: 'निर्देश छुपाएं',
      step1: 'अपना Supabase प्रोजेक्ट डैशबोर्ड खोलें',
      step2: 'बाएं साइडबार में SQL Editor पर जाएं',
      step3: '"New Query" पर क्लिक करें',
      step4: 'नीचे दिए गए SQL स्क्रिप्ट को कॉपी करें और पेस्ट करें',
      step5: 'टेबल बनाने के लिए "Run" पर क्लिक करें',
      copySQL: 'SQL स्क्रिप्ट कॉपी करें',
      copied: 'कॉपी हो गया!',
      dismiss: 'मैं बाद में करूंगा',
      warning: 'डेटाबेस सेटअप के बिना, लॉगआउट के बाद आपका डेटा सहेजा नहीं जाएगा!',
    },
  };

  const t = translations[language];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-yellow-900/95' : 'bg-yellow-50'} border-b-2 ${isDark ? 'border-yellow-700' : 'border-yellow-400'} shadow-lg backdrop-blur-sm`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className={`flex-shrink-0 w-5 h-5 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-yellow-100' : 'text-yellow-900'}`}>
                    {t.title}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                    {t.description}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    {t.tempMode}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1 rounded hover:bg-yellow-200/50 transition-colors ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isDark 
                      ? 'bg-yellow-700 text-yellow-100 hover:bg-yellow-600' 
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {showDetails ? t.hideButton : t.setupButton}
                </button>
                <button
                  onClick={onCheckDatabase}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isDark 
                      ? 'bg-green-700 text-green-100 hover:bg-green-600' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  ✓ Check My Setup
                </button>
                <button
                  onClick={onClose}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isDark 
                      ? 'bg-yellow-800/50 text-yellow-200 hover:bg-yellow-800' 
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  {t.dismiss}
                </button>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-yellow-950/50' : 'bg-yellow-100/50'}`}>
                      <ol className={`space-y-2 text-sm ${isDark ? 'text-yellow-100' : 'text-yellow-900'}`}>
                        <li className="flex gap-2">
                          <span className="font-semibold">1.</span>
                          <span>{t.step1}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold">2.</span>
                          <span>{t.step2}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold">3.</span>
                          <span>{t.step3}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold">4.</span>
                          <span>{t.step4}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold">5.</span>
                          <span>{t.step5}</span>
                        </li>
                      </ol>

                      <button
                        onClick={handleCopySQL}
                        className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                          copied
                            ? isDark 
                              ? 'bg-green-700 text-green-100' 
                              : 'bg-green-600 text-white'
                            : isDark
                              ? 'bg-yellow-700 text-yellow-100 hover:bg-yellow-600'
                              : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            {t.copied}
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            {t.copySQL}
                          </>
                        )}
                      </button>

                      {showTextarea && (
                        <div className="mt-4">
                          <textarea
                            id="sql-script-textarea"
                            className={`w-full h-40 p-3 rounded-lg font-mono text-xs ${
                              isDark 
                                ? 'bg-gray-900 text-gray-100 border-gray-700' 
                                : 'bg-white text-gray-900 border-gray-300'
                            } border`}
                            value={SQL_SCRIPT}
                            readOnly
                          />
                          <button
                            onClick={handleManualCopy}
                            className={`mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                              copied
                                ? isDark 
                                  ? 'bg-green-700 text-green-100' 
                                  : 'bg-green-600 text-white'
                                : isDark
                                  ? 'bg-yellow-700 text-yellow-100 hover:bg-yellow-600'
                                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4" />
                                Select All & Copy (Ctrl+C)
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Select All & Copy (Ctrl+C)
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      <div className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-xs ${isDark ? 'text-red-200' : 'text-red-800'}`}>
                          ⚠️ {t.warning}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}