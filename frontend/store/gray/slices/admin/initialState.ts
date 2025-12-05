// 灰度规则类型定义
export interface GrayRule {
  id: number;
  name: string;
  description?: string;
  is_enabled: boolean;
  priority: number;
  match_type: string;
  match_key?: string;
  match_values: string[];
  target_version: string;
  target_upstream?: string;
  created_at: string;
  updated_at: string;
}

// 创建规则请求体
export interface CreateRulePayload {
  name: string;
  description?: string;
  is_enabled?: boolean;
  priority?: number;
  match_type?: string;
  match_key?: string;
  match_values?: string[];
  target_version?: string;
  target_upstream?: string;
}

// 白名单类型定义
export interface Whitelist {
  id: number;
  rule_id: number;
  value: string;
  value_type: string;
  remark?: string;
  is_enabled: boolean;
  created_at: string;
}

export interface GrayAdminState {
  // 规则列表
  rules: GrayRule[];

  // 当前选中的规则（用于白名单管理）
  currentRule: GrayRule | null;
}

export const initialState: GrayAdminState = {
  rules: [],
  currentRule: null,
};
