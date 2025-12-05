import type { StateCreator } from "zustand/vanilla";
import type { GrayStore } from "../../store";
import {
  apiGetWhitelist,
  apiBatchAddWhitelist,
  apiDeleteWhitelist,
  apiToggleWhitelist,
} from "./api";

export interface GrayWhiteAction {
  loadWhitelist: (ruleId: number) => Promise<void>;
  batchAddWhitelist: (
    ruleId: number,
    values: string[],
    valueType?: string
  ) => Promise<{ added: number; skipped: number }>;
  deleteWhitelist: (id: number) => Promise<void>;
  toggleWhitelist: (id: number) => Promise<void>;
}

export const createGrayWhiteSlice: StateCreator<
  GrayStore,
  [["zustand/devtools", never]],
  [],
  GrayWhiteAction
> = (set, get) => ({
  // 加载白名单
  loadWhitelist: async (ruleId: number) => {
    const res = await apiGetWhitelist(ruleId);
    set({ whitelist: res.data || [] });
  },

  // 批量添加白名单
  batchAddWhitelist: async (
    ruleId: number,
    values: string[],
    valueType: string = "user_id"
  ) => {
    const res = await apiBatchAddWhitelist(ruleId, values, valueType);
    await get().loadWhitelist(ruleId);
    return res.data;
  },

  // 删除白名单
  deleteWhitelist: async (id: number) => {
    await apiDeleteWhitelist(id);
    const { currentRule } = get();
    if (currentRule) {
      await get().loadWhitelist(currentRule.id);
    }
  },

  // 切换白名单状态
  toggleWhitelist: async (id: number) => {
    await apiToggleWhitelist(id);
    const { currentRule } = get();
    if (currentRule) {
      await get().loadWhitelist(currentRule.id);
    }
  },
});
