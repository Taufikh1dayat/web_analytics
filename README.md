# ☕ Kedai Kopi Kelayu — POS & Order Analytics System

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Recharts](https://img.shields.io/badge/Recharts-2.15-22b5bf?style=for-the-badge)

Sistem **Point of Sale (POS)**, Pemesanan Kopi QRIS/Tunai, dan **Analitik Penjualan Terpadu** berbasis web modern untuk **Kedai Kopi Kelayu**.

---

## 🌟 Fitur Utama

1. 🛍️ **POS & Pemesanan Kopi Interaktif**
   - Katalog produk khas Kedai Kopi Kelayu (*Iced Coffee Kelayu Special*, *Espresso*, *Caramel Macchiato*, *Cold Brew*, *Matcha*, *Butter Croissant*).
   - Opsi varian sajian (*Ice/Hot*, *Sugar Level 0-100%*, *Extra Shot*).
   - Keranjang Belanja (*Shopping Cart*) & Kalkulasi Subtotal otomatis.

2. 💳 **Integrasi Pembayaran QRIS & Tunai (Cash)**
   - **QRIS Payment Modal**: Menampilkan kode QRIS editan `qris.jpeg` secara utuh dengan konfirmasi pembayaran *"🟢 Sudah Bayar"* / *"🔴 Belum Bayar"*.
   - **Cash Payment Direct**: Pembayaran Tunai langsung menyelesaikan pesanan tanpa pop-up tambahan.

3. 📊 **Analitik Penjualan Real-Time (Dashboard)**
   - Perhitungan otomatis Omset Pendapatan, Cangkir Kopi Terjual, dan Jumlah Transaksi.
   - **Recharts Bar Chart**: Pendapatan vs Pengeluaran per bulan.
   - **Recharts Line Chart**: Tren pertumbuhan pelanggan aktif.
   - **Recharts Pie Chart**: Distribusi kategori menu paling laris.

4. 📋 **Manajemen Pesanan Barista (TanStack Table)**
   - Tabel transaksi interaktif dengan filter pencarian real-time, sorting kolom, dan pagination.
   - Pengubah status pesanan Barista (*Pending* ➔ *Processing* ➔ *Completed* ➔ *Failed*).

5. 💾 **Penyimpanan Persisten LocalStorage**
   - Seluruh pesanan baru dan perubahan status tersimpan permanen di memori browser.

6. 👥 **Multi-Role User Access**
   - Simulasi peran pengakses: `Admin`, `Barista`, `Kasir`, dan `Viewer`.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** Next.js 16 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS (Dark Mode & Glassmorphism)
- **Visualisasi Data:** Recharts
- **Tabel Data:** TanStack Table v8
- **Icon Set:** Lucide React

---

## 🚀 Panduan Memulai (Local Setup)

1. **Clone Repository:**
   ```bash
   git clone https://github.com/Taufikh1dayat/web_analytics.git
   cd web_analytics
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

4. **Buka Aplikasi:**
   Buka [http://localhost:3000](http://localhost:3000) pada browser kamu.

---

## 📜 Tentang Kedai Kopi Kelayu

**Kedai Kopi Kelayu** menyajikan cita rasa autentik biji kopi Arabika Nusantara murni. Diolah secara higienis oleh Barista berpengalaman untuk memberikan pengalaman minum kopi terbaik bagi setiap pelanggan.

Powered by **TaufikDevAnalytics**.
