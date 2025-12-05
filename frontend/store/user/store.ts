import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type UserState, initialState } from './initialState';

import {
  type UserProfileAction,
  createProfileSlice,
} from './slices/profile/actions';
import {
  type UserSettingsAction,
  createSettingsSlice,
} from './slices/settings/actions';

//  ===============  聚合 createStoreFn ============ //

export type UserStore = UserState & UserProfileAction & UserSettingsAction;

const createStore: StateCreator<UserStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...createProfileSlice(...parameters),
  ...createSettingsSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('user');

export const useUserStore = createWithEqualityFn<UserStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);

export const getUserStoreState = () => useUserStore.getState();
