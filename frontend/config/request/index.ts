import { sentryContext, sentryError, sentryPerformance } from "@/utils/sentry";
import jwt from "@config/jwt";
import { notification } from "antd";
// index.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

type Result<T> = {
  code: number;
  message: string;
  data: T;
  suppressErrorNotification?: boolean;
};

const baseURL = process.env.API_PREFIX;
const timeout = process.env.API_TIMEOUT;
const accessTokenKey = process.env.COOKIE_NAME;

let flag = false; // 设置开关，保证一次只能请求一次刷新token,防止客户端多次操作，多次请求
let subSequest: any[] = [];

// 把过期请求添加在数组中
function addRequest(request: () => any) {
  subSequest.push(request);
}

// 重新调用过期请求列表
function retryRequest() {
  subSequest.forEach((request) => {
    request();
  });
  subSequest = [];
}

function getRefreshToken(token: string) {
  return fetch(`${baseURL}/dns/auth/login/token/refresh`, {
    headers: {
      authorization: token,
    },
  });
}

function redirectToLogin() {
  // 记录当前的url，并且实现跳转
  if (window.location.pathname === "/login") {
    return;
  }
  jwt.clearAccessToken(accessTokenKey as string);
  jwt.clearAccessToken("refresh_token");
  const href = encodeURIComponent(window.location.href);
  window.location.href = `${window.location.origin}/login?redirect=${href}`;
}

// 刷新token
function refreshToken() {
  if (!flag) {
    flag = true;
    // 获取刷新token
    const r_tk = jwt.getAccessToken("refresh_token");
    if (r_tk) {
      // 判断刷新token是否过期
      getRefreshToken(r_tk)
        .then((v) => v.json())
        .then((v) => {
          flag = false;
          if (!v?.data?.accessToken) {
            redirectToLogin();
            return;
          }
          jwt.setAccessToken({
            token_type: v.data?.tokenType ?? "JWT",
            access_token: v.data?.accessToken,
            expires_at: v.data?.expires_at * 1000,
          });
          // 重新发送请求
          retryRequest();
        })
        .catch(() => {
          redirectToLogin();
        });
    } else {
      redirectToLogin();
    }
  }
}

