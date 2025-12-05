import 'dayjs/locale/zh-cn';

import { renderClient } from '@config/router';
import { initSentry } from '@config/sentry/sentry.config';
import * as Sentry from '@sentry/react';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { routes } from '@/routes';
import { sentrySession } from '@/utils/sentry';
import { openUpdateVersionNotify } from '@/utils/updateVersion';

import Loading from './loading';

dayjs.locale('zh-cn');

import './index.css';

const AppName = process.env.APP_NAME ?? '';
const BASENAME = process.env.BASENAME;
const VERSION_NOTIFY_TIME = process.env.VERSION_NOTIFY_TIME;
const SENTRY_ENABLED = process.env.SENTRY_ENABLED;

// 初始化 Sentry (在应用启动之前)
if (SENTRY_ENABLED === 'true') {
  initSentry();
}

// 配置antd 静态方法使用的
ConfigProvider.config({
  prefixCls: AppName,
});

const context = {
  basename: BASENAME,
  loadingComponent: () => <Loading name={'基座'} />,
  rootElement: document.getElementById(AppName) ?? document.body,
};

openUpdateVersionNotify(Number(VERSION_NOTIFY_TIME));

// 子应用接入
export const provider = () => {
  let root: any = null;
  return {
    destroy() {
      root?.unmount();
    },
    render({ basename }) {
      // 更改basename的值
      context.basename = basename;
      root = renderClient(context);
      window.Garfish.channel.emit('router', {
        name: AppName,
        routes: routes,
      });
    },
  };
};

// 添加单独启动逻辑
if (!window.__GARFISH__) {
  renderClient(context);
}

// 添加全局错误处理
window.addEventListener('error', event => {
  Sentry.captureException(event.error);
});

window.addEventListener('unhandledrejection', event => {
  Sentry.captureException(event.reason);
});

// ✨ 监听应用生命周期事件
window.addEventListener('load', () => {
  // 页面完全加载后记录会话活动
  sentrySession.recordPageView('Application Start', window.location.href);
});

window.addEventListener('beforeunload', () => {
  // 页面卸载前结束会话
  sentrySession.endUserSession();
});

// ✨ 监听页面可见性变化
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    sentrySession.recordUserAction('Page became visible');
  } else {
    sentrySession.recordUserAction('Page became hidden');
  }
});
