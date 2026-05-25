import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  enterToSend: boolean;
  
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setFontSize: (size: 'sm' | 'base' | 'lg') => void;
  setEnterToSend: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      fontSize: 'base',
      enterToSend: true,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setFontSize: (fontSize) => set({ fontSize }),
      setEnterToSend: (enterToSend) => set({ enterToSend }),
    }),
    { name: 'axion-settings' }
  )
);
