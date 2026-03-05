'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen lg:flex">
      <Sidebar
        isDesktopOpen={isDesktopSidebarOpen}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onNavigate={() => setIsMobileMenuOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <Topbar
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleDesktopSidebar={() =>
            setIsDesktopSidebarOpen((value) => !value)
          }
          onToggleMobileMenu={() => setIsMobileMenuOpen((value) => !value)}
        />
        <main className="fade-in-up mx-auto max-w-[1400px] px-4 pb-8 pt-7 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
