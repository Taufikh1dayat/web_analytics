'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { UserTrendData } from '@/types';

interface LineChartProps {
  data: UserTrendData[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
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
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              borderRadius: '8px',
              color: '#f8fafc',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          <Line
            type="monotone"
            name="Pengguna Aktif"
            dataKey="activeUsers"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4, fill: '#8b5cf6' }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
          />
          <Line
            type="monotone"
            name="Pengguna Baru"
            dataKey="newUsers"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981' }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
