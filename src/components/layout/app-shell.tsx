'use client';

import React, { useState } from 'react';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { DesktopSidebar } from './desktop-sidebar';
import { SearchModal } from './search-modal';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-dark-text transition-colors duration-200">
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 py-4 md:py-6 flex gap-6">
        <DesktopSidebar />
        <div className="flex-1 min-w-0 pb-20 md:pb-8">
          {children}
        </div>
      </main>

      <MobileNav />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