export function paramsSerializer(params) {
  const result = {};
  Object.keys(params).forEach((p) => {
    const value = params[p];
    if (Array.isArray(value)) {
      result[p] = value;
    } else if (value === null || value === undefined) {
      result[p] = value;
    } else if (typeof value === "object") {
      result[p] = JSON.stringify(value);
    } else {
      result[p] = value;
    }
  });
  return qs.stringify(result, { arrayFormat: "repeat", skipNulls: true });
}

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  private instance: AxiosInstance;
  // 基础配置，url和超时时间
  private baseConfig: AxiosRequestConfig = {
    baseURL: baseURL,
    timeout: Number(timeout),
    withCredentials: true,
  };

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config: any) => {
        // 性能监控开始时间
        config.metadata = { startTime: performance.now() };

        // 添加面包屑
        sentryPerformance.addBreadcrumb(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`,
          "http",
          "info"
        );

        // 一般会请求拦截里面加token，用于后端的验证
        config.headers = config.headers || {};
        config.headers.Authorization =
          jwt.getAccessToken(accessTokenKey as string) || "";
        return config;
      },
      (err: any) => {
        sentryError.captureException(err, { context: "request_interceptor" });
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 计算API请求时间
        const endTime = performance.now();
        const startTime = (res.config as any).metadata?.startTime || endTime;
        const duration = endTime - startTime;

        // 使用新的 span API 记录性能
        sentryPerformance.withSpan(
          `HTTP ${res.config.method?.toUpperCase()} ${res.config.url}`,
          "http.client",
          () => {
            // 在 span 中记录相关信息
            sentryContext.setExtra("http.status_code", res.status);
            sentryContext.setExtra("http.duration", duration);
            sentryContext.setExtra("http.url", res.config.url);
          }
        );

        // 发送性能数据
        this.sendApiPerformanceData({
          url: res.config.url || "",
          method: res.config.method || "GET",
          status: res.status,
          duration,
          success: true,
        });

        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        const { data } = res;

        const { code, message } = data;
        // 从请求配置中获取 suppressErrorNotification
        const { suppressErrorNotification = false } = res.config as any;

        if (code === 1) {
          if (!suppressErrorNotification) {
            notification.error({
              message: message || "未知错误",
            });
          }
          return Promise.reject(data);
        }
        if (code === 999) {
          if (!suppressErrorNotification) {
            notification.error({
              message: message || "登录过期, 请重新登录",
            });
          }
          redirectToLogin();
          return Promise.reject(data);
        }
        if (code !== 0) {
          if (!suppressErrorNotification) {
            notification.error({
              message: message || "未定义错误",
            });
          }
          return Promise.reject(data);
        }
        if (code === 0 && !!message) {
          notification.success({
            message,
          });
        }
        return res.data;
      },
      (err: any) => {
        // 计算错误请求时间
        const endTime = performance.now();
        const startTime = err.config?.metadata?.startTime || endTime;
        const duration = endTime - startTime;

        // Sentry 错误报告
        sentryError.captureException(err, {
          url: err.config?.url,
          method: err.config?.method,
          status: err.response?.status,
          duration,
          response: err.response?.data,
        });

        // 发送性能数据
        this.sendApiPerformanceData({
          url: err.config?.url || "",
          method: err.config?.method || "GET",
          status: err.response?.status || 0,
          duration,
          success: false,
        });

        const { status } = err.response;

        return new Promise((resolve, reject) => {
          if (status === 401) {
            // 缓存请求起来
            addRequest(() => resolve(this.instance(err.config)));
            // 用刷新token 去请求新的主token
            refreshToken();
          } else {
            reject(err);
          }
        });
      }
    );
  }

  // 发送API性能数据
  private sendApiPerformanceData(data: {
    url: string;
    method: string;
    status: number;
    duration: number;
    success: boolean;
  }) {
    // 使用 Sentry 记录 API 性能数据
    sentryContext.setContext("api_performance", {
      url: data.url,
      method: data.method,
      status: data.status,
      duration: data.duration,
      success: data.success,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });

    // 根据性能和状态决定是否需要特殊处理
    if (!data.success || data.status >= 400) {
      // 对于失败的请求，作为错误事件发送
      sentryError.captureMessage(
        `API Request Failed: ${data.method} ${data.url}`,
        "warning"
      );
    } else if (data.duration > 3000) {
      // 对于响应时间过长的请求（>3秒），作为性能问题记录
      sentryError.captureMessage(
        `Slow API Request: ${data.method} ${data.url}`,
        "info"
      );
    }

    // 添加面包屑记录所有API调用
    sentryPerformance.addBreadcrumb(
      `API ${data.success ? "Success" : "Failed"}: ${data.method} ${
        data.url
      } (${data.duration}ms)`,
      "http",
      data.success ? "info" : "error"
    );

    // 开发环境仍然打印日志便于调试
    if (process.env.NODE_ENV === "development") {
      console.log("API Performance:", data);
    }
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig & { suppressErrorNotification?: boolean }
  ): Promise<Result<T>> {
    return this.instance.get(url, {
      ...config,
      params: params,
      paramsSerializer,
    });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { suppressErrorNotification?: boolean }
  ): Promise<Result<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { suppressErrorNotification?: boolean }
  ): Promise<Result<T>> {
    return this.instance.put(url, data, config);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { suppressErrorNotification?: boolean }
  ): Promise<Result<T>> {
    return this.instance.patch(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig & { suppressErrorNotification?: boolean }
  ): Promise<Result<T>> {
    return this.instance.delete(url, config);
  }
}

// 默认导出Request实例
export default new Request({});
