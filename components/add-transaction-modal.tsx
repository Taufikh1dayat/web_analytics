'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types';
import { X, Plus, DollarSign, User, Tag } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (newTx: Transaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Iced Coffee Special');
  const [status, setStatus] = useState<Transaction['status']>('Completed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount) return;

    const newTx: Transaction = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`,
      amount: parseFloat(amount),
      status,
      date: new Date().toISOString().split('T')[0],
      category,
    };

    onAddTransaction(newTx);
    onClose();

    // Reset form
    setCustomerName('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Tambah Transaksi Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" /> Nama Pelanggan
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Andi Pratama"
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Jumlah (Rp)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="24000"
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Iced Coffee Special">Iced Coffee Special</option>
                <option value="Espresso & Latte">Espresso & Latte</option>
                <option value="Non-Coffee Drinks">Non-Coffee Drinks</option>
                <option value="Pastry & Toast">Pastry & Toast</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Status Transaksi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Completed', 'Pending', 'Failed'] as const).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    status === st
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
