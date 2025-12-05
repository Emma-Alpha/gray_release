# rspack-subApplicate_demo 项目详细分析文档

## 🚀 项目概述

### 项目定位

这是一个基于 React + rspack 构建的企业级微前端子应用脚手架项目，专为快速开发微前端子应用而设计。项目采用字节跳动开源的 **Garfish** 作为微前端框架，集成了现代前端开发所需的各种工具和最佳实践。

### 设计理念

- **工程化**: 完整的构建、测试、部署流程
- **微前端**: 支持独立运行和集成运行
- **类型安全**: 全面的 TypeScript 支持
- **用户体验**: 国际化、错误监控、性能优化
- **开发效率**: 热重载、代码分割、智能缓存

## 📋 技术栈详解

### 🎯 核心技术栈

| 技术               | 版本   | 用途       | 说明                         |
| ------------------ | ------ | ---------- | ---------------------------- |
| **React**          | 19.1.0 | 前端框架   | 支持最新的并发特性和 Hooks   |
| **TypeScript**     | 5.6.3  | 类型系统   | 提供完整的类型检查和智能提示 |
| **rspack**        | 5.99.9 | 构建工具   | 模块打包和代码分割           |
| **Garfish**        | 1.19.3 | 微前端框架 | 字节跳动开源的微前端解决方案 |
| **Ant Design**     | 5.25.4 | UI 组件库  | 企业级设计语言和组件库       |
| **Zustand**        | 5.0.5  | 状态管理   | 轻量级状态管理库             |
| **React Router**   | 6.28.0 | 路由管理   | 声明式路由                   |
| **TanStack Query** | 5.80.6 | 数据获取   | 强大的数据同步库             |

### 🛠️ 开发工具链

| 工具                  | 版本   | 用途       |
| --------------------- | ------ | ---------- |
| **Jest**              | 29.7.0 | 测试框架   |
| **Testing Library**   | 16.3.0 | 组件测试   |
| **Tailwind CSS**      | 4.1.8  | 原子化 CSS |
| **Styled Components** | 5.3.11 | CSS-in-JS  |
| **i18next**           | 25.2.1 | 国际化     |
| **Sentry**            | 9.27.0 | 错误监控   |
| **ESBuild**           | -      | 快速编译   |
| **PostCSS**           | 8.4.49 | CSS 处理   |

### 📦 包管理

- **包管理器**: pnpm >= 8.0.0
- **Node.js**: >= 20.0.0
- **浏览器兼容性**: 基于 browserslist defaults

## 📁 项目结构详解

