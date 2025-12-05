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

// 创建白名单请求体
export interface CreateWhitelistPayload {
  rule_id: number;
  value: string;
  value_type?: string;
  remark?: string;
  is_enabled?: boolean;
}

// 批量添加白名单响应
export interface BatchAddWhitelistResponse {
  added: number;
  skipped: number;
}

export interface GrayWhiteState {
  // 白名单列表
  whitelist: Whitelist[];
}

export const initialState: GrayWhiteState = {
  whitelist: [],
};
