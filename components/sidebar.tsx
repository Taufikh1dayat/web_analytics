'use client';

import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  FileText,
  Users,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'POS Pemesanan',
  setActiveTab,
  userRole = 'Admin',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const allNavItems = [
    { name: 'Kelayu Web', icon: Coffee, roles: ['Admin', 'Barista', 'Kasir', 'Viewer'] },
    { name: 'POS Pemesanan', icon: ShoppingBag, roles: ['Admin', 'Barista', 'Kasir', 'Viewer'] },
    { name: 'Daftar Pesanan', icon: FileText, roles: ['Admin', 'Barista', 'Kasir'] },
    { name: 'Katalog Menu', icon: Users, roles: ['Admin', 'Barista', 'Kasir'] },
    { name: 'Analitik Penjualan', icon: LayoutDashboard, roles: ['Admin'] },
    { name: 'Settings', icon: Settings, roles: ['Admin'] },
  ];

  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const handleSelect = (name: string) => {
    if (setActiveTab) setActiveTab(name);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shadow-md text-slate-200 hover:bg-slate-800 transition"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
          <img
            src="/taufik_dev_logo.jpg"
            alt="Kelayu Coffee Logo"
            className="w-9 h-9 rounded-xl object-cover border border-amber-500/40 shadow-lg shadow-amber-500/20"
          />
          <div>
            <h1 className="font-bold text-white text-base tracking-wide flex items-center gap-1">
              Kelayu<span className="text-amber-500">Coffee</span>
            </h1>
            <p className="text-[10px] text-amber-400/80 tracking-wider uppercase font-semibold">
              POS & POS Analytics
            </p>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu Kedai Kopi
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleSelect(item.name)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer profile info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400">
              {userRole.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden text-xs">
              <p className="font-semibold text-slate-200 truncate">Role: <span className="text-amber-400 font-bold">{userRole}</span></p>
              <p className="text-[10px] text-slate-400 truncate">Kelayu Coffee Outlet 01</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
