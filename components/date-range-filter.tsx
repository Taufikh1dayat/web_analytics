'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface DateRangeFilterProps {
  onRangeChange?: (range: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState('30 Hari Terakhir');
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    '7 Hari Terakhir',
    '30 Hari Terakhir',
    '90 Hari Terakhir',
    'Tahun Ini (YTD)',
    'Semua Waktu',
  ];

  const handleSelect = (option: string) => {
    setSelectedRange(option);
    if (onRangeChange) onRangeChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 transition"
      >
        <CalendarIcon className="w-4 h-4 text-blue-500" />
        <span>{selectedRange}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-20 overflow-hidden py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium transition ${
                  selectedRange === option
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
