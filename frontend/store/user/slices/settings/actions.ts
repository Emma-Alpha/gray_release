import type { StateCreator } from "zustand/vanilla";

import type { UserStore } from "../../store";
import type { AnimationMode, ThemeMode } from "./initialState";

export interface UserSettingsAction {
  setAnimationMode: (animationMode: AnimationMode) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
}

export const createSettingsSlice: StateCreator<
  UserStore,
  [["zustand/devtools", never]],
  [],
  UserSettingsAction
> = (set, get) => ({
  setAnimationMode: (animationMode: AnimationMode) => {
    set({ animationMode });
  },
  setThemeMode: (themeMode: ThemeMode) => {
    set({ themeMode });
  },
});
