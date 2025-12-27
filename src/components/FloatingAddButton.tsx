import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-full shadow-2xl flex items-center justify-center z-20 group"
      aria-label="Add new entry"
    >
      {/* Pulsing ring */}
      <motion.div
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.7, 0, 0.7]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full"
      />

      {/* Rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-dashed border-white/30 rounded-full"
      />

      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        <Plus className="w-7 h-7 relative z-10" />
      </motion.div>

      {/* Sparkles on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 rounded-full"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              rotate: i * 60,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2"
            style={{
              transformOrigin: '0 0',
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full" style={{ transform: 'translate(30px, -30px)' }} />
          </motion.div>
        ))}
      </motion.div>
    </motion.button>
  );
}
