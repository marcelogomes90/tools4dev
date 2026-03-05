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
    <div className="min-h-screen lg:flex">
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
        <main className="mx-auto max-w-[1400px] px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
