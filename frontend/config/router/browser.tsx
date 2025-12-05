import { isAbsolute } from 'path';
import ErrorBoundary from '@/components/ErrorBoundary';
import { isEmpty } from 'lodash-es';
import React, {
  type ReactNode,
  version,
  useState,
  useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom/client';
import {
  Router,
  RouterProvider,
  createBrowserRouter,
  useRoutes,
} from 'react-router';
import { AppContext, useAppData } from './appContext';
import { getRoutes, winPath } from './getRoutes';
import { createClientRoutes } from './routes';
import type { IRouteComponents, IRoutesById, RenderClientOpts } from './types';
import { routes as conventionRoutes } from "../../src/routes";

// 声明全局变量类型
declare global {
  const __CONVENTION_ROUTES__: any;
}

// 版本比较方法
function compareVersions(version1: string, version2: string): number {
  const v1 = version1.split('.').map(num => Number.parseInt(num, 10));
  const v2 = version2.split('.').map(num => Number.parseInt(num, 10));

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

const getBrowser = (opts: {
  routes: IRoutesById;
  routeComponents: IRouteComponents;
  loadingComponent?: ReactNode;
  basename?: string;
  history?: History;
  rootElement?: HTMLElement;
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
}) => {
  const basename = opts?.basename ?? '/';

  const clientRoutes = createClientRoutes({
    routesById: opts.routes,
    routeComponents: opts.routeComponents,
    loadingComponent: opts.loadingComponent,
    errorBoundary: opts.errorBoundary,
  });

  // 创建router对象并启用v7 future flags
  const router = createBrowserRouter(clientRoutes as any, {
    basename,
  });

  const Browser = () => {
    return (
      <ErrorBoundary>
        <AppContext
          value={{
            routes: opts.routes,
            routeComponents: opts.routeComponents,
            clientRoutes: clientRoutes,
            rootElement: opts.rootElement as HTMLElement,
            basename,
            history: opts.history,
          }}
        >
          <RouterProvider router={router} />
        </AppContext>
      </ErrorBoundary>
    );
  };

  return Browser;
};

export function getRouteComponents(opts: {
  routes: IRoutesById;
  prefix?: string;
  defaultEmptyRouteComponent?: string;
}): Record<string, React.LazyExoticComponent<any>> {
  // 版本检查
  const result = compareVersions(version, '18.0.0');
  if (result < 0) {
    console.error('当前框架React版本小于 18.0.0, 无法正常使用');
    throw new Error('React version must be 18.0.0 or higher');
  }

  const imports: Record<string, React.LazyExoticComponent<any>> = {};

  Object.keys(opts.routes).forEach(key => {
    const route = opts.routes[key];

    if (!route.file) {
      const EmptyElement = opts?.defaultEmptyRouteComponent ?? '404';
      imports[key] = React.lazy(() => import(`@/${EmptyElement}`));
      return;
    }

    if (String(route.file).startsWith('(')) {
      imports[key] = React.lazy(() =>
        Promise.resolve(route.file).then((e: any) =>
          e?.default ? e : { default: e },
        ),
      );
      return;
    }

    const path =
      isAbsolute(route.file) || route.file.startsWith('@/')
        ? route.file
        : `${opts?.prefix ?? ''}${route.file}`;

    imports[key] = React.lazy(() => import(`@/${winPath(path)}`));
  });

  return imports;
}

export function Routes() {
  const { clientRoutes } = useAppData();
  return useRoutes(clientRoutes as any);
}

export function renderClient(opts: RenderClientOpts) {
  const routes: any = getRoutes(conventionRoutes as any);
  if (isEmpty(routes)) {
    console.error('未找到路由配置，请检查路由配置是否正确');
    return;
  }
  const routeComponents = getRouteComponents({
    routes,
  });

  const Browser = getBrowser({
    routes,
    routeComponents: routeComponents,
    rootElement: opts.rootElement,
    basename: opts.basename,
    errorBoundary: opts.errorBoundary,
  });

  const rootElement =
    opts.rootElement || (document.getElementById('root') as HTMLElement);

  const root = ReactDOM.createRoot(rootElement);
  root.render(<Browser />);
  return root;
}