```
rspack-subApplicate_demo/
├── 🗂️ config/                      # 配置文件目录
│   ├── env/                        # 环境变量配置
│   ├── rspack/                    # rspack构建配置
│   │   ├── rspack.development.js  # 开发环境配置
│   │   ├── rspack.product.js      # 生产环境配置
│   │   ├── rspack.public.js       # 公共配置
│   │   ├── paths.js               # 路径配置
│   │   └── plugins/               # 自定义插件
│   ├── sentry/                    # Sentry错误监控配置
│   ├── router/                    # 路由系统配置
│   ├── request/                   # HTTP请求配置
│   ├── history/                   # 浏览器历史记录
│   ├── jwt/                       # JWT认证配置
│   └── public/                    # 静态资源配置
│
├── 🎨 src/                         # 源代码目录
│   ├── components/                # 🧩 公共组件库
│   │   ├── ErrorBoundary/         # 错误边界组件
│   │   ├── Loading/               # 加载组件
│   │   ├── RequireAuth/           # 权限控制组件
│   │   ├── Header/                # 页头组件
│   │   ├── Sider/                 # 侧边栏组件
│   │   ├── Footer/                # 页脚组件
│   │   ├── Icon/                  # 图标组件
│   │   └── ManualSlave/           # 手动从属组件
│   │
│   ├── pages/                     # 📄 页面组件
│   │   ├── layout/                # 布局页面
│   │   ├── login/                 # 登录页面
│   │   ├── 404/                   # 404错误页面
│   │   ├── base/                  # 基础页面
│   │   ├── ExamplePage.tsx        # 示例页面
│   │   └── index.css              # 页面样式
│   │
│   ├── hooks/                     # 🎣 自定义Hooks
│   ├── utils/                     # 🔧 工具函数库
│   │   ├── requestChannel.ts      # 请求通道管理
│   │   ├── channel.ts             # 通信通道
│   │   ├── sentry.ts              # Sentry工具
│   │   ├── locale.ts              # 国际化工具
│   │   ├── convert.ts             # 数据转换工具
│   │   ├── format.ts              # 格式化工具
│   │   ├── getMicroApp.ts         # 微应用工具
│   │   └── updateVersion.ts       # 版本更新工具
│   │
│   ├── const/                     # 📊 常量定义
│   ├── locales/                   # 🌐 国际化资源
│   ├── __mocks__/                 # 🎭 Mock数据
│   ├── routes.ts                  # 🗺️ 路由配置
│   ├── index.tsx                  # 🚪 应用入口
│   ├── loading.tsx                # ⏳ 加载页面
│   ├── index.css                  # 🎨 全局样式
│   ├── index.html                 # 📄 HTML模板
│   ├── setupTests.ts              # 🧪 测试配置
│   └── test-utils.tsx             # 🛠️ 测试工具
│
├── 🗄️ store/                       # 状态管理
│   ├── auth/                      # 认证状态
│   ├── global/                    # 全局状态
│   ├── user/                      # 用户状态
│   └── types.ts                   # 类型定义
│
├── 🌍 locales/                     # 国际化文件
│   ├── zh-CN/                     # 中文资源
│   └── en-US/                     # 英文资源
│
├── 📦 dist/                        # 构建输出目录
├── 🗂️ .github/                     # GitHub工作流
├── 🗂️ .vscode/                     # VS Code配置
│
└── 📋 配置文件
    ├── package.json               # 项目配置
    ├── tsconfig.json              # TypeScript配置
    ├── tailwind.config.js         # Tailwind CSS配置
    ├── jest.config.js             # Jest测试配置
    ├── babel.config.js            # Babel配置
    ├── postcss.config.js          # PostCSS配置
    ├── .prettierrc.json           # Prettier格式化配置
    ├── .gitignore                 # Git忽略文件
    ├── .nvmrc                     # Node版本配置
    ├── .npmrc                     # npm配置
    └── pnpm-lock.yaml             # 依赖锁定文件
```

## 🏗️ 核心架构设计

### 微前端架构

#### 子应用接入机制

```typescript
// src/index.tsx
export const provider = () => {
  let root: any = null;
  return {
    render({ basename }) {
      // 动态设置基础路径
      context.basename = basename;
      root = renderClient(context);

      // 向主应用传递路由信息
      window.Garfish.channel.emit('router', {
        name: AppName,
        routes: routes,
      });
    },
    destroy() {
      // 清理资源
      root?.unmount();
    },
  };
};
```

#### 独立运行支持

```typescript
// 支持子应用独立开发和调试
if (!window.__GARFISH__) {
  renderClient(context);
}
```

### 路由系统设计

#### 路由配置结构

```typescript
// src/routes.ts
export const routes: RoutesTree[] = [
  {
    path: '',
    component: 'layout/MainContentWrap',
    routes: [
      {
        path: '/auth',
        component: 'auth/layout.tsx',
        routes: [
          {
            path: '/auth',
            component: 'auth/page.tsx',
            props: {
              perarr: '01', // 权限码
              skipAuth: true, // 跳过认证
            },
          },
        ],
      },
      {
        path: '/',
        redirect: '/base',
      },
      // ... 更多路由配置
    ],
  },
];
```

#### 路由类型定义

```typescript
// store/types.ts
export interface RoutesTree {
  key?: string;
  path?: string;
  wrappers?: string[];
  component?: string | (() => React.JSX.Element);
  routes?: RoutesTree[];
  microApp?: string; // 微应用名称
  entry?: string; // 微应用入口
  redirect?: string; // 重定向路径
  props?: IBestAFSRoute; // 路由属性
}

export interface IBestAFSRoute {
  name?: string; // 菜单显示名称
  icon?: any; // 图标
  perarr?: string; // 权限位
  headerRender?: boolean; // 是否显示顶栏
  footerRender?: false; // 是否显示页脚
  menuRender?: false; // 是否显示菜单
  hideChildrenInMenu?: false; // 是否隐藏子菜单
  hideInMenu?: false; // 是否隐藏菜单项
  skipAuth?: boolean; // 是否跳过权限认证
  category?: string; // 分类
}
```

## 🔧 开发环境配置

### rspack 开发服务器

