import {
  type UserProfileState,
  initialState as initialProfileState,
} from './slices/profile/initialState';
import {
  type UserSettingsState,
  initialState as initialSettingsState,
} from './slices/settings/initialState';

export type UserState = UserProfileState & UserSettingsState;

export const initialState: UserState = {
  ...initialProfileState,
  ...initialSettingsState,
};
