'use client';

import React from 'react';
import { StatCardData } from '@/types';
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const iconMap = {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
};

interface StatCardProps {
  data: StatCardData;
}

export const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const IconComponent = iconMap[data.iconName as keyof typeof iconMap] || DollarSign;
  const isIncrease = data.changeType === 'increase';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {data.title}
        </span>
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight" suppressHydrationWarning>
          {data.value}
        </h3>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isIncrease
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
          }`}
        >
          {isIncrease ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {Math.abs(data.change)}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {data.timeFrame}
        </span>
      </div>
    </div>
  );
};
