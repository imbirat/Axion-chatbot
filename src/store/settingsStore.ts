import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  enterToSend: boolean;
  customInstructions: string;
  customInstructionsEnabled: boolean;

  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setFontSize: (size: 'sm' | 'base' | 'lg') => void;
  setEnterToSend: (value: boolean) => void;
  setCustomInstructions: (value: string) => void;
  setCustomInstructionsEnabled: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      fontSize: 'base',
      enterToSend: true,
      customInstructions: '',
      customInstructionsEnabled: true,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
      toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      setFontSize: (fontSize) => set({ fontSize }),
      setEnterToSend: (enterToSend) => set({ enterToSend }),
      setCustomInstructions: (customInstructions) => set({ customInstructions }),
      setCustomInstructionsEnabled: (customInstructionsEnabled) => set({ customInstructionsEnabled }),
    }),
    { name: 'axion-settings' }
  )
);
