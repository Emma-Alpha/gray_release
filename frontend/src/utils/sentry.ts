import * as Sentry from '@sentry/react';

// 性能监控
export const sentryPerformance = {
  // 开始性能追踪
  startSpan: (name: string, op?: string) => {
    return Sentry.startSpan(
      {
        name,
        op: op || 'custom',
      },
      (span) => {
        return span;
      },
    );
  },

  // 测量函数执行时间
  measureFunction: <T extends any[], R>(fn: (...args: T) => R, name: string, op?: string): ((...args: T) => R) => {
    return (...args: T): R => {
      return Sentry.startSpan(
        {
          name,
          op: op || 'function',
        },
        () => fn(...args),
      );
    };
  },

  // 测量异步函数
  measureAsyncFunction: <T extends any[], R>(fn: (...args: T) => Promise<R>, name: string, op?: string): ((...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R> => {
      return Sentry.startSpan(
        {
          name,
          op: op || 'async_function',
        },
        async () => await fn(...args),
      );
    };
  },

  // 添加面包屑
  addBreadcrumb: (message: string, category?: string, level?: Sentry.SeverityLevel) => {
    Sentry.addBreadcrumb({
      message,
      category: category || 'custom',
      level: level || 'info',
      timestamp: Date.now() / 1000,
    });
  },

  // 手动创建 span
  withSpan: <T>(name: string, op: string, callback: () => T): T => {
    return Sentry.startSpan({ name, op }, callback);
  },
};

// 错误报告
export const sentryError = {
  // 捕获异常
  captureException: (error: Error, context?: Record<string, any>) => {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureException(error);
    });
  },

  // 捕获消息
  captureMessage: (message: string, level?: Sentry.SeverityLevel) => {
    Sentry.captureMessage(message, level || 'info');
  },

  // 手动报告错误
  reportError: (error: Error, tags?: Record<string, string>) => {
    Sentry.withScope((scope) => {
      if (tags) {
        Object.entries(tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      scope.setLevel('error');
      Sentry.captureException(error);
    });
  },
};

// 用户上下文
export const sentryUser = {
  // 设置用户信息
  setUser: (user: { id: string; email?: string; username?: string }) => {
    Sentry.setUser(user);
  },

  // 清除用户信息
  clearUser: () => {
    Sentry.setUser(null);
  },

  // 设置用户反馈
  showReportDialog: (options?: Sentry.ReportDialogOptions) => {
    Sentry.showReportDialog(options);
  },
};

// 自定义标签和上下文
export const sentryContext = {
  // 设置标签
  setTag: (key: string, value: string) => {
    Sentry.setTag(key, value);
  },

  // 设置上下文
  setContext: (key: string, context: Record<string, any>) => {
    Sentry.setContext(key, context);
  },

  // 设置额外信息
  setExtra: (key: string, extra: any) => {
    Sentry.setExtra(key, extra);
  },
};

// ✨ 新增：会话管理
export const sentrySession = {
  // 开始用户会话
  startUserSession: (userId: string, userInfo?: { email?: string; username?: string }) => {
    // 设置用户信息
    Sentry.setUser({
      id: userId,
      ...userInfo,
    });

    // 开始会话
    Sentry.startSession();

    // 添加会话开始的面包屑
    Sentry.addBreadcrumb({
      message: `User session started for ${userId}`,
      category: 'session',
      level: 'info',
    });
  },

  // 结束用户会话
  endUserSession: () => {
    Sentry.addBreadcrumb({
      message: 'User session ended',
      category: 'session',
      level: 'info',
    });

    Sentry.endSession();
    Sentry.setUser(null);
  },

  // 记录页面访问（会话活动）
  recordPageView: (pageName: string, url: string) => {
    Sentry.addBreadcrumb({
      message: `Page view: ${pageName}`,
      category: 'navigation',
      level: 'info',
      data: {
        url,
        timestamp: new Date().toISOString(),
      },
    });
  },

  // 记录用户操作（保持会话活跃）
  recordUserAction: (action: string, details?: Record<string, any>) => {
    Sentry.addBreadcrumb({
      message: `User action: ${action}`,
      category: 'user',
      level: 'info',
      data: {
        ...details,
        timestamp: new Date().toISOString(),
      },
    });
  },
};
