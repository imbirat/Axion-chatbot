'use client';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

function ThemeWatcher() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeWatcher />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#fcf9f8',
              color: '#1b1c1b',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
