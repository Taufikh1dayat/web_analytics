'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { StatCard } from '@/components/stat-card';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { DateRangeFilter } from '@/components/date-range-filter';
import { DataTable } from '@/components/data-table';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { ToastNotification } from '@/components/toast-notification';
import {
  mockStatCards as initialStatCards,
  mockRevenueData,
  mockUserTrendData,
  mockCategoryDistribution,
  mockTransactions as initialTransactions,
} from '@/lib/mock-data';
import { Transaction, StatCardData } from '@/types';
import {
  Download,
  RefreshCw,
  Layers,
  TrendingUp,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Key,
  Bell,
  User,
  Zap,
  Globe,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Plus,
  UserCheck,
  Eye,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'taufik_dev_analytics_transactions_v2';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [userRole, setUserRole] = useState<'Admin' | 'Analyst' | 'Manager' | 'Viewer'>('Admin');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Deletion modal & Toast state
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Dynamic state for transactions and stat cards
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [statCards, setStatCards] = useState<StatCardData[]>(initialStatCards);
  const [dateRangeMultiplier, setDateRangeMultiplier] = useState(1);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
          updateSummaryStats(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load localStorage:', e);
    }
  }, []);

  const updateSummaryStats = (txList: Transaction[]) => {
    const totalRev = txList.reduce(
      (acc, tx) => acc + (tx.status === 'Completed' ? tx.amount : 0),
      125000
    );
    const count = txList.length;

    setStatCards((prev) =>
      prev.map((card) => {
        if (card.id === '1') {
          return {
            ...card,
            value: `$${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          };
        }
        if (card.id === '3') {
          return {
            ...card,
            value: count.toLocaleString('en-US'),
          };
        }
        return card;
      })
    );
  };

  // Helper to update state AND sync to localStorage
  const saveAndSyncTransactions = (newList: Transaction[]) => {
    setTransactions(newList);
    updateSummaryStats(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Data dashboard berhasil diperbarui!', 'info');
    }, 600);
  };

  const handleResetData = () => {
    if (confirm('Apakah kamu yakin ingin mengembalikan data ke sampel awal?')) {
      saveAndSyncTransactions(initialTransactions);
      showToast('Data transaksi berhasil di-reset ke sampel awal.', 'info');
    }
  };

  // Dynamic data mutation: Add new transaction
  const handleAddTransaction = (newTx: Transaction) => {
    const updatedTransactions = [newTx, ...transactions];
    saveAndSyncTransactions(updatedTransactions);
    showToast(`Transaksi baru ${newTx.id} (${newTx.customerName}) tersimpan permanen!`, 'success');
  };

  // Dynamic status change handler for admin / manager
  const handleStatusChange = (id: string, newStatus: Transaction['status']) => {
    const updatedTransactions = transactions.map((tx) =>
      tx.id === id ? { ...tx, status: newStatus } : tx
    );
    saveAndSyncTransactions(updatedTransactions);
    showToast(`Status transaksi ${id} diperbarui menjadi ${newStatus}!`, 'info');
  };

  // Smooth custom modal deletion handler
  const handleConfirmDelete = () => {
    if (!deletingTx) return;

    const targetId = deletingTx.id;
    const targetName = deletingTx.customerName;

    const updatedTransactions = transactions.filter((tx) => tx.id !== targetId);
    saveAndSyncTransactions(updatedTransactions);

    setDeletingTx(null);
    showToast(`Transaksi ${targetId} (${targetName}) telah dihapus secara permanen.`, 'error');
  };

  // Dynamic filter change handler
  const handleDateRangeChange = (range: string) => {
    let multiplier = 1;
    if (range === '7 Hari Terakhir') multiplier = 0.25;
    else if (range === '90 Hari Terakhir') multiplier = 2.8;
    else if (range === 'Tahun Ini (YTD)') multiplier = 4.2;

    setDateRangeMultiplier(multiplier);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 relative">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingTx}
        transaction={deletingTx}
        onClose={() => setDeletingTx(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification */}
      <ToastNotification
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

          {/* Top Bar / Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                Dashboard / {activeTab}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeTab === 'Overview' && 'Ringkasan Analitik'}
                {activeTab === 'Analytics' && 'Analisis Kinerja & Trafik'}
                {activeTab === 'Reports' && 'Pusat Laporan & Dokumentasi'}
                {activeTab === 'Customers' && 'Manajemen Pelanggan'}
                {activeTab === 'Settings' && 'Pengaturan Sistem & Profil'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {activeTab === 'Overview' && 'Pantau kinerja bisnis, tren pengguna, dan riwayat transaksi secara real-time.'}
                {activeTab === 'Analytics' && 'Eksplorasi metrik mendalam, retensi pengguna, dan rasio konversi.'}
                {activeTab === 'Reports' && 'Unduh laporan berkala, kelola jadwal laporan otomatis, dan ekspor data.'}
                {activeTab === 'Customers' && 'Kelola basis pengguna, riwayat langganan, dan status akun pelanggan.'}
                {activeTab === 'Settings' && 'Kelola profil akun, kredensial API, notifikasi, dan preferensi keamanan.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Role Switcher */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400 font-medium">Peran:</span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="bg-transparent text-white font-bold focus:outline-hidden cursor-pointer"
                >
                  <option value="Admin" className="bg-slate-900">Admin (Akses Penuh)</option>
                  <option value="Analyst" className="bg-slate-900">Analyst (Data & Grafik)</option>
                  <option value="Manager" className="bg-slate-900">Manager (Laporan)</option>
                  <option value="Viewer" className="bg-slate-900">Viewer (Lihat Saja)</option>
                </select>
              </div>

              {/* Date Filter */}
              <DateRangeFilter onRangeChange={handleDateRangeChange} />

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              </button>

              {/* Reset Data Button */}
              <button
                onClick={handleResetData}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
                title="Reset Sampel Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Dynamic Add Data Button for Admin/Analyst */}
              {userRole !== 'Viewer' ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Transaksi Baru</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-400 text-xs font-medium">
                  <Eye className="w-4 h-4" />
                  <span>Mode View-Only</span>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC TAB VIEW CONTENT */}

          {/* ----------------- TAB 1: OVERVIEW ----------------- */}
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* 4 Summary Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card) => {
                  let scaledVal = card.value;
                  if (card.id === '2') {
                    scaledVal = Math.round(24520 * dateRangeMultiplier).toLocaleString('en-US');
                  }
                  return <StatCard key={card.id} data={{ ...card, value: scaledVal }} />;
                })}
              </div>

              {/* Charts Grid Row 1: Bar Chart & Line Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        Pendapatan vs Pengeluaran
                      </h3>
                      <p className="text-xs text-slate-400">
                        Perbandingan bulanan revenue dan operational expenses tahun ini
                      </p>
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40">
                      Bulanan
                    </div>
                  </div>
                  <BarChart
                    data={mockRevenueData.map((d) => ({
                      ...d,
                      revenue: Math.round(d.revenue * dateRangeMultiplier),
                      expenses: Math.round(d.expenses * dateRangeMultiplier),
                    }))}
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Distribusi Produk
                      </h3>
                      <p className="text-xs text-slate-400">
                        Proporsi pendapatan berdasarkan kategori layanan
                      </p>
                    </div>
                  </div>
                  <PieChart data={mockCategoryDistribution} />
                </div>
              </div>

              {/* Charts Grid Row 2: User Trends Line Chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Aktivitas & Pertumbuhan Pengguna
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tren pengguna aktif dan registrasi pengguna baru selama seminggu terakhir
                    </p>
                  </div>
                </div>
                <LineChart data={mockUserTrendData} />
              </div>

              {/* Data Table Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Transaksi Terkini ({transactions.length})
                    </h3>
                    <p className="text-xs text-slate-400">
                      Kelola dan pantau daftar transaksi pembayaran pelanggan secara real-time
                    </p>
                  </div>
                  {userRole !== 'Viewer' && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
                    >
                      + Tambah Data
                    </button>
                  )}
                </div>
                <DataTable
                  data={transactions}
                  onStatusChange={handleStatusChange}
                  onRequestDelete={(tx) => setDeletingTx(tx)}
                  userRole={userRole}
                />
              </div>
            </div>
          )}

          {/* ----------------- TAB 2: ANALYTICS ----------------- */}
          {activeTab === 'Analytics' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Detailed Performance Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Durasi Sesi Rata-Rata</span>
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">4m 32s</div>
                  <span className="text-xs text-emerald-400 font-semibold mt-1 inline-block">+12.4% vs minggu lalu</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Bounce Rate</span>
                    <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">32.1%</div>
                  <span className="text-xs text-emerald-400 font-semibold mt-1 inline-block">-3.8% (Lebih baik)</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Page Views / Sesi</span>
                    <Globe className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">5.8 Halaman</div>
                  <span className="text-xs text-emerald-400 font-semibold mt-1 inline-block">+0.6 vs bulan lalu</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Customer LTV</span>
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">$3,420</div>
                  <span className="text-xs text-emerald-400 font-semibold mt-1 inline-block">+18.5% YTD</span>
                </div>
              </div>

              {/* Traffic Source Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-base font-bold text-white mb-1">Sumber Trafik Utama</h3>
                  <p className="text-xs text-slate-400 mb-4">Kanal akuisisi pengunjung dalam rentang terpilih</p>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Organic Search (Google)', share: '42%', count: Math.round(10298 * dateRangeMultiplier).toLocaleString('en-US'), color: 'bg-blue-500' },
                      { name: 'Direct Traffic', share: '28%', count: Math.round(6865 * dateRangeMultiplier).toLocaleString('en-US'), color: 'bg-violet-500' },
                      { name: 'Referral & Media', share: '18%', count: Math.round(4413 * dateRangeMultiplier).toLocaleString('en-US'), color: 'bg-emerald-500' },
                      { name: 'Social Media Campaign', share: '12%', count: Math.round(2942 * dateRangeMultiplier).toLocaleString('en-US'), color: 'bg-amber-500' },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-200">{item.name}</span>
                          <span className="text-slate-400">{item.count} ({item.share})</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-base font-bold text-white mb-1">Perangkat Pengguna</h3>
                  <p className="text-xs text-slate-400 mb-4">Distribusi platform dan sistem operasi</p>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Desktop (macOS / Windows)', share: '64%', count: Math.round(15692 * dateRangeMultiplier).toLocaleString('en-US'), color: 'bg-indigo-500' },
                      { name: 'Mobile (iOS / Android)', share: '31%', count: Math.round(7601 * dateRangeMultiplier).toLocaleString('en-US'), color: 'bg-teal-500' },
                      { name: 'Tablet & Lainnya', share: '5%', count: Math.round(1227 * dateRangeMultiplier).toLocaleString('en-US'), color: 'bg-rose-500' },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-200">{item.name}</span>
                          <span className="text-slate-400">{item.count} ({item.share})</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB 3: REPORTS ----------------- */}
          {activeTab === 'Reports' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Report Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Laporan Keuangan Bulanan',
                    desc: 'Ringkasan pendapatan, pengeluaran, pajak, dan EBITDA.',
                    format: 'PDF / CSV',
                    date: 'Diperbarui Juli 2026',
                  },
                  {
                    title: 'Audit Keamanan & Akses',
                    desc: 'Daftar log aktivitas pengguna, login, dan izin sistem.',
                    format: 'JSON / CSV',
                    date: 'Diperbarui kemarin',
                  },
                  {
                    title: 'Performansi & Retensi Produk',
                    desc: 'Matriks chrun rate, NRR (Net Retention Rate), dan fitur terpopuler.',
                    format: 'PDF / XLSX',
                    date: 'Diperbarui 3 hari lalu',
                  },
                ].map((rep, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-blue-950/80 text-blue-400 flex items-center justify-center mb-3">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white">{rep.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{rep.desc}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">{rep.format}</span>
                      <button
                        onClick={() => showToast(`Mengunduh berkas ${rep.title}...`, 'info')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition"
                      >
                        Unduh Laporan
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scheduled Automated Reports */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Jadwal Laporan Otomatis</h3>
                    <p className="text-xs text-slate-400">Pengiriman ringkasan ke email tim secara periodik</p>
                  </div>
                  {userRole !== 'Viewer' && (
                    <button
                      onClick={() => showToast('Jadwal laporan baru berhasil diaktifkan!', 'success')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                    >
                      + Buat Jadwal Baru
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Nama Laporan</th>
                        <th className="p-3">Frekuensi</th>
                        <th className="p-3">Penerima</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="p-3 font-semibold text-white">Ringkasan Eksekutif Mingguan</td>
                        <td className="p-3">Setiap Senin, 08:00 WIB</td>
                        <td className="p-3">executives@company.com</td>
                        <td className="p-3 text-emerald-400 font-semibold">Aktif</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">Rekapitulasi Transaksi Bulanan</td>
                        <td className="p-3">Tanggal 1 Setiap Bulan</td>
                        <td className="p-3">finance@company.com</td>
                        <td className="p-3 text-emerald-400 font-semibold">Aktif</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB 4: CUSTOMERS ----------------- */}
          {activeTab === 'Customers' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Customer Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Pelanggan</p>
                    <h3 className="text-2xl font-bold text-white" suppressHydrationWarning>
                      {(2450 + (transactions.length - initialTransactions.length)).toLocaleString('en-US')}
                    </h3>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Langganan Aktif</p>
                    <h3 className="text-2xl font-bold text-white">1,890</h3>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-950 text-violet-400 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Tingkat Retensi</p>
                    <h3 className="text-2xl font-bold text-white">96.8%</h3>
                  </div>
                </div>
              </div>

              {/* Full Customer Directory */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Direktori Pelanggan Utama</h3>
                    <p className="text-xs text-slate-400">Daftar akun perusahaan dan transaksi pelanggan</p>
                  </div>
                  {userRole !== 'Viewer' && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
                    >
                      + Tambah Pelanggan
                    </button>
                  )}
                </div>
                <DataTable
                  data={transactions}
                  onStatusChange={handleStatusChange}
                  onRequestDelete={(tx) => setDeletingTx(tx)}
                  userRole={userRole}
                />
              </div>
            </div>
          )}

          {/* ----------------- TAB 5: SETTINGS ----------------- */}
          {activeTab === 'Settings' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Profile & Current Role Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                      alt="Avatar"
                      className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">Budi Santoso</h4>
                      <p className="text-xs text-blue-400 font-semibold">{userRole} Account</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Terakhir login: Hari ini, 14:20 WIB</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" /> Username
                      </span>
                      <span className="text-white font-medium">budi_admin</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Mode Akses
                      </span>
                      <span className="text-emerald-400 font-semibold">{userRole}</span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Settings Forms */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" /> API Keys & Kredensial Sistem
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Kelola token akses API untuk integrasi aplikasi pihak ketiga.</p>

                    <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                      <div className="font-mono text-xs text-slate-300">
                        {userRole === 'Viewer' ? '••••••••••••••••••••••••' : 'pk_live_98a72b1c900d8376e1a49f50'}
                      </div>
                      <button
                        onClick={() => {
                          if (userRole === 'Viewer') {
                            showToast('Akses ditolak: Viewer tidak memiliki izin melihat API Key.', 'error');
                          } else {
                            showToast('API Key berhasil disalin ke clipboard!', 'success');
                          }
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition"
                      >
                        Salin Key
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                      <Bell className="w-4 h-4 text-amber-400" /> Preferensi Notifikasi
                    </h3>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Notifikasi Email untuk transaksi di atas $1,000', defaultChecked: true },
                        { label: 'Laporan mingguan dikirim setiap Senin', defaultChecked: true },
                        { label: 'Peringatan otomatis saat trafik naik melebihi 50%', defaultChecked: false },
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            defaultChecked={item.defaultChecked}
                            onChange={(e) =>
                              showToast(`Preferensi "${item.label}" ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info')
                            }
                            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
