import type { StateCreator } from "zustand/vanilla";
import type { GrayStore } from "../../store";
import {
  apiGetRules,
  apiCreateRule,
  apiUpdateRule,
  apiDeleteRule,
  apiToggleRule,
} from "./api";
import type { CreateRulePayload, GrayRule } from "./initialState";

export interface GrayAdminAction {
  loadRules: () => Promise<void>;
  createRule: (data: CreateRulePayload) => Promise<GrayRule>;
  updateRule: (id: number, data: Partial<CreateRulePayload>) => Promise<void>;
  deleteRule: (id: number) => Promise<void>;
  toggleRule: (id: number) => Promise<void>;
  setCurrentRule: (rule: GrayRule | null) => void;
}

export const createGrayAdminSlice: StateCreator<
  GrayStore,
  [["zustand/devtools", never]],
  [],
  GrayAdminAction
> = (set, get) => ({
  // 加载规则列表
  loadRules: async () => {
    const res = await apiGetRules();
    set({ rules: res.data || [] });
  },

  // 创建规则
  createRule: async (data: CreateRulePayload) => {
    const res = await apiCreateRule(data);
    await get().loadRules();
    return res.data;
  },

  // 更新规则
  updateRule: async (id: number, data: Partial<CreateRulePayload>) => {
    await apiUpdateRule(id, data);
    await get().loadRules();
  },

  // 删除规则
  deleteRule: async (id: number) => {
    await apiDeleteRule(id);
    await get().loadRules();
  },

  // 切换规则状态
  toggleRule: async (id: number) => {
    await apiToggleRule(id);
    await get().loadRules();
  },

  // 设置当前规则
  setCurrentRule: (rule: GrayRule | null) => {
    set({ currentRule: rule });
  },
});
