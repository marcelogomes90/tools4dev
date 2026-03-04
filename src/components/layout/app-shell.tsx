'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="min-w-0 flex-1">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
        />
        <main className="mx-auto max-w-[1400px] px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
