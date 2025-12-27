import { motion } from 'motion/react';
import { Home, Users, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'people', icon: Users, label: 'People' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 px-4 py-3 safe-area-inset-bottom z-30"
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Active indicator background */}
        <motion.div
          layoutId="activeTab"
          className="absolute h-12 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-2xl"
          style={{
            left: `${navItems.findIndex(item => item.id === activeTab) * 25}%`,
            width: '20%',
            marginLeft: '2.5%',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center gap-1 px-6 py-2 z-10"
            >
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.2, 1] : 1,
                  rotate: isActive ? [0, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-violet-600' : 'text-slate-600'
                  }`}
                />
              </motion.div>
              <motion.span
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.6,
                }}
                className={`text-xs transition-colors ${
                  isActive ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                {item.label}
              </motion.span>

              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -top-1 w-1 h-1 bg-violet-600 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
