import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink, Copy, Check } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info.tsx';

interface DiagnosticResult {
  test: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  action?: string;
  actionUrl?: string;
}

interface ConnectionDiagnosticProps {
  theme: 'light' | 'dark';
  onClose: () => void;
}

export function ConnectionDiagnostic({ theme, onClose }: ConnectionDiagnosticProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [copied, setCopied] = useState(false);

  const isDark = theme === 'dark';

  const sqlScript = `-- Smart Ledger Database Setup
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

CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  created_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view their own sites" ON sites;
DROP POLICY IF EXISTS "Users can insert their own sites" ON sites;
DROP POLICY IF EXISTS "Users can update their own sites" ON sites;
DROP POLICY IF EXISTS "Users can delete their own sites" ON sites;
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;

CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sites"
  ON sites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sites"
  ON sites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sites"
  ON sites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sites"
  ON sites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE USING (auth.uid() = user_id);`;

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const tests: DiagnosticResult[] = [];

    // Test 1: Check internet connection
    tests.push({
      test: 'Internet Connection',
      status: 'pending',
      message: 'Checking network connectivity...',
    });
    setResults([...tests]);

    try {
      const onlineTest = await fetch('https://www.google.com', { mode: 'no-cors' });
      tests[0] = {
        test: 'Internet Connection',
        status: 'success',
        message: '✓ Internet connection is working',
      };
    } catch (error) {
      tests[0] = {
        test: 'Internet Connection',
        status: 'error',
        message: '✗ No internet connection detected',
        action: 'Check your network settings',
      };
    }
    setResults([...tests]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Check Supabase connectivity
    tests.push({
      test: 'Supabase Connection',
      status: 'pending',
      message: 'Connecting to Supabase...',
    });
    setResults([...tests]);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('transactions').select('count', { count: 'exact', head: true });
      
      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          tests[1] = {
            test: 'Supabase Connection',
            status: 'warning',
            message: '⚠ Connected but database tables are missing',
            action: 'Create database tables using the SQL script below',
            actionUrl: `https://supabase.com/dashboard/project/${projectId}/sql/new`,
          };
        } else {
          tests[1] = {
            test: 'Supabase Connection',
            status: 'error',
            message: `✗ Connection error: ${error.message}`,
            action: 'Check Supabase project status',
            actionUrl: `https://supabase.com/dashboard/project/${projectId}`,
          };
        }
      } else {
        tests[1] = {
          test: 'Supabase Connection',
          status: 'success',
          message: '✓ Supabase connection successful',
        };
      }
    } catch (error: any) {
      tests[1] = {
        test: 'Supabase Connection',
        status: 'error',
        message: `✗ Failed to connect: ${error.message}`,
        action: 'Verify Supabase project is active',
        actionUrl: `https://supabase.com/dashboard/project/${projectId}`,
      };
    }
    setResults([...tests]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: Check database tables
    tests.push({
      test: 'Database Tables',
      status: 'pending',
      message: 'Checking database schema...',
    });
    setResults([...tests]);

    try {
      const supabase = createClient();
      const tableChecks = await Promise.all([
        supabase.from('transactions').select('count', { count: 'exact', head: true }),
        supabase.from('sites').select('count', { count: 'exact', head: true }),
        supabase.from('user_preferences').select('count', { count: 'exact', head: true }),
      ]);

      const missingTables = [];
      if (tableChecks[0].error) missingTables.push('transactions');
      if (tableChecks[1].error) missingTables.push('sites');
      if (tableChecks[2].error) missingTables.push('user_preferences');

      if (missingTables.length > 0) {
        tests[2] = {
          test: 'Database Tables',
          status: 'error',
          message: `✗ Missing tables: ${missingTables.join(', ')}`,
          action: 'Create tables using SQL script below',
          actionUrl: `https://supabase.com/dashboard/project/${projectId}/sql/new`,
        };
      } else {
        tests[2] = {
          test: 'Database Tables',
          status: 'success',
          message: '✓ All required tables exist',
        };
      }
    } catch (error: any) {
      tests[2] = {
        test: 'Database Tables',
        status: 'error',
        message: '✗ Cannot check tables',
        action: 'Create tables using SQL script below',
        actionUrl: `https://supabase.com/dashboard/project/${projectId}/sql/new`,
      };
    }
    setResults([...tests]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 4: Check Auth configuration
    tests.push({
      test: 'Auth Configuration',
      status: 'pending',
      message: 'Checking authentication settings...',
    });
    setResults([...tests]);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      tests[3] = {
        test: 'Auth Configuration',
        status: 'warning',
        message: '⚠ Make sure email confirmation is disabled for testing',
        action: 'Configure auth settings',
        actionUrl: `https://supabase.com/dashboard/project/${projectId}/auth/providers`,
      };
    } catch (error: any) {
      tests[3] = {
        test: 'Auth Configuration',
        status: 'warning',
        message: '⚠ Cannot verify auth settings',
        action: 'Check auth configuration',
        actionUrl: `https://supabase.com/dashboard/project/${projectId}/auth/providers`,
      };
    }
    setResults([...tests]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={isDark ? 'text-white' : 'text-gray-900'}>Connection Diagnostics</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Project: {projectId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Run Diagnostic Button */}
          {results.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runDiagnostics}
              disabled={isRunning}
              className={`w-full py-4 rounded-xl ${
                isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50`}
            >
              <Activity className="w-5 h-5" />
              Run Diagnostics
            </motion.button>
          )}

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <motion.div
                    key={result.test}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <h3 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {result.test}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {result.message}
                        </p>
                        {result.action && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              Action:
                            </span>
                            {result.actionUrl ? (
                              <a
                                href={result.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 underline"
                              >
                                {result.action}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {result.action}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Show SQL Script if tables are missing */}
                {results.some(r => r.test === 'Database Tables' && r.status !== 'success') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-xl border ${
                      isDark ? 'border-blue-900/50 bg-blue-950/20' : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <h3 className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      📋 Database Setup SQL
                    </h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={copySQL}
                          className={`flex-1 py-2 px-4 rounded-lg ${
                            isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                          } border ${isDark ? 'border-gray-700' : 'border-gray-300'} flex items-center justify-center gap-2`}
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy SQL'}
                        </motion.button>
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={`https://supabase.com/dashboard/project/${projectId}/sql/new`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 py-2 px-4 rounded-lg ${
                            isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                          } text-white flex items-center justify-center gap-2`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open SQL Editor
                        </motion.a>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        1. Click "Copy SQL" above<br />
                        2. Click "Open SQL Editor"<br />
                        3. Paste the SQL and click "Run"
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Run Again Button */}
                {!isRunning && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runDiagnostics}
                    className={`w-full mt-4 py-3 rounded-xl border-2 border-dashed ${
                      isDark ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300' : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                    } transition-colors`}
                  >
                    Run Diagnostics Again
                  </motion.button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
