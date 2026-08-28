'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  Users,
  Flag,
  Megaphone,
  History,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/users', label: 'Users & Roles', icon: Users },
    { href: '/admin/moderation', label: 'Moderation & Reports', icon: Flag },
    { href: '/admin/ads', label: 'Advertisements', icon: Megaphone },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: History },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-sm font-semibold animate-pulse">Verifying administrative access...</p>
      </div>
    );
  }

  // Authorization Check
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-dark-text">403 — Access Denied</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-md">
            This area is restricted to GUKGIC Administrators and Content Moderators. Normal user accounts cannot access this console.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to User App</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-base text-white tracking-tight flex items-center gap-2">
              GUKGIC <span className="text-[10px] uppercase font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30">Control Center</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Signed in as:</span>
            <span className="font-bold text-slate-200">{user.name}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary-900/60 text-primary-300 border border-primary-700 uppercase">
              {user.role}
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>User App</span>
          </Link>
        </div>
      </header>

      {/* Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1 select-none">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Management</p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all',
                  isActive
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Admin Main Content View */}
        <main className="lg:col-span-9 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
