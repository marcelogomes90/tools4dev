'use client';

import { ReactNode, useCallback, useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleDesktopSidebar = useCallback(
    () => setIsDesktopSidebarOpen((value) => !value),
    [],
  );
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((value) => !value),
    [],
  );

  return (
    <div className="relative min-h-screen lg:flex">
      <Sidebar
        isDesktopOpen={isDesktopSidebarOpen}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={closeMobileMenu}
        onNavigate={closeMobileMenu}
      />
      <div className="min-w-0 flex-1">
        <Topbar
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleDesktopSidebar={toggleDesktopSidebar}
          onToggleMobileMenu={toggleMobileMenu}
        />
        <main className="fade-in-up mx-auto max-w-[1400px] px-4 pb-8 pt-7 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
