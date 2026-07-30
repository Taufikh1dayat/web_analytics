'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { RevenueData } from '@/types';

interface BarChartProps {
  data: RevenueData[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[320px] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
        <div className="text-sm text-slate-400">Loading Chart...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              borderRadius: '8px',
              color: '#f8fafc',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            }}
            formatter={(value: any) => [value ? `$${Number(value).toLocaleString()}` : '$0', '']}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
          />
          <Bar
            name="Pendapatan (Revenue)"
            dataKey="revenue"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            name="Pengeluaran (Expenses)"
            dataKey="expenses"
            fill="#f43f5e"
            radius={[6, 6, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
