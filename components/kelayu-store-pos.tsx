'use client';

import React, { useState } from 'react';
import { CoffeeMenuProduct, CartItem, Transaction } from '@/types';
import { mockCoffeeProducts } from '@/lib/mock-data';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Coffee,
  CheckCircle2,
  Sparkles,
  Search,
  DollarSign,
  QrCode,
  Wallet,
  X,
  AlertCircle,
} from 'lucide-react';

interface KelayuStorePosProps {
  onCheckoutSuccess: (newTransaction: Transaction) => void;
}

export const KelayuStorePos: React.FC<KelayuStorePosProps> = ({
  onCheckoutSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Cash' | 'E-Wallet'>('QRIS');
  const [activeProductModal, setActiveProductModal] = useState<CoffeeMenuProduct | null>(null);
  
  // QRIS Payment Modal State
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  // Variant choices for modal
  const [tempChoice, setTempChoice] = useState<'Hot' | 'Ice'>('Ice');
  const [sugarChoice, setSugarChoice] = useState<'Normal (100%)' | 'Less (50%)' | 'No Sugar (0%)'>('Normal (100%)');
  const [notes, setNotes] = useState('');
  const [itemQty, setItemQty] = useState(1);

  const categories = ['All', 'Coffee', 'Non-Coffee', 'Pastry', 'Snack'];

  const filteredProducts = mockCoffeeProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenProductModal = (product: CoffeeMenuProduct) => {
    setActiveProductModal(product);
    setTempChoice(product.category === 'Coffee' ? 'Ice' : 'Hot');
    setSugarChoice('Normal (100%)');
    setNotes('');
    setItemQty(1);
  };

  const handleAddToCart = () => {
    if (!activeProductModal) return;

    const newItem: CartItem = {
      product: activeProductModal,
      temperature: tempChoice,
      sugarLevel: sugarChoice,
      quantity: itemQty,
      notes,
      subtotal: activeProductModal.price * itemQty,
    };

    setCart((prev) => [...prev, newItem]);
    setActiveProductModal(null);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCartAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Click Checkout -> Process Cash directly OR Open QRIS Modal for digital payments
  const handleOpenCheckoutModal = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Cash') {
      handleConfirmPayment();
    } else {
      setIsQrisModalOpen(true);
    }
  };

  // Confirm Payment ("Sudah Bayar")
  const handleConfirmPayment = () => {
    const name = customerName.trim() || 'Pelanggan Walk-In';

    const newTx: Transaction = {
      id: `KLY-${Math.floor(8800 + Math.random() * 1000)}`,
      customerName: name,
      customerEmail: `${name.toLowerCase().replace(/\s+/g, '.')}@kelayu.com`,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`,
      amount: totalCartAmount,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      category: cart[0]?.product.category || 'Coffee',
      items: cart.map((c) => ({
        name: c.product.name,
        quantity: c.quantity,
        price: c.product.price,
        variant: `${c.temperature}, ${c.sugarLevel}`,
      })),
      paymentMethod,
    };

    onCheckoutSuccess(newTx);

    // Reset Cart & Close Modal
    setCart([]);
    setCustomerName('');
    setIsQrisModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      {/* LEFT AREA: Catalog & Menu Grid (2 Columns) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Category Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat === 'All' ? 'Semua Menu' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kopi atau pastry..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Coffee Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> BEST SELLER
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-xs text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md border border-slate-800">
                  ★ {product.rating}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-amber-400">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => handleOpenProductModal(product)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pesan</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT AREA: Shopping Cart & POS Checkout (1 Column) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-6 h-fit sticky top-6">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Keranjang Pesanan</h3>
                <p className="text-[11px] text-slate-400">Kasir POS Kelayu Coffee</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400">
              {cart.length} Item
            </span>
          </div>

          {/* Cart Item List */}
          <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{item.product.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.temperature} • {item.sugarLevel} ({item.quantity}x)
                    </p>
                    <p className="text-amber-400 font-semibold">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Coffee className="w-8 h-8 mx-auto text-slate-700" />
                <p>Keranjang masih kosong.</p>
                <p className="text-[11px] text-slate-600">Pilih menu kopi di samping untuk dipesan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer & Payment Form */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Pelanggan / Nomor Meja
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Meja 04 / Budi"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'QRIS', icon: QrCode },
                { name: 'Cash', icon: DollarSign },
                { name: 'E-Wallet', icon: Wallet },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.name;
                return (
                  <button
                    key={pm.name}
                    type="button"
                    onClick={() => setPaymentMethod(pm.name as any)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{pm.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total & Checkout */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-300">Total Pembayaran:</span>
              <span className="text-xl text-amber-400 font-extrabold">
                Rp {totalCartAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleOpenCheckoutModal}
              disabled={cart.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-amber-600/25 transition"
            >
              <QrCode className="w-5 h-5" />
              <span>Checkout Pesanan Kopi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Option Customization Modal */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{activeProductModal.name}</h3>
              <button
                onClick={() => setActiveProductModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-4 text-xs">
              {activeProductModal.category === 'Coffee' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Suhu Sajian</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Ice', 'Hot'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTempChoice(t)}
                        className={`py-2 rounded-lg border font-semibold transition ${
                          tempChoice === t
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {t === 'Ice' ? '❄️ Dingin (Ice)' : '🔥 Hangat (Hot)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeProductModal.category === 'Coffee' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Tingkat Manis (Sugar)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Normal (100%)', 'Less (50%)', 'No Sugar (0%)'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSugarChoice(s)}
                        className={`py-1.5 text-[11px] rounded-lg border font-semibold transition ${
                          sugarChoice === s
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Jumlah Porsi</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setItemQty((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-bold text-white">{itemQty}</span>
                  <button
                    type="button"
                    onClick={() => setItemQty((q) => q + 1)}
                    className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveProductModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20"
              >
                Tambahkan ke Keranjang (Rp {(activeProductModal.price * itemQty).toLocaleString('id-ID')})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QRIS PAYMENT POPUP MODAL */}
      {isQrisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-5 text-center relative overflow-hidden">
            <button
              onClick={() => setIsQrisModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Pembayaran QRIS Kedai Kopi Kelayu</h3>
              <p className="text-xs text-slate-400">
                Pelanggan: <strong className="text-white">{customerName || 'Pelanggan Walk-In'}</strong>
              </p>
            </div>

            {/* Total Amount Badge */}
            <div className="bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl">
              <p className="text-[11px] text-slate-400 font-medium">Total Pembayaran Pesanan:</p>
              <p className="text-2xl font-extrabold text-amber-400 tracking-tight">
                Rp {totalCartAmount.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Enlarged QRIS Image Display */}
            <div className="p-4 bg-white rounded-2xl border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20 w-fit mx-auto">
              <img
                src="/qris.jpeg"
                alt="QRIS Pembayaran Kedai Kopi Kelayu"
                className="w-72 sm:w-80 h-[360px] sm:h-[400px] object-contain rounded-lg transition-transform duration-200 hover:scale-105"
              />
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed px-4">
              Silakan scan kode QRIS di atas menggunakan m-Banking, GoPay, OVO, Dana, atau E-Wallet pilihanmu.
            </p>

            {/* Action Buttons: Sudah Bayar / Belum Bayar */}
            <div className="pt-2 grid grid-cols-2 gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsQrisModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                🔴 Belum Bayar / Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>🟢 Sudah Bayar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
