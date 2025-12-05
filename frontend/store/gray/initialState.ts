import {
  type GrayAdminState,
  initialState as initialAdminState,
} from "./slices/admin/initialState";

import {
  type GrayWhiteState,
  initialState as initialWhiteState,
} from "./slices/white/initialState";

export type GrayState = GrayAdminState & GrayWhiteState;

export const initialState: GrayState = {
  ...initialAdminState,
  ...initialWhiteState,
};
