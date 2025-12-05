import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { sentryPerformance, sentryContext, sentryError, sentrySession } from '@/utils/sentry';

// 页面性能监控 Hook
export const useSentryPageTracking = (pageName: string) => {
  const location = useLocation();

  useEffect(() => {
    // ✨ 记录页面访问（保持会话活跃）
    sentrySession.recordPageView(pageName, `${location.pathname}${location.search}`);

    const cleanup = sentryPerformance.withSpan(`Page: ${pageName}`, 'navigation', () => {
      sentryContext.setContext('page', {
        name: pageName,
        path: location.pathname,
        search: location.search,
      });

      sentryPerformance.addBreadcrumb(`Navigation to ${pageName}`, 'navigation', 'info');

      return () => {
        // 清理函数
      };
    });

    return cleanup;
  }, [pageName, location]);
};

// 组件性能监控 Hook
export const useSentryComponentTracking = (componentName: string) => {
  useEffect(() => {
    return sentryPerformance.withSpan(`Component: ${componentName}`, 'ui.react.mount', () => {
      sentryPerformance.addBreadcrumb(`Component ${componentName} mounted`, 'ui', 'info');

      return () => {
        sentryPerformance.addBreadcrumb(`Component ${componentName} unmounted`, 'ui', 'info');
      };
    });
  }, [componentName]);
};

// 错误处理 Hook
export const useSentryErrorHandler = () => {
  return {
    captureError: (error: Error, context?: Record<string, any>) => {
      sentryError.captureException(error, context);
    },
    captureMessage: (message: string, level?: 'info' | 'warning' | 'error') => {
      sentryError.captureMessage(message, level);
    },
  };
};

// 点击事件追踪 Hook
export const useSentryClickTracking = () => {
  return {
    trackClick: (
      buttonName: string,
      context?: {
        buttonId?: string;
        location?: string;
        extraData?: Record<string, any>;
      },
    ) => {
      const clickData = {
        buttonName,
        buttonId: context?.buttonId,
        location: context?.location || window.location.pathname,
        clickTime: new Date().toISOString(),
        timestamp: Date.now(),
        ...context?.extraData,
      };

      // ✨ 主动发送点击事件到 Sentry（这会立即发送）
      sentryError.captureMessage(`Button Click: ${buttonName}`, 'info');

      // 设置点击上下文（会包含在上面的消息中）
      sentryContext.setContext('clickData', clickData);

      // 记录用户操作（用于埋点统计）
      sentrySession.recordUserAction(`Button Click: ${buttonName}`, clickData);

      // 添加面包屑用于调试
      sentryPerformance.addBreadcrumb(`Button clicked: ${buttonName}`, 'user.click', 'info');

      // 设置点击上下文
      sentryContext.setContext('lastClick', clickData);
    },
  };
};