```javascript
// config/rspack/rspack.development.js
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // 自定义中间件
    setupMiddlewares: (middlewares, devServer) => {
      const { app } = devServer;

      // 构建进度API
      app.use('/__progress', (_req, res) => {
        res.json({ progress, status, detailInfo });
      });

      // 路由劫持处理构建状态
      app.get('*', (_req, res, next) => {
        if (progress < 1) {
          // 显示构建进度页面
          const htmlPath = path.resolveApp('./config/rspack/plugins/status.html');
          const html = fs.readFileSync(htmlPath, { encoding: 'utf-8' });
          res.send(html);
          return;
        }
        next();
      });

      return middlewares;
    },

    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: HOST,
    port: PORT,
    compress: true, // 开启gzip压缩
    historyApiFallback: true, // SPA路由支持
    hot: true, // 热模块替换
    allowedHosts: 'all', // 允许所有主机访问
  },
});
```

### 样式处理配置

```javascript
// 开发环境样式处理规则
module: {
  rules: [
    // Ant Design Less文件处理
    {
      test: /\.less$/,
      include: [/[\\/]node_modules[\\/].*antd/],
      use: ['style-loader', 'css-loader', 'less-loader'],
    },

    // 项目Less文件 + CSS Modules
    {
      test: /\.less$/,
      include: [path.resolveApp('src')],
      exclude: [path.resolveApp('node_modules')],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
        },
        'less-loader',
      ],
    },

    // Tailwind CSS处理
    {
      test: /\.css$/,
      include: [path.resolveApp('src/index.css')],
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
  ],
}
```

## 🎨 样式系统

### Tailwind CSS 配置

```javascript
// tailwind.config.js
module.exports = {
  // 重要性前缀，避免样式冲突
  important: `#${process.env.APP_NAME}`,

  // 内容扫描路径
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // 自定义主题扩展
    },
  },

  corePlugins: {
    // 禁用预设样式，避免与Ant Design冲突
    preflight: false,
  },

  plugins: [],
};
```

### Ant Design 主题配置

```tsx
// 在布局组件中配置
<ConfigProvider
  prefixCls='rta' // 自定义CSS前缀
  theme={{
    token: {
      fontFamily: 'FAE8F6F96C59ED1,Microsoft Yahei,Hiragino Sans GB,tahoma,arial,B8B F53',
      colorTextBase: 'rgba(0, 0, 0, 0.65)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.45)',
      colorTextHeading: 'rgba(0, 0, 0, 0.85)',
      colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
    },
  }}
>
  {/* 应用内容 */}
</ConfigProvider>
```

## 🧪 测试系统

### Jest 配置详解

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',

  // 文件转换配置
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // 测试文件匹配
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)', '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)'],

  // 路径别名映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@store/(.*)$': '<rootDir>/store/$1',
    '^@locales/(.*)$': '<rootDir>/locales/$1',

    // 静态资源Mock
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },

  // 测试环境设置
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // 覆盖率配置
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/index.tsx', '!src/setupTests.ts'],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
```

### 测试工具配置

```tsx
// src/test-utils.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';

// 自定义渲染函数
const customRender = (ui: React.ReactElement, options = {}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <ConfigProvider prefixCls='test'>{children}</ConfigProvider>;

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
```

## 🔐 认证与权限系统

### JWT 双 Token 机制

#### 核心设计理念

- **短 Token**: 用于日常 API 请求，有效期较短（如 30 分钟）
- **长 Token**: 用于刷新短 Token，有效期较长（如 7 天）
- **无感刷新**: 在短 Token 过期时自动使用长 Token 刷新

#### 实现机制

```typescript
// 响应拦截器
this.instance.interceptors.response.use(
  (res: AxiosResponse) => {
    const { data } = res;
    const { code, message } = data;

    // 业务错误处理
    if (code === 999) {
      notification.error({
        message: message || '登录过期, 请重新登录',
      });
      redirectToLogin();
      return Promise.reject(data);
    }

    return res.data;
  },
  (err: any) => {
    const { status } = err.response;

    return new Promise((resolve, reject) => {
      if (status === 401) {
        // 缓存失败的请求
        addRequest(() => resolve(this.instance(err.config)));
        // 使用长Token刷新短Token
        refreshToken();
      } else {
        reject(err);
      }
    });
  },
);
```

#### 并发请求保护

