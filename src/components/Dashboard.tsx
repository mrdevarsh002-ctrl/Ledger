import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from 'lucide-react';
import { Transaction } from '../App';

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const stats = [
    {
      label: 'Total Balance',
      value: balance,
      icon: Wallet,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Income',
      value: totalIncome,
      icon: ArrowUpRight,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      icon: ArrowDownRight,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      label: 'Transactions',
      value: transactions.length,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className={`text-slate-900 ${stat.isCount ? '' : 'tracking-tight'}`}>
                {stat.isCount ? stat.value : `$${stat.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
