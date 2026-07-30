'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'Overview',
  setActiveTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Reports', icon: FileText },
    { name: 'Customers', icon: Users },
    { name: 'Settings', icon: Settings },
  ];

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
          className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40"
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
            alt="TaufikDev Logo"
            className="w-9 h-9 rounded-xl object-cover border border-blue-500/40 shadow-lg shadow-blue-500/20"
          />
          <div>
            <h1 className="font-bold text-white text-base tracking-wide">
              TaufikDev<span className="text-blue-400">Analytics</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Enterprise Dashboard
            </p>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleSelect(item.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
              </button>
            );
          })}
        </nav>

        {/* User / Upgrade Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-600"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Budi Santoso
              </p>
              <p className="text-xs text-slate-400 truncate">Admin Lead</p>
            </div>
            <button
              className="text-slate-400 hover:text-rose-400 p-1 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
