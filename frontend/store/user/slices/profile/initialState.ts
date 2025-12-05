import type { User } from '@/types/user';

export interface UserProfileState {
  user?: User;
}

export const initialState: UserProfileState = {
  user: {
    id: 0,
    name: '',
    cname: '',
    staffId: '',
  },
};
