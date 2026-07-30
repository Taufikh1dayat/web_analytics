'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  if (!message) return null;

  let style = 'bg-slate-900 border-slate-800 text-slate-100';
  let Icon = CheckCircle2;
  let iconStyle = 'text-emerald-400';

  if (type === 'success') {
    style = 'bg-slate-900/95 border-emerald-800/60 text-white';
    Icon = CheckCircle2;
    iconStyle = 'text-emerald-400';
  } else if (type === 'error') {
    style = 'bg-slate-900/95 border-rose-800/60 text-white';
    Icon = AlertCircle;
    iconStyle = 'text-rose-400';
  } else if (type === 'info') {
    style = 'bg-slate-900/95 border-blue-800/60 text-white';
    Icon = Info;
    iconStyle = 'text-blue-400';
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${style}`}>
        <Icon className={`w-5 h-5 shrink-0 ${iconStyle}`} />
        <span className="text-xs font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
