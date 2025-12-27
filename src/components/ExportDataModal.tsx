import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileSpreadsheet, Search, CheckCircle, Users, User } from 'lucide-react';
import { getTranslation, Language } from '../translations';
import * as XLSX from 'xlsx';
import { Transaction } from '../App';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: 'light' | 'dark';
  transactions: Transaction[];
}

type ExportOption = 'all' | 'individual' | null;

export function ExportDataModal({
  isOpen,
  onClose,
  language,
  theme,
  transactions,
}: ExportDataModalProps) {
  const t = getTranslation(language);
  const isDark = theme === 'dark';
  const [exportOption, setExportOption] = useState<ExportOption>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Get unique person names from transactions
  const uniquePeople = Array.from(new Set(transactions.map(t => t.name)));
  
  // Filter people based on search
  const filteredPeople = searchQuery.trim()
    ? uniquePeople.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
    : uniquePeople;

  const handleExportAll = () => {
    if (transactions.length === 0) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare transaction data for export
    const exportData = transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString('en-IN'),
      'Person Name': t.name,
      'Person Type': t.personType === 'worker' ? 'Worker' : 'Supplier',
      Type: t.type === 'in' ? 'Money In' : 'Money Out',
      Amount: t.amount,
      Site: t.site || 'N/A',
      Note: t.note || '',
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'All Transactions');

    // Download file
    const fileName = `smart_ledger_all_transactions_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Close modal after download
    setTimeout(() => {
      onClose();
      setExportOption(null);
      setSearchQuery('');
    }, 500);
  };

  const handleExportIndividual = (personName: string) => {
    const personTransactions = transactions.filter(t => t.name === personName);
    
    if (personTransactions.length === 0) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Calculate summary
    const totalIn = personTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = personTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIn - totalOut;

    // Summary data
    const summaryData = [
      { Metric: 'Person Name', Value: personName },
      { Metric: 'Person Type', Value: personTransactions[0].personType === 'worker' ? 'Worker' : 'Supplier' },
      { Metric: 'Total Transactions', Value: personTransactions.length },
      { Metric: 'Total Money In', Value: totalIn },
      { Metric: 'Total Money Out', Value: totalOut },
      { Metric: 'Net Balance', Value: netBalance },
      { Metric: 'Status', Value: netBalance >= 0 ? 'You will receive' : 'You will pay' },
    ];

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Transaction details
    const exportData = personTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString('en-IN'),
      Type: t.type === 'in' ? 'Money In' : 'Money Out',
      Amount: t.amount,
      Site: t.site || 'N/A',
      Note: t.note || '',
    }));

    const transactionsWs = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, transactionsWs, 'Transactions');

    // Download file
    const fileName = `smart_ledger_${personName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Close modal after download
    setTimeout(() => {
      onClose();
      setExportOption(null);
      setSearchQuery('');
      setSelectedPerson(null);
    }, 500);
  };

  const handleClose = () => {
    onClose();
    setExportOption(null);
    setSearchQuery('');
    setSelectedPerson(null);
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
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${ 
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
              : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.exportData || 'Export Data'}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {t.exportToExcel || 'Download as Excel file'}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
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
          {exportOption === null && (
            <div className="space-y-3">
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.selectExportOption || 'Select what you want to export:'}
              </p>

              {/* Export All Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setExportOption('all');
                  handleExportAll();
                }}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                  isDark 
                    ? 'border-gray-700 hover:bg-gray-800 bg-gray-800/50' 
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-emerald-600' : 'bg-emerald-500'
                }`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.exportAllData || 'Export All Data'}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t.exportAllDesc || `Export all ${transactions.length} transactions`}
                  </p>
                </div>
                <FileSpreadsheet className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </motion.button>

              {/* Export Individual Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExportOption('individual')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                  isDark 
                    ? 'border-gray-700 hover:bg-gray-800 bg-gray-800/50' 
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.exportIndividual || 'Export Individual'}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t.exportIndividualDesc || 'Export transactions for a specific person'}
                  </p>
                </div>
                <FileSpreadsheet className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </motion.button>
            </div>
          )}

          {/* Individual Export - Person Selection */}
          {exportOption === 'individual' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => {
                  setExportOption(null);
                  setSearchQuery('');
                }}
                className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                ← {t.back || 'Back'}
              </button>

              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPerson || 'Search person name...'}
                  className={`w-full h-12 rounded-xl pl-12 pr-4 border transition-colors focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
                  }`}
                />
              </div>

              {/* Person List */}
              <div className={`rounded-xl border max-h-96 overflow-y-auto ${
                isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}>
                {filteredPeople.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                      {t.noPersonFound || 'No person found'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredPeople.map((personName) => {
                      const personTransactions = transactions.filter(t => t.name === personName);
                      const personType = personTransactions[0]?.personType;
                      const totalIn = personTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
                      const totalOut = personTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
                      const netBalance = totalIn - totalOut;

                      return (
                        <motion.button
                          key={personName}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleExportIndividual(personName)}
                          className={`w-full p-4 text-left transition-colors ${
                            isDark 
                              ? 'hover:bg-gray-700' 
                              : 'hover:bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={isDark ? 'text-white' : 'text-gray-900'}>
                                  {personName}
                                </h4>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  personType === 'worker'
                                    ? isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                                    : isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'
                                }`}>
                                  {personType === 'worker' ? t.worker : t.supplier}
                                </span>
                              </div>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                {personTransactions.length} {t.transactions || 'transactions'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm ${netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                ₹{Math.abs(netBalance).toLocaleString()}
                              </div>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                {netBalance >= 0 ? t.toReceive || 'to receive' : t.toPay || 'to pay'}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
