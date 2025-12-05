import request from '@config/request';

export function apiGetV1GatewayProfile(params?: Record<string, any>) {
  return request.get('/v1/gateway/profile', params);
}
