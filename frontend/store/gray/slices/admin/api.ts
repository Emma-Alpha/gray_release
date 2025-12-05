import request from "@config/request";
import type { GrayRule, CreateRulePayload } from "./initialState";

/**
 * 获取规则列表
 */
export function apiGetRules(params?: { is_enabled?: boolean }) {
  return request.get<GrayRule[]>(`/admin/rules`, params);
}

/**
 * 获取单个规则详情
 */
export function apiGetRule(id: number) {
  return request.get<GrayRule>(`/admin/rules/${id}`);
}

/**
 * 创建规则
 */
export function apiCreateRule(data: CreateRulePayload) {
  return request.post<GrayRule>(`/admin/rules`, data);
}

/**
 * 更新规则
 */
export function apiUpdateRule(id: number, data: Partial<CreateRulePayload>) {
  return request.put<GrayRule>(`/admin/rules/${id}`, data);
}

/**
 * 删除规则
 */
export function apiDeleteRule(id: number) {
  return request.delete(`/admin/rules/${id}`);
}

/**
 * 切换规则启用状态
 */
export function apiToggleRule(id: number) {
  return request.patch(`/admin/rules/${id}/toggle`);
}
