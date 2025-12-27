import { motion } from 'motion/react';
import { Sparkles, Mic, Send } from 'lucide-react';
import { useState } from 'react';

interface SmartInputBarProps {
  onAddEntry: () => void;
}

export function SmartInputBar({ onAddEntry }: SmartInputBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-5 h-5 text-violet-600" />
        </motion.div>
        <h3 className="text-slate-900">AI Quick Entry</h3>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-2 py-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs rounded-full"
        >
          Beta
        </motion.div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative"
      >
        <motion.div
          animate={{
            boxShadow: isFocused 
              ? '0 20px 40px -12px rgba(139, 92, 246, 0.3)'
              : '0 10px 30px -12px rgba(139, 92, 246, 0.2)',
          }}
          className="relative bg-gradient-to-br from-white to-violet-50 rounded-2xl border-2 border-violet-200 overflow-hidden"
        >
          {/* Animated gradient border effect */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, rgba(217, 70, 239, 0.5) 100%)',
                'linear-gradient(180deg, rgba(139, 92, 246, 0.5) 0%, rgba(217, 70, 239, 0.5) 100%)',
                'linear-gradient(270deg, rgba(139, 92, 246, 0.5) 0%, rgba(217, 70, 239, 0.5) 100%)',
                'linear-gradient(360deg, rgba(139, 92, 246, 0.5) 0%, rgba(217, 70, 239, 0.5) 100%)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
          />

          <div className="relative bg-white m-[2px] rounded-2xl flex items-center gap-2 px-4 py-3">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <input
              type="text"
              placeholder="500 to Ramesh for materials..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
              onClick={onAddEntry}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              readOnly
            />
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center hover:from-violet-200 hover:to-purple-200 transition-colors"
              >
                <Mic className="w-4 h-4 text-violet-600" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onAddEntry}
                className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Floating particles */}
        {isFocused && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-20, -40],
                  x: [0, (i - 1) * 20],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute top-0 left-1/2 w-2 h-2 bg-violet-500 rounded-full"
              />
            ))}
          </>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-slate-500 mt-2 text-center"
      >
        Just type naturally, AI will understand! 🚀
      </motion.p>
    </motion.div>
  );
}
