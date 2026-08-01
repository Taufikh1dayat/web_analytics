'use client';

import React from 'react';
import { Transaction } from '@/types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-fadeIn">
        
        {/* Header with Warning Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Konfirmasi Penghapusan</h3>
              <p className="text-xs text-slate-400">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Detail Card */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>ID Transaksi:</span>
            <span className="font-mono font-semibold text-slate-200">{transaction.id}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Pelanggan:</span>
            <span className="font-medium text-white">{transaction.customerName}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Jumlah Nilai:</span>
            <span className="font-bold text-amber-400">
              Rp {transaction.amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Transaksi</span>
          </button>
        </div>

      </div>
    </div>
  );
};
