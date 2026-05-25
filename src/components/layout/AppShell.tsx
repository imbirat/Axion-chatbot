'use client';
import { Sidebar } from './Sidebar';
import { useSettingsStore } from '@/store/settingsStore';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useSettingsStore();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-base">
        <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-bg-base text-text-primary overflow-hidden">
      <Sidebar />
      <main
        className="flex-1 flex flex-col transition-all duration-220 ease-out"
        style={{ marginLeft: sidebarCollapsed ? 56 : 260 }}
      >
        {children}
      </main>
    </div>
  );
}
