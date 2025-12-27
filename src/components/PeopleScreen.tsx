import { motion } from 'motion/react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../App';

interface PeopleScreenProps {
  transactions: Transaction[];
}

export function PeopleScreen({ transactions }: PeopleScreenProps) {
  const peopleMap = new Map<string, { given: number; received: number }>();

  transactions.forEach(t => {
    const current = peopleMap.get(t.name) || { given: 0, received: 0 };
    if (t.type === 'given') {
      current.given += t.amount;
    } else {
      current.received += t.amount;
    }
    peopleMap.set(t.name, current);
  });

  const people = Array.from(peopleMap.entries()).map(([name, amounts]) => ({
    name,
    balance: amounts.received - amounts.given,
    given: amounts.given,
    received: amounts.received,
  }));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div
      key="people"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="px-5 pb-6 space-y-6"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search people..."
          className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-3">
        {people.map((person, index) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  person.balance > 0 ? 'from-emerald-400 to-green-500' : 'from-rose-400 to-red-500'
                } rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white">{getInitials(person.name)}</span>
                </div>
                <div>
                  <p className="text-slate-900">{person.name}</p>
                  <p className="text-xs text-slate-500">
                    {person.balance > 0 ? 'Will pay you' : 'You will pay'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl ${person.balance > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ₹{Math.abs(person.balance).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 rounded-xl p-2">
                <p className="text-xs text-green-600 mb-1">Received</p>
                <p className="text-sm text-green-700">₹{person.received.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-2">
                <p className="text-xs text-red-600 mb-1">Given</p>
                <p className="text-sm text-red-700">₹{person.given.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
