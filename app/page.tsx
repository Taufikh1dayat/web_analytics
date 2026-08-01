'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { StatCard } from '@/components/stat-card';
import { BarChart as RevenueBarChart } from '@/components/charts/bar-chart';
import { LineChart as UserTrendLineChart } from '@/components/charts/line-chart';
import { PieChart as CategoryPieChart } from '@/components/charts/pie-chart';
import { DataTable } from '@/components/data-table';
import { DateRangeFilter } from '@/components/date-range-filter';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { ToastNotification } from '@/components/toast-notification';
import { KelayuStorePos } from '@/components/kelayu-store-pos';
import { KelayuLandingView } from '@/components/kelayu-landing-view';
import {
  mockStatCards,
  mockRevenueData,
  mockUserTrendData,
  mockCategoryDistribution,
  mockTransactions,
  mockCoffeeProducts,
} from '@/lib/mock-data';
import { Transaction } from '@/types';
import {
  RefreshCw,
  Plus,
  ShieldCheck,
  UserCheck,
  Eye,
  RotateCcw,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

const STORAGE_KEY = 'kelayu_coffee_analytics_v3';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('POS Pemesanan');
  const [userRole, setUserRole] = useState<'Admin' | 'Barista' | 'Kasir' | 'Viewer'>('Admin');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isClient, setIsClient] = useState(false);

  // Initialize and load from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        }
      }
    } catch (err) {
      console.error('Gagal membaca localStorage:', err);
    }
  }, []);

  // Sync to localStorage
  const saveToLocalStorage = (data: Transaction[]) => {
    setTransactions(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Gagal menyimpan ke localStorage:', err);
    }
  };

  const handleResetData = () => {
    saveToLocalStorage(mockTransactions);
    showToast('Data sampel Kelayu Coffee berhasil dipulihkan!');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleCheckoutSuccess = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    saveToLocalStorage(updated);
    showToast(`☕ Pesanan ${newTx.id} untuk ${newTx.customerName} berhasil dibuat!`);
  };

  const handleStatusChange = (id: string, newStatus: Transaction['status']) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    saveToLocalStorage(updated);
    showToast(`Status pesanan ${id} berhasil diperbarui menjadi ${newStatus}`);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    saveToLocalStorage(updated);
    setDeleteTargetId(null);
    showToast(`Pesanan ${id} berhasil dihapus.`);
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `KLY-${Math.floor(8800 + Math.random() * 1000)}`,
    };
    saveToLocalStorage([created, ...transactions]);
    setIsAddModalOpen(false);
    showToast(`Pesanan baru ${created.id} berhasil ditambahkan!`);
  };

  // Recalculate Stats from current transactions
  const calculatedStats = useMemo(() => {
    const totalAmount = transactions
      .filter((t) => t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const baseAmount = 148450000;
    const finalRevenue = baseAmount + totalAmount;

    return mockStatCards.map((card) => {
      if (card.id === '1') {
        return {
          ...card,
          value: `Rp ${finalRevenue.toLocaleString('id-ID')}`,
        };
      }
      if (card.id === '2') {
        return {
          ...card,
          value: `${transactions.length * 4 + 4800} Porsi`,
        };
      }
      if (card.id === '3') {
        return {
          ...card,
          value: `${transactions.length + 1200} Transaksi`,
        };
      }
      return card;
    });
  }, [transactions]);

  // Filter transactions by date range if selected
  const filteredTransactions = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return transactions;
    return transactions.filter((t) => {
      const txDate = new Date(t.date);
      if (dateRange.from && txDate < dateRange.from) return false;
      if (dateRange.to && txDate > dateRange.to) return false;
      return true;
    });
  }, [transactions, dateRange]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && handleDeleteTransaction(deleteTargetId)}
        title="Hapus Pesanan Kopi"
        message={`Apakah Anda yakin ingin menghapus data pesanan ${deleteTargetId}? Tindakan ini tidak dapat dibatalkan.`}
      />

      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 transition-all duration-300 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-500" />
              <span>{activeTab}</span>
            </h2>
            <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              Kedai Kopi Kelayu
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              {(['Admin', 'Barista', 'Kasir', 'Viewer'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRole(r)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition ${
                    userRole === r
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Data Reset Button */}
            <button
              onClick={handleResetData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Reset ke Data Sampel"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic View Switcher */}
        <div className="p-4 sm:p-8 flex-1">
          {activeTab === 'POS Pemesanan' && (
            <KelayuStorePos onCheckoutSuccess={handleCheckoutSuccess} />
          )}

          {activeTab === 'Kelayu Web' && (
            <KelayuLandingView onGoToOrder={() => setActiveTab('POS Pemesanan')} />
          )}

          {activeTab === 'Daftar Pesanan' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div>
                  <h3 className="text-base font-bold text-white">Daftar Pesanan Kelayu Coffee</h3>
                  <p className="text-xs text-slate-400">Lacak & kelola status seduh kopi barista</p>
                </div>
                {userRole !== 'Viewer' && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Transaksi Manual</span>
                  </button>
                )}
              </div>

              <DataTable
                data={filteredTransactions}
                userRole={userRole}
                onStatusChange={handleStatusChange}
                onDelete={setDeleteTargetId}
              />
            </div>
          )}

          {activeTab === 'Analitik Kopi' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Stat Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {calculatedStats.map((stat) => (
                  <StatCard key={stat.id} data={stat} />
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RevenueBarChart data={mockRevenueData} />
                </div>
                <div>
                  <CategoryPieChart data={mockCategoryDistribution} />
                </div>
              </div>

              <div>
                <UserTrendLineChart data={mockUserTrendData} />
              </div>
            </div>
          )}

          {activeTab === 'Katalog Menu' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-white">Katalog Menu & Stok Kelayu Coffee</h3>
                <p className="text-xs text-slate-400">Daftar varian produk kopi dan pastry yang tersedia</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {mockCoffeeProducts.map((p) => (
                    <div key={p.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-amber-500 uppercase">{p.category}</span>
                        <h4 className="font-bold text-white text-sm mt-0.5">{p.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                        <span className="text-xs font-extrabold text-amber-400">Rp {p.price.toLocaleString('id-ID')}</span>
                        <span className="text-[11px] text-slate-400">Stok: <strong className="text-white">{p.stock}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-xl space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-white">Pengaturan Kelayu Coffee & POS</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Peran Aktif Pengguna</label>
                  <p className="text-slate-400 mb-2">Saat ini Anda masuk sebagai: <strong className="text-amber-400">{userRole}</strong></p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Admin', 'Barista', 'Kasir', 'Viewer'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setUserRole(r)}
                        className={`p-2.5 rounded-lg border font-semibold text-left ${
                          userRole === r
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="font-bold text-white mb-2">Penyimpanan Memori</h4>
                  <button
                    onClick={handleResetData}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Data ke Sampel Awal</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