```typescript
let flag = false; // 全局开关，防止多次刷新Token
let subSequest: any[] = []; // 缓存待重试请求

function addRequest(request: () => any) {
  subSequest.push(request);
}

function retryRequest() {
  subSequest.forEach((request) => request());
  subSequest = [];
}

function refreshToken() {
  if (!flag) {
    flag = true;

    let r_tk = jwt.getAccessToken('refresh_token');
    if (r_tk) {
      getRefreshToken(r_tk)
        .then((v) => v.json())
        .then((v) => {
          flag = false;
          if (!v?.data?.accessToken) {
            redirectToLogin();
            return;
          }

          // 更新Token
          jwt.setAccessToken({
            token_type: v.data?.tokenType ?? 'JWT',
            access_token: v.data?.accessToken,
            expires_at: v.data?.expires_at * 1000,
          });

          // 重新发送缓存的请求
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
```

### 权限控制

#### 路由级权限

```typescript
// 在路由配置中设置权限
{
  path: '/admin',
  component: 'admin/page.tsx',
  props: {
    perarr: '01.02',      // 权限码
    skipAuth: false,      // 需要认证
  },
}
```

#### 组件级权限

```tsx
// RequireAuth组件示例
const RequireAuth: React.FC<{ perarr: string; children: React.ReactNode }> = ({ perarr, children }) => {
  const hasPermission = usePermission(perarr);

  if (!hasPermission) {
    return <Navigate to='/403' replace />;
  }

  return <>{children}</>;
};
```

## 🌐 国际化系统

### i18next 配置

```typescript
// src/utils/locale.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // React集成
  .use(resourcesToBackend((language, namespace) => import(`@locales/${language}/${namespace}.json`))) // 资源懒加载
  .init({
    fallbackLng: 'zh-CN', // 默认语言
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React已经处理XSS
    },

    detection: {
      order: ['navigator', 'htmlTag'], // 检测顺序
      caches: ['localStorage'], // 缓存语言设置
    },
  });
```

### 使用示例

```tsx
// 在组件中使用
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('en-US')}>{t('switch_to_english')}</button>
    </div>
  );
};
```

## 📊 错误监控系统

### Sentry 集成

```typescript
// config/sentry/sentry.config.ts
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // 性能监控
    tracesSampleRate: 0.1,

    // 会话回放
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // 错误过滤
    beforeSend(event) {
      // 过滤掉开发环境的错误
      if (process.env.NODE_ENV === 'development') {
        return null;
      }
      return event;
    },

    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  });
};
```

### 错误边界

```tsx
// src/components/ErrorBoundary/index.tsx
import { ErrorBoundary } from '@sentry/react';

const MyErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className='error-boundary'>
          <h2>出错了！</h2>
          <p>{error.message}</p>
          <button onClick={resetError}>重试</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Error boundary caught an error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## 🚀 性能优化

### 代码分割

```tsx
// 路由级代码分割
const LazyComponent = React.lazy(() => import('./Component'));

const App = () => (
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
);
```

### 构建优化

```javascript
// rspack.product.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库单独打包
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        // 公共代码提取
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },

    // 代码压缩
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除console
            drop_debugger: true, // 移除debugger
          },
        },
      }),
      new CssMinimizerPlugin(), // CSS压缩
    ],
  },
};
```

## 📱 开发脚本

### package.json 脚本详解

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development rspack-dev-server --config config/rspack/rspack.development.js",
    "build:test": "cross-env NODE_ENV=test rspack build --config config/rspack/rspack.product.js --mode production --progress",
    "build": "cross-env NODE_ENV=production rspack build --config config/rspack/rspack.product.js --mode production --progress",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false"
  }
}
```

### 环境变量配置

```bash
# .env.development
NODE_ENV=development
APP_NAME=demo
APP_HOST=localhost
APP_PORT=5200
BASENAME=/demo
VERSION_NOTIFY_TIME=3600000
SENTRY_DSN=your_sentry_dsn
```

## 🔨 开发指南

### 1. 项目启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm start

# 访问地址
http://localhost:5200
```

### 2. 新增页面

```bash
# 1. 在 src/pages 下创建页面组件
src/pages/newPage/
├── index.tsx
├── style.module.less
└── types.ts

# 2. 在 routes.ts 中添加路由配置
{
  path: '/new-page',
  component: 'newPage/index.tsx',
  props: {
    name: '新页面',
    perarr: '01.03',
  },
}
```

### 3. 状态管理

```typescript
// store/newStore/index.ts
import { create } from 'zustand';

interface NewState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useNewStore = create<NewState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### 4. API 封装

