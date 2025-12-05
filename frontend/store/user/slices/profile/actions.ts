import type { StateCreator } from 'zustand/vanilla';

import type { UserStore } from '../../store';
import { apiGetV1GatewayProfile } from './api';

export interface UserProfileAction {
  getUserProfile: () => Promise<void>;
}

export const createProfileSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  UserProfileAction
> = (set, get) => ({
  getUserProfile: async () => {
    const { data } = await apiGetV1GatewayProfile();
    set({ user: data });
  },
});
