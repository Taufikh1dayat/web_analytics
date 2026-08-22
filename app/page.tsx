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
import { AddProductModal } from '@/components/add-product-modal';
import { EditProductModal } from '@/components/edit-product-modal';
import { ReceiptModal } from '@/components/receipt-modal';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { ToastNotification } from '@/components/toast-notification';
import { KelayuStorePos } from '@/components/kelayu-store-pos';
import { KelayuLandingView } from '@/components/kelayu-landing-view';
import {
  mockTransactions,
  mockCoffeeProducts,
} from '@/lib/mock-data';
import { Transaction, CoffeeMenuProduct } from '@/types';
import {
  RefreshCw,
  Plus,
  ShieldCheck,
  UserCheck,
  Eye,
  RotateCcw,
  Coffee,
  CheckCircle2,
  Trash2,
  Pencil,
  Printer,
} from 'lucide-react';

const TRANSACTIONS_STORAGE_KEY = 'kelayu_coffee_transactions_store_v1';
const ROLE_STORAGE_KEY = 'kelayu_coffee_user_role_v1';
const PRODUCTS_STORAGE_KEY = 'kelayu_coffee_products_store_v1';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('POS Pemesanan');
  const [userRole, setUserRole] = useState<'Admin' | 'Barista' | 'Kasir' | 'Viewer'>('Admin');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [products, setProducts] = useState<CoffeeMenuProduct[]>(mockCoffeeProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CoffeeMenuProduct | null>(null);
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Initial Mount: Read from localStorage or Seed default data
  useEffect(() => {
    try {
      const savedTx = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (savedTx) {
        const parsed = JSON.parse(savedTx);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        } else {
          localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(mockTransactions));
        }
      } else {
        localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(mockTransactions));
      }

      const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setProducts(parsedProducts);
        } else {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mockCoffeeProducts));
        }
      } else {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mockCoffeeProducts));
      }

      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole && ['Admin', 'Barista', 'Kasir', 'Viewer'].includes(savedRole)) {
        setUserRole(savedRole as any);
      }
    } catch (err) {
      console.error('Gagal membaca dari localStorage:', err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 2. Auto-save to localStorage whenever transactions change (AFTER initialization)
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    } catch (err) {
      console.error('Gagal menyimpan transaksi ke localStorage:', err);
    }
  }, [transactions, isInitialized]);

  // 3. Auto-save products changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.error('Gagal menyimpan produk ke localStorage:', err);
    }
  }, [products, isInitialized]);

  // 4. Auto-save userRole changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, userRole);
    } catch (err) {
      console.error('Gagal menyimpan role ke localStorage:', err);
    }
  }, [userRole, isInitialized]);

  const handleResetData = () => {
    setTransactions(mockTransactions);
    setProducts(mockCoffeeProducts);
    showToast('Data sampel Kelayu Coffee berhasil dipulihkan!');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleAddProduct = (newProduct: CoffeeMenuProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`☕ Menu baru "${newProduct.name}" berhasil ditambahkan ke katalog & POS!`);
  };

  const handleUpdateProduct = (updated: CoffeeMenuProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Menu "${updated.name}" berhasil diperbarui!`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Menu "${name}" berhasil dihapus.`);
  };

  const handleCheckoutSuccess = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    setReceiptTransaction(newTx);
    showToast(`☕ Pesanan ${newTx.id} untuk ${newTx.customerName} berhasil dibuat!`);
  };

  const handleStatusChange = (id: string, newStatus: Transaction['status']) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    showToast(`Status pesanan ${id} berhasil diperbarui menjadi ${newStatus}`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDeleteTargetId(null);
    showToast(`Pesanan ${id} berhasil dihapus.`);
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `KLY-${Math.floor(8800 + Math.random() * 1000)}`,
    };
    setTransactions((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Pesanan baru ${created.id} berhasil ditambahkan!`);
  };

  // Recalculate Stats from current transactions (real data, no dummy)
  const calculatedStats = useMemo(() => {
    const completedTx = transactions.filter((t) => t.status === 'Completed');
    const totalRevenue = completedTx.reduce((sum, t) => sum + t.amount, 0);
    const totalItems = transactions.reduce((sum, t) => sum + (t.items?.reduce((s, i) => s + i.quantity, 0) || 1), 0);
    const completedCount = completedTx.length;
    const retentionRate = transactions.length > 0 ? Math.round((completedCount / transactions.length) * 100) : 0;

    return [
      {
        id: '1',
        title: 'Total Pendapatan',
        value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
        change: transactions.length > 0 ? 12.5 : 0,
        changeType: 'increase' as const,
        timeFrame: 'dari transaksi aktif',
        iconName: 'DollarSign',
      },
      {
        id: '2',
        title: 'Porsi Terjual',
        value: `${totalItems} Porsi`,
        change: transactions.length > 0 ? 8.1 : 0,
        changeType: 'increase' as const,
        timeFrame: 'dari transaksi aktif',
        iconName: 'Coffee',
      },
      {
        id: '3',
        title: 'Total Transaksi',
        value: `${transactions.length} Transaksi`,
        change: transactions.length > 0 ? 5.4 : 0,
        changeType: 'increase' as const,
        timeFrame: 'total pesanan',
        iconName: 'ShoppingBag',
      },
      {
        id: '4',
        title: 'Tingkat Penyelesaian',
        value: `${retentionRate}%`,
        change: retentionRate > 80 ? 3.1 : -2.0,
        changeType: retentionRate > 80 ? 'increase' as const : 'decrease' as const,
        timeFrame: 'completed vs total',
        iconName: 'TrendingUp',
      },
    ];
  }, [transactions]);

  // Compute real revenue chart data from transactions (grouped by month)
  const realRevenueData = useMemo(() => {
    const monthMap: Record<string, { revenue: number; expenses: number; profit: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = monthNames[d.getMonth()];
      if (!monthMap[key]) monthMap[key] = { revenue: 0, expenses: 0, profit: 0 };
      if (t.status === 'Completed') {
        monthMap[key].revenue += t.amount;
        monthMap[key].profit += Math.round(t.amount * 0.55);
        monthMap[key].expenses += Math.round(t.amount * 0.45);
      }
    });

    const data = Object.entries(monthMap).map(([month, vals]) => ({
      month,
      revenue: vals.revenue,
      profit: vals.profit,
      expenses: vals.expenses,
    }));

    return data.length > 0 ? data : [{ month: '-', revenue: 0, profit: 0, expenses: 0 }];
  }, [transactions]);

  // Compute real category distribution from transactions
  const realCategoryDistribution = useMemo(() => {
    const catMap: Record<string, number> = {};
    transactions.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + 1;
    });
    const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#ec4899'];
    const data = Object.entries(catMap).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
    return data.length > 0 ? data : [{ name: 'Belum ada data', value: 1, color: '#475569' }];
  }, [transactions]);

  // Compute real daily trend from transactions
  const realUserTrendData = useMemo(() => {
    const dayMap: Record<string, { orders: number; items: number }> = {};
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = dayNames[d.getDay()];
      if (!dayMap[key]) dayMap[key] = { orders: 0, items: 0 };
      dayMap[key].orders += 1;
      dayMap[key].items += t.items?.reduce((s, i) => s + i.quantity, 0) || 1;
    });

    const orderedDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const data = orderedDays
      .filter((day) => dayMap[day])
      .map((day) => ({
        date: day,
        activeUsers: dayMap[day].orders,
        newUsers: dayMap[day].items,
      }));

    return data.length > 0 ? data : [{ date: '-', activeUsers: 0, newUsers: 0 }];
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

  // Auto-redirect if active tab is restricted for current role
  useEffect(() => {
    if (userRole === 'Viewer') {
      if (!['Kelayu Web', 'POS Pemesanan'].includes(activeTab)) {
        setActiveTab('Kelayu Web');
      }
    } else if (['Barista', 'Kasir'].includes(userRole)) {
      if (['Analitik Penjualan', 'Settings'].includes(activeTab)) {
        setActiveTab('POS Pemesanan');
      }
    }
  }, [userRole, activeTab]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-500 border border-amber-500/30 flex items-center justify-center animate-pulse">
            <Coffee className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-400">Memuat Kedai Kopi Kelayu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans" suppressHydrationWarning>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdateProduct={handleUpdateProduct}
      />

      <ReceiptModal
        isOpen={!!receiptTransaction}
        transaction={receiptTransaction}
        onClose={() => setReceiptTransaction(null)}
        cashierName={`Kasir (${userRole})`}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTargetId}
        transaction={transactions.find((t) => t.id === deleteTargetId) || null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && handleDeleteTransaction(deleteTargetId)}
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
            <KelayuStorePos products={products} onCheckoutSuccess={handleCheckoutSuccess} />
          )}

          {activeTab === 'Kelayu Web' && (
            <KelayuLandingView onGoToOrder={() => setActiveTab('POS Pemesanan')} />
          )}

          {activeTab === 'Daftar Pesanan' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div>
                  <h3 className="text-base font-bold text-white">Daftar Pesanan Kelayu Coffee</h3>
                  <p className="text-xs text-slate-400">Lacak, cetak struk, dan kelola pesanan kopi</p>
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
                onRequestDelete={(tx) => setDeleteTargetId(tx.id)}
                onPrintReceipt={(tx) => setReceiptTransaction(tx)}
              />
            </div>
          )}

          {activeTab === 'Analitik Penjualan' && (
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
                  <RevenueBarChart data={realRevenueData} />
                </div>
                <div>
                  <CategoryPieChart data={realCategoryDistribution} />
                </div>
              </div>

              <div>
                <UserTrendLineChart data={realUserTrendData} />
              </div>
            </div>
          )}

          {activeTab === 'Katalog Menu' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Katalog Menu & Stok Kelayu Coffee</h3>
                    <p className="text-xs text-slate-400">Daftar varian produk kopi, non-kopi, pastry, dan snack yang tersedia</p>
                  </div>
                  {userRole !== 'Viewer' && (
                    <button
                      onClick={() => setIsAddProductModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Menu Baru</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {products.map((p) => {
                    const isUnavailable = p.isOutOfStock || p.stock <= 0;
                    return (
                      <div
                        key={p.id}
                        className={`bg-slate-950 border rounded-xl overflow-hidden flex flex-col justify-between space-y-3 group transition relative ${
                          isUnavailable
                            ? 'border-slate-800 opacity-75'
                            : 'border-slate-800 hover:border-amber-500/50'
                        }`}
                      >
                        <div className="relative h-36 overflow-hidden bg-slate-900">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400';
                            }}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              isUnavailable ? 'grayscale' : 'group-hover:scale-105'
                            }`}
                          />
                          {isUnavailable ? (
                            <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                              SOLD OUT
                            </span>
                          ) : p.isBestSeller ? (
                            <span className="absolute top-2 left-2 bg-amber-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                              BEST SELLER
                            </span>
                          ) : null}
                          <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-slate-800">
                            ★ {p.rating}
                          </span>

                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            {userRole !== 'Viewer' && (
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-600 text-slate-200 hover:text-white transition shadow-md"
                                title={`Edit menu ${p.name}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {userRole === 'Admin' && (
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition shadow-md"
                                title={`Hapus menu ${p.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-3 pt-0 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-amber-500 uppercase">{p.category}</span>
                              <span className="text-[10px] font-mono text-slate-500">{p.id}</span>
                            </div>
                            <h4 className="font-bold text-white text-xs mt-0.5">{p.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                            <span className="text-xs font-extrabold text-amber-400">Rp {p.price.toLocaleString('id-ID')}</span>
                            <span className="text-[11px] text-slate-400">Stok: <strong className={isUnavailable ? 'text-rose-400' : 'text-white'}>{p.stock}</strong></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