```typescript
// src/api/newApi.ts
import request from '@config/request';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export const newApi = {
  // 获取列表
  getList: (params: any): Promise<ApiResponse> => {
    return request.get('/api/list', params);
  },

  // 创建数据
  create: (data: any): Promise<ApiResponse> => {
    return request.post('/api/create', data);
  },

  // 更新数据
  update: (id: string, data: any): Promise<ApiResponse> => {
    return request.put(`/api/update/${id}`, data);
  },

  // 删除数据
  delete: (id: string): Promise<ApiResponse> => {
    return request.delete(`/api/delete/${id}`);
  },
};
```

### 5. 组件开发规范

```tsx
// src/components/NewComponent/index.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import styles from './style.module.less';

interface NewComponentProps {
  title: string;
  onAction?: () => void;
}

const StyledWrapper = styled.div`
  padding: 16px;
  border-radius: 8px;
`;

export const NewComponent: React.FC<NewComponentProps> = ({ title, onAction }) => {
  const { t } = useTranslation();

  return (
    <StyledWrapper className={styles.wrapper}>
      <h3>{title}</h3>
      <button onClick={onAction}>{t('common.action')}</button>
    </StyledWrapper>
  );
};

export default NewComponent;
```

## 🐛 常见问题与解决方案

### 1. 端口被占用

```bash
# 修改端口配置
# 在 .env 文件中修改 APP_PORT
APP_PORT=8080

# 或者在启动时指定端口
APP_PORT=8080 pnpm start
```

### 2. 微前端集成问题

```typescript
// 确保正确暴露provider
export const provider = () => {
  return {
    render({ basename }) {
      // 必须设置basename
      context.basename = basename;
      root = renderClient(context);

      // 必须发送路由信息
      window.Garfish.channel.emit('router', {
        name: process.env.APP_NAME,
        routes: routes,
      });
    },
    destroy() {
      root?.unmount();
    },
  };
};
```

### 3. 样式冲突

```css
/* 使用CSS前缀避免冲突 */
#demo .my-component {
  /* 样式定义 */
}

/* 或者使用CSS Modules */
.wrapper {
  composes: base from './base.module.css';
}
```

### 4. TypeScript 路径别名问题

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@config/*": ["./config/*"],
      "@store/*": ["./store/*"]
    }
  }
}
```

### 5. API 请求错误处理

```typescript
// 屏蔽特定接口的错误提示
export function apiGetData(params: any) {
  return request.get('/api/data', params, {
    suppressErrorNotification: true,
  });
}

// 自定义错误处理
export function apiWithCustomError(params: any) {
  return request.get('/api/data', params).catch((error) => {
    // 自定义错误处理逻辑
    console.error('API Error:', error);
    throw error;
  });
}
```

## 📈 最佳实践

### 1. 项目结构

- **按功能模块组织**: 相关文件放在同一目录
- **统一命名规范**: 使用 kebab-case 命名文件夹，PascalCase 命名组件
- **合理的文件拆分**: 单个文件不超过 300 行

### 2. 代码质量

- **TypeScript 严格模式**: 启用所有严格检查
- **ESLint + Prettier**: 统一代码风格
- **代码审查**: 通过 Pull Request 进行代码审查

### 3. 性能优化

- **懒加载**: 路由和组件按需加载
- **缓存策略**: 合理使用 React Query 缓存
- **Bundle 分析**: 定期分析打包体积

### 4. 安全规范

- **输入验证**: 所有用户输入都要验证
- **XSS 防护**: 使用 React 的内置 XSS 防护
- **HTTPS**: 生产环境必须使用 HTTPS

## 🚀 部署指南

### 构建配置

```bash
# 测试环境构建
pnpm build:test

# 生产环境构建
pnpm build

# 构建产物
dist/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
└── favicon.ico
```

## 📝 更新日志

### v1.0.0 (当前版本)

- ✅ 基础微前端架构
- ✅ React 19 + TypeScript 5
- ✅ rspack 5 构建系统
- ✅ Ant Design 5 UI 组件库
- ✅ JWT 双 Token 认证
- ✅ 国际化支持
- ✅ Sentry 错误监控
- ✅ 完整测试环境

### 未来计划

- 🔄 React 18 并发特性优化
- 🔄 rspack 联邦模块
- 🔄 PWA 支持
- 🔄 移动端适配
- 🔄 性能监控增强

## 🤝 贡献指南

### 开发流程

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交变更: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 提交 Pull Request

### 代码规范

- 遵循项目的 ESLint 配置
- 编写单元测试
- 更新相关文档
- 通过所有 CI 检查

---

**项目维护者**: 梁平波
**最后更新**: 2025 年 6 月
**文档版本**: v1.0.0
