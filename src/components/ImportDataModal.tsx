import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getTranslation, Language } from '../translations';
import * as XLSX from 'xlsx';
import { createClient } from '../utils/supabase/client';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: 'light' | 'dark';
  userId: string;
}

interface ImportResult {
  success: boolean;
  peopleCount: number;
  sitesCount: number;
  transactionsCount: number;
  errors: string[];
}

export function ImportDataModal({
  isOpen,
  onClose,
  language,
  theme,
  userId,
}: ImportDataModalProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      const supabase = createClient();
      let peopleCount = 0;
      let sitesCount = 0;
      let transactionsCount = 0;
      const errors: string[] = [];

      // Import People (Sheet 1)
      if (workbook.SheetNames.includes('People')) {
        const peopleSheet = workbook.Sheets['People'];
        const peopleData = XLSX.utils.sheet_to_json(peopleSheet) as any[];
        
        for (const row of peopleData) {
          if (!row.name || row.type === undefined) {
            errors.push(`${t.importSkippedRow}: ${JSON.stringify(row)}`);
            continue;
          }
          
          // Convert numeric type to string: 0 = worker, 1 = supplier
          let personType: string;
          if (row.type === 0 || row.type === '0') {
            personType = 'worker';
          } else if (row.type === 1 || row.type === '1') {
            personType = 'supplier';
          } else {
            errors.push(`${t.importInvalidType}: ${row.name} - ${row.type}`);
            continue;
          }

          try {
            const { error } = await supabase
              .from('people')
              .insert({
                name: row.name,
                type: personType,
                phone: row.phone || null,
                user_id: userId,
              });
            
            if (error) throw error;
            peopleCount++;
          } catch (error: any) {
            if (error.code === '23505') {
              // Duplicate entry - skip
              continue;
            }
            errors.push(`${t.importErrorPerson}: ${row.name}`);
          }
        }
      }

      // Import Sites (Sheet 2)
      if (workbook.SheetNames.includes('Sites')) {
        const sitesSheet = workbook.Sheets['Sites'];
        const sitesData = XLSX.utils.sheet_to_json(sitesSheet) as any[];
        
        for (const row of sitesData) {
          if (!row.name) {
            errors.push(`${t.importSkippedRow}: ${JSON.stringify(row)}`);
            continue;
          }

          try {
            const { error } = await supabase
              .from('sites')
              .insert({
                name: row.name,
                budget: row.budget ? parseFloat(row.budget) : 0,
                user_id: userId,
              });
            
            if (error) throw error;
            sitesCount++;
          } catch (error: any) {
            if (error.code === '23505') {
              // Duplicate entry - skip
              continue;
            }
            errors.push(`${t.importErrorSite}: ${row.name}`);
          }
        }
      }

      // Import Transactions (Sheet 3)
      if (workbook.SheetNames.includes('Transactions')) {
        const transactionsSheet = workbook.Sheets['Transactions'];
        const transactionsData = XLSX.utils.sheet_to_json(transactionsSheet) as any[];
        
        for (const row of transactionsData) {
          if (!row.person_name || !row.amount || row.type === undefined) {
            errors.push(`${t.importSkippedRow}: ${JSON.stringify(row)}`);
            continue;
          }

          // Convert numeric type to string: 0 = money_in, 1 = money_out
          let transactionType: string;
          if (row.type === 0 || row.type === '0') {
            transactionType = 'money_in';
          } else if (row.type === 1 || row.type === '1') {
            transactionType = 'money_out';
          } else {
            errors.push(`${t.importInvalidTransactionType}: ${row.person_name} - ${row.type}`);
            continue;
          }

          try {
            // Get person ID
            const { data: person } = await supabase
              .from('people')
              .select('id, type')
              .eq('name', row.person_name)
              .eq('user_id', userId)
              .single();

            if (!person) {
              errors.push(`${t.importPersonNotFound}: ${row.person_name}`);
              continue;
            }

            // Get site ID if site_name provided
            let siteId = null;
            if (row.site_name) {
              const { data: site } = await supabase
                .from('sites')
                .select('id')
                .eq('name', row.site_name)
                .eq('user_id', userId)
                .single();

              if (site) {
                siteId = site.id;
              }
            }

            const { error } = await supabase
              .from('transactions')
              .insert({
                person_id: person.id,
                person_type: person.type,
                amount: parseFloat(row.amount),
                type: transactionType,
                date: row.date || new Date().toISOString(),
                site_id: siteId,
                note: row.note || null,
                user_id: userId,
              });
            
            if (error) throw error;
            transactionsCount++;
          } catch (error) {
            errors.push(`${t.importErrorTransaction}: ${row.person_name}`);
          }
        }
      }

      setResult({
        success: errors.length < (peopleCount + sitesCount + transactionsCount),
        peopleCount,
        sitesCount,
        transactionsCount,
        errors,
      });

    } catch (error) {
      setResult({
        success: false,
        peopleCount: 0,
        sitesCount: 0,
        transactionsCount: 0,
        errors: [t.importFileError],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: People (0 = worker, 1 = supplier)
    const peopleData = [
      { name: 'Ramesh Kumar', type: 0, phone: '9876543210' },
      { name: 'Vijay Patel', type: 0, phone: '9988776655' },
      { name: 'ABC Suppliers', type: 1, phone: '9123456789' },
      { name: 'XYZ Materials', type: 1, phone: '9876501234' },
    ];
    const peopleWs = XLSX.utils.json_to_sheet(peopleData);
    XLSX.utils.book_append_sheet(wb, peopleWs, 'People');

    // Sheet 2: Sites
    const sitesData = [
      { name: 'Site A - Building', budget: 500000 },
      { name: 'Site B - Renovation', budget: 300000 },
    ];
    const sitesWs = XLSX.utils.json_to_sheet(sitesData);
    XLSX.utils.book_append_sheet(wb, sitesWs, 'Sites');

    // Sheet 3: Transactions (0 = money_in, 1 = money_out)
    const transactionsData = [
      {
        person_name: 'Ramesh Kumar',
        amount: 5000,
        type: 1,
        date: '2024-01-15',
        site_name: 'Site A - Building',
        note: 'Daily wage payment',
      },
      {
        person_name: 'Vijay Patel',
        amount: 3000,
        type: 0,
        date: '2024-01-16',
        site_name: 'Site A - Building',
        note: 'Advance received from worker',
      },
      {
        person_name: 'ABC Suppliers',
        amount: 15000,
        type: 1,
        date: '2024-01-16',
        site_name: 'Site A - Building',
        note: 'Cement purchase',
      },
      {
        person_name: 'XYZ Materials',
        amount: 8000,
        type: 0,
        date: '2024-01-17',
        site_name: 'Site B - Renovation',
        note: 'Payment received for returned materials',
      },
    ];
    const transactionsWs = XLSX.utils.json_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(wb, transactionsWs, 'Transactions');

    // Download file
    XLSX.writeFile(wb, 'smart_ledger_template.xlsx');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
              : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.importData}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {t.importFromExcel}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Download Template Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={downloadTemplate}
              className={`w-full p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 transition-colors ${
                isDark 
                  ? 'border-gray-600 hover:bg-gray-700/50 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Download className="w-5 h-5" />
              <span>{t.downloadTemplate}</span>
            </motion.button>

            {/* File Upload */}
            <div className={`p-6 rounded-xl border-2 border-dashed ${
              isDark 
                ? 'border-gray-600 bg-gray-800/50' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="excel-upload"
                disabled={isProcessing}
              />
              <label
                htmlFor="excel-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className={`w-12 h-12 mb-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <p className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.uploadExcelFile}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {fileName || t.clickToSelectFile}
                </p>
              </label>
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <Loader2 className={`w-5 h-5 animate-spin ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>
                  {t.importProcessing}
                </span>
              </motion.div>
            )}

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl ${
                  result.success
                    ? isDark 
                      ? 'bg-emerald-900/20 border border-emerald-800' 
                      : 'bg-emerald-50 border border-emerald-200'
                    : isDark 
                      ? 'bg-rose-900/20 border border-rose-800' 
                      : 'bg-rose-50 border border-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                  ) : (
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                      isDark ? 'text-rose-400' : 'text-rose-600'
                    }`} />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm mb-2 ${
                      result.success
                        ? isDark ? 'text-emerald-300' : 'text-emerald-700'
                        : isDark ? 'text-rose-300' : 'text-rose-700'
                    }`}>
                      {result.success ? t.importSuccess : t.importPartialSuccess}
                    </p>
                    <div className={`text-xs space-y-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p>{t.importPeopleAdded}: {result.peopleCount}</p>
                      <p>{t.importSitesAdded}: {result.sitesCount}</p>
                      <p>{t.importTransactionsAdded}: {result.transactionsCount}</p>
                      {result.errors.length > 0 && (
                        <p className={isDark ? 'text-rose-400' : 'text-rose-600'}>
                          {t.importErrors}: {result.errors.length}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Format Guide */}
            <div className={`p-4 rounded-xl text-xs ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            }`}>
              <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.importExpectedFormat}:
              </p>
              <ul className={`space-y-1 list-disc list-inside ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <li>{t.importFormatPeople}</li>
                <li>{t.importFormatSites}</li>
                <li>{t.importFormatTransactions}</li>
              </ul>
            </div>
          </div>

          {/* Close Button */}
          {result && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full mt-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              {t.close}
            </motion.button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}