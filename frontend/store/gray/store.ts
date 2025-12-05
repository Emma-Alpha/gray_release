import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { StateCreator } from "zustand/vanilla";

import { createDevtools } from "../middleware/createDevtools";
import { type GrayState, initialState } from "./initialState";

import {
  type GrayAdminAction,
  createGrayAdminSlice,
} from "./slices/admin/actions";
import {
  type GrayWhiteAction,
  createGrayWhiteSlice,
} from "./slices/white/actions";

//  ===============  聚合 createStoreFn ============ //

export type GrayStore = GrayState & GrayAdminAction & GrayWhiteAction;

const createStore: StateCreator<GrayStore, [["zustand/devtools", never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...createGrayAdminSlice(...parameters),
  ...createGrayWhiteSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools("gray");

export const useGrayStore = createWithEqualityFn<GrayStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);

export const getGrayStoreState = () => useGrayStore.getState();
