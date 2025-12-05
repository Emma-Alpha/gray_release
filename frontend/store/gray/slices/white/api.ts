import request from "@config/request";
import type {
  Whitelist,
  CreateWhitelistPayload,
  BatchAddWhitelistResponse,
} from "./initialState";

// ==================== 白名单 API ====================

/**
 * 获取规则的白名单列表
 */
export function apiGetWhitelist(ruleId: number) {
  return request.get<Whitelist[]>(`/admin/rules/${ruleId}/whitelist`);
}

/**
 * 添加白名单条目
 */
export function apiAddWhitelist(data: CreateWhitelistPayload) {
  return request.post<Whitelist>(`/admin/whitelist`, data);
}

/**
 * 批量添加白名单
 */
export function apiBatchAddWhitelist(
  ruleId: number,
  values: string[],
  valueType: string = "user_id"
) {
  return request.post<BatchAddWhitelistResponse>(
    `/admin/whitelist/batch`,
    null,
    {
      params: { rule_id: ruleId, value_type: valueType, values },
    }
  );
}

/**
 * 删除白名单条目
 */
export function apiDeleteWhitelist(id: number) {
  return request.delete(`/admin/whitelist/${id}`);
}

/**
 * 切换白名单启用状态
 */
export function apiToggleWhitelist(id: number) {
  return request.patch(`/admin/whitelist/${id}/toggle`);
}
