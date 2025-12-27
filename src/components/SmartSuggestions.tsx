import { motion } from 'motion/react';
import { Zap, TrendingUp } from 'lucide-react';

interface Suggestion {
  id: string;
  name: string;
  amount: number;
  description: string;
  avatar: string;
}

const suggestions: Suggestion[] = [
  { id: '1', name: 'Ramesh', amount: 500, description: 'for materials', avatar: '🔨' },
  { id: '2', name: 'Mahesh', amount: 300, description: 'for advance', avatar: '💼' },
];

interface SmartSuggestionsProps {
  onAddEntry: () => void;
}

export function SmartSuggestions({ onAddEntry }: SmartSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-5 h-5 text-amber-600" />
        </motion.div>
        <h3 className="text-slate-900">Smart Suggestions</h3>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent" />
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddEntry}
            className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200/50 rounded-2xl p-4 hover:shadow-xl hover:border-amber-300 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Animated shine effect */}
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                >
                  {suggestion.avatar}
                </motion.div>
                <div className="text-left">
                  <p className="text-slate-900">{suggestion.name}</p>
                  <p className="text-xs text-slate-600">{suggestion.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-lg text-slate-900">₹{suggestion.amount}</p>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1 text-xs text-green-600"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Recurring</span>
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center"
                >
                  <span className="text-white">→</span>
                </motion.div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
