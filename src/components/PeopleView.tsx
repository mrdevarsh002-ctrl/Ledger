import { motion } from 'motion/react';
import { Transaction } from '../App';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface PeopleViewProps {
  transactions: Transaction[];
}

export function PeopleView({ transactions }: PeopleViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const peopleMap = new Map<string, { in: number; out: number }>();

  transactions.forEach(t => {
    const current = peopleMap.get(t.name) || { in: 0, out: 0 };
    if (t.type === 'in') {
      current.in += t.amount;
    } else {
      current.out += t.amount;
    }
    peopleMap.set(t.name, current);
  });

  const people = Array.from(peopleMap.entries())
    .map(([name, amounts]) => ({
      name,
      net: amounts.in - amounts.out,
      in: amounts.in,
      out: amounts.out,
    }))
    .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));

  // Filter people by search query
  const filteredPeople = searchQuery.trim()
    ? people.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : people;

  // Calculate search summary
  const searchSummary = searchQuery.trim() && filteredPeople.length > 0 ? (() => {
    const personTransactions = transactions.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalIn = personTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = personTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    const net = totalIn - totalOut;
    return { totalIn, totalOut, net, count: personTransactions.length };
  })() : null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-6"
    >
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by person name..."
            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 focus:outline-none focus:border-gray-400 transition-colors text-gray-900"
          />
        </div>

        {/* Search Summary */}
        {searchSummary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-gray-900 mb-1">Search Summary</h3>
                <p className="text-sm text-gray-600">{searchSummary.count} transaction(s) found</p>
              </div>
              <div className="text-right">
                <div className={`text-xl ${searchSummary.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ₹{Math.abs(searchSummary.net).toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {searchSummary.net >= 0 ? 'You will receive' : 'You will pay'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <div className="flex-1 bg-white rounded-lg p-2 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1">To Receive</div>
                <div className="text-sm text-emerald-600">₹{searchSummary.totalIn.toLocaleString()}</div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-2 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1">To Pay</div>
                <div className="text-sm text-rose-600">₹{searchSummary.totalOut.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        )}

        {searchQuery.trim() && filteredPeople.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-gray-600"
          >
            No people found for "{searchQuery}"
          </motion.div>
        )}
      </div>

      <h2 className="text-gray-600 text-sm mb-4">
        {searchQuery.trim() ? 'Search Results' : 'All People'}
      </h2>

      <div className="space-y-2">
        {filteredPeople.map((person, index) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-50 rounded-2xl p-4 border border-gray-200 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm ${
                person.net >= 0 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-rose-100 text-rose-600'
              }`}>
                {getInitials(person.name)}
              </div>

              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{person.name}</h3>
                <span className="text-xs text-gray-600">
                  {person.net >= 0 ? 'Will pay you' : 'You will pay'}
                </span>
              </div>

              <div className="text-right">
                <div className={`text-xl ${person.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ₹{Math.abs(person.net).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 bg-white rounded-xl p-2 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1">To Receive</div>
                <div className="text-sm text-emerald-600">₹{person.in.toLocaleString()}</div>
              </div>
              <div className="flex-1 bg-white rounded-xl p-2 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1">To Pay</div>
                <div className="text-sm text-rose-600">₹{person.out.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}