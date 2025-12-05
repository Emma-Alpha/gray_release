import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
  isDark: () => boolean;
}

export const useThemeStore = create<ThemeStore, [['zustand/persist', unknown]]>(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: theme => set({ theme }),
      isDark: () => get().theme === 'dark',
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export default useThemeStore;
