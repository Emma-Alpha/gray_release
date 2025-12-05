import * as Sentry from '@sentry/react';

// Sentry 配置接口
export interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  sampleRate: number;
  tracesSampleRate: number;
  enabled: boolean;
  sessionSampleRate: number;
  beforeSend?: (event: Sentry.ErrorEvent, hint: Sentry.EventHint) => Sentry.ErrorEvent | null;
}

// 开发环境配置
const developmentConfig: Partial<SentryConfig> = {
  enabled: true, // 开发环境可以选择关闭
  sampleRate: 1.0,
  tracesSampleRate: 1.0,
  sessionSampleRate: 1.0, // 开发环境记录所有会话
  beforeSend: (event, hint) => {
    console.group('🐛 Sentry Event (Development)');
    console.log('Event:', event);
    console.log('Hint:', hint);
    console.log('Event:', event);
    console.groupEnd();

    return event;
  },
};

// 生产环境配置
const productionConfig: Partial<SentryConfig> = {
  enabled: true,
  sampleRate: 1.0, // 临时设置为100%以排查问题，后续可调整
  tracesSampleRate: 0.1, // 提高到10%性能采样
  sessionSampleRate: 1.0, // 记录所有会话以获得准确的健康度数据
  beforeSend: (event, hint) => {
    // 生产环境也打印日志以便调试
    console.log('🐛 Sentry Event (Production):', event);

    // 过滤敏感信息
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('密码') || error?.value?.includes('token')) {
        return null; // 不发送包含敏感信息的错误
      }
    }
    return event;
  },
};

// 获取环境配置
const getEnvironmentConfig = (): Partial<SentryConfig> => {
  const env = process.env.NODE_ENV || 'development';
  console.log(env, 'env');
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

// 基础配置
const baseConfig: SentryConfig = {
  dsn: process.env.REACT_APP_SENTRY_DSN || '',
  environment: process.env.SENTRY_ENV || 'development',
  enabled: true,
  sampleRate: 1.0,
  tracesSampleRate: 1.0,
  sessionSampleRate: 1.0, // 默认记录所有会话
};

// 合并配置
export const sentryConfig: SentryConfig = {
  ...baseConfig,
  ...getEnvironmentConfig(),
};

// 安全的会话重放集成初始化
const getSafeReplayIntegration = () => {
  try {
    return Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: true,
      networkDetailAllowUrls: [window.location.origin],
    }) as any; // 添加类型断言
  } catch (error) {
    console.warn('会话重放初始化失败:', error);
    return null;
  }
};

// 初始化 Sentry
export const initSentry = () => {
  // 修复 fetch 上下文问题
  if (typeof window !== 'undefined' && window.fetch) {
    window.fetch = window.fetch.bind(window);
  }

  if (!sentryConfig.enabled || !sentryConfig.dsn) {
    console.warn('❌ Sentry not enabled or DSN not provided');
    return;
  }

  const integrations = [Sentry.browserTracingIntegration()];

  // 安全地添加会话重放集成
  const replayIntegration = getSafeReplayIntegration();
  if (replayIntegration && !window.__GARFISH__) {
    // 目前微服务无法使用会话重放
    integrations.push(replayIntegration);
  }

  Sentry.init({
    dsn: sentryConfig.dsn,
    environment: sentryConfig.environment,
    sampleRate: sentryConfig.sampleRate,
    tracesSampleRate: sentryConfig.tracesSampleRate,
    beforeSend: sentryConfig.beforeSend,

    // 使用自定义传输层，确保fetch上下文正确
    transport: Sentry.makeBrowserOfflineTransport((options) => Sentry.makeFetchTransport(options, window.fetch.bind(window))),

    // 设置追踪的 URL 匹配规则
    tracePropagationTargets: ['localhost', /^https:\/\/yourapi\.domain\.com\/api/],

    // 使用安全的集成配置
    integrations,

    // 错误过滤
    ignoreErrors: [
      // 忽略常见的无害错误
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.',
      'Network Error',
      'Loading chunk',
      'Loading CSS chunk',
    ],

    // URL 过滤
    denyUrls: [
      // 忽略浏览器扩展
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],

    // 只在会话重放可用时设置这些选项
    ...(replayIntegration && {
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    }),
  });

  // 设置应用上下文
  Sentry.setContext('app', {
    name: process.env.APP_NAME || 'React App',
  });

  // ✨ 手动开始会话（确保会话被正确追踪）
  Sentry.startSession();

  console.log('✅ Sentry initialized successfully with session tracking');
};

// ✨ 新增：会话管理工具
export const sentrySession = {
  // 开始新会话
  startSession: () => {
    Sentry.startSession();
  },

  // 结束当前会话
  endSession: () => {
    Sentry.endSession();
  },

  // 标记会话为崩溃
  captureSession: (crashed: boolean = false) => {
    Sentry.captureSession(crashed);
  },
};
