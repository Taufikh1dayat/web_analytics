'use client';

import React from 'react';
import { Coffee, Sparkles, Heart, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { mockCoffeeProducts } from '@/lib/mock-data';

interface KelayuLandingViewProps {
  onGoToOrder: () => void;
}

export const KelayuLandingView: React.FC<KelayuLandingViewProps> = ({
  onGoToOrder,
}) => {
  return (
    <div className="space-y-12 animate-fadeIn text-slate-100">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-amber-900/40 p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Selamat Datang di Kelayu Coffee
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Mari nikmati secangkir <span className="text-amber-500">Kopi</span> Cita Rasa Asli Nusantara.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Kedai Kopi Kelayu menghadirkan aroma terbaik biji kopi Arabika lokal pilihan. Diolah dengan presisi oleh Barista berpengalaman untuk menemani setiap cerita harimu.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onGoToOrder}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl shadow-amber-600/30 transition transform hover:-translate-y-0.5"
            >
              <Coffee className="w-5 h-5" />
              <span>Beli Sekarang / Pesan Kasir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <div className="relative rounded-xl overflow-hidden h-72 bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800"
            alt="Tentang Kelayu Coffee"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Tentang</span> <span className="text-amber-500">Kedai Kopi Kelayu</span>
          </h2>

          <h3 className="text-base font-semibold text-slate-200">
            Cita Rasa Kopi Nusantara dalam Setiap Seduhan
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Kedai Kopi Kelayu lahir dari kecintaan kami terhadap kopi lokal Indonesia. Kami memetik biji kopi Arabika murni dari petani lokal pilihan, meroastingnya secara presisi, dan menyajikannya secara higienis oleh Barista berpengalaman untuk menghadirkan rasa hangat sejati dalam setiap cangkir.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-3">
            <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <Award className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">100% Kopi Nusantara</p>
                <p className="text-[10px] text-slate-400">Petani Lokal Pilihan</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Higienis & Segar</p>
                <p className="text-[10px] text-slate-400">Seduhan Barista Presisi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Menu Highlights */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-white">Menu Favorit Kelayu Coffee</h2>
            <p className="text-xs text-slate-400">Pilihan kopi terbaik paling diminati pelanggan</p>
          </div>
          <button
            onClick={onGoToOrder}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Lihat Semua Menu &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockCoffeeProducts.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4"
            >
              <div className="h-40 rounded-lg overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">{item.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-sm font-extrabold text-amber-400">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={onGoToOrder}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                >
                  Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
