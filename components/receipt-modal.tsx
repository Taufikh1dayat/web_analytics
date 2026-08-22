'use client';

import React, { useRef } from 'react';
import { Transaction } from '@/types';
import { X, Printer, CheckCircle2, Coffee, Sparkles } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  cashierName?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  transaction,
  onClose,
  cashierName = 'Kasir Barista',
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[95vh] overflow-y-auto">
        
        {/* Header Action */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Printer className="w-4 h-4 text-amber-500" />
            <span>Struk Pembayaran Digital</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Thermal Receipt Container */}
        <div
          ref={receiptRef}
          className="bg-white text-slate-900 p-5 rounded-xl font-mono text-xs shadow-inner space-y-4 border border-slate-200 select-all"
        >
          {/* Brand Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 mb-1">
              <Coffee className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm tracking-wider uppercase">
              KEDAI KOPI KELAYU
            </h2>
            <p className="text-[10px] text-slate-500">
              Seduhan Kopi Cita Rasa Nusantara
            </p>
            <p className="text-[10px] text-slate-500">
              Outlet 01 • Telp: (021) 8872-990
            </p>
          </div>

          {/* Meta Info */}
          <div className="text-[11px] space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Nota:</span>
              <span className="font-bold text-slate-900">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal/Jam:</span>
              <span>{formattedDate} {currentTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pelanggan/Meja:</span>
              <span className="font-bold text-slate-900">{transaction.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kasir:</span>
              <span>{cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pembayaran:</span>
              <span className="font-semibold">{transaction.paymentMethod || 'QRIS'}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2 pb-3 border-b border-dashed border-slate-300">
            <div className="text-[10px] font-bold text-slate-400 flex justify-between uppercase">
              <span>Menu Pesanan</span>
              <span>Subtotal</span>
            </div>

            {transaction.items && transaction.items.length > 0 ? (
              transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-medium text-slate-800">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="shrink-0">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                  {item.variant && (
                    <p className="text-[10px] text-slate-500 pl-3">
                      ({item.variant})
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-between font-medium text-slate-800">
                <span>1x Transaksi Pesanan Manual</span>
                <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Subtotal:</span>
              <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Pajak Restoran (PB1 0%):</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-950 pt-2 border-t border-slate-900">
              <span>TOTAL BAYAR:</span>
              <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PEMBAYARAN LUNAS ({transaction.status})</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1">
            <p className="text-[11px] font-bold text-slate-800">
              Terima Kasih Atas Kunjungan Anda!
            </p>
            <p className="text-[9px] text-slate-500">
              Follow Instagram: @kelayucoffee
            </p>
            <p className="text-[8px] text-slate-400 font-mono pt-1">
              *** SIMPAN STRUK SEBAGAI BUKTI PEMBAYARAN SAH ***
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/25 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
