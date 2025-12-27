import { motion } from 'motion/react';
import { TrendingUp, Users, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface SummaryCardsProps {
  youAreOwed: number;
  peopleOwingYou: number;
  youOwe: number;
}

export function SummaryCards({ youAreOwed, peopleOwingYou, youOwe }: SummaryCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      label: "You'll Get",
      value: youAreOwed,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      shadowColor: 'shadow-emerald-500/20',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-600',
    },
    {
      label: "You'll Give",
      value: youOwe,
      icon: TrendingDown,
      gradient: 'from-rose-500 to-red-600',
      bgGradient: 'from-rose-50 to-red-50',
      shadowColor: 'shadow-rose-500/20',
      iconBg: 'bg-rose-500',
      textColor: 'text-rose-600',
    },
  ];

  const balance = youAreOwed - youOwe;

  return (
    <div className="space-y-4 -mt-16">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-2xl border border-white/50 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Animated glow */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10"
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Net Balance</p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex items-baseline gap-1"
                >
                  <span className="text-3xl text-slate-900">₹</span>
                  <motion.span
                    key={balance}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`text-4xl ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {Math.abs(balance).toLocaleString()}
                  </motion.span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-xs mt-1 ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                  {balance >= 0 ? '↗ You are in profit' : '↘ You are in debt'}
                </motion.p>
              </div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Users className="w-3.5 h-3.5" />
                <span>{peopleOwingYou} people</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="text-xs text-slate-600">Updated now</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mini Cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative"
            >
              <div className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-4 shadow-lg ${card.shadowColor} border border-white/50 backdrop-blur-sm relative overflow-hidden`}>
                {/* Animated background */}
                <motion.div
                  animate={{
                    scale: hoveredCard === index ? 1.5 : 1,
                    opacity: hoveredCard === index ? 0.3 : 0.1,
                  }}
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-2xl`}
                />

                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: hoveredCard === index ? [0, -10, 10, -10, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <p className="text-xs text-slate-600 mb-1">{card.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl ${card.textColor}`}>₹</span>
                    <motion.span
                      key={card.value}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`text-2xl ${card.textColor}`}
                    >
                      {card.value.toLocaleString()}
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.09 7.26L18 9L13.09 10.74L12 16L10.91 10.74L6 9L10.91 7.26L12 2Z" fill="currentColor"/>
      <path d="M19 11L19.72 13.79L22 15L19.72 16.21L19 19L18.28 16.21L16 15L18.28 13.79L19 11Z" fill="currentColor"/>
      <path d="M19 3L19.72 5.79L22 7L19.72 8.21L19 11L18.28 8.21L16 7L18.28 5.79L19 3Z" fill="currentColor"/>
    </svg>
  );
}