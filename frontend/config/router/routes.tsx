import ErrorBoundary from '@/components/ErrorBoundary';
import Loading from '@/components/Loading';
import React from 'react';
import { Navigate, generatePath, useParams } from 'react-router';
import { RouteContext } from './routeContext';
import type { IClientRoute, IRoute, IRoutesById } from './types';

// 异步组件错误边界 - 无额外 DOM 包装
function AsyncComponentErrorBoundary({
  children,
  componentName,
  onRetry,
}: { children: React.ReactNode; componentName?: string; onRetry: () => void }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

// 带重试功能的远程组件 - 修复版
function RemoteComponent({
  loader: Component,
  loadingComponent: LoadingComponent,
  componentId,
  onRetry,
}: {
  loader: any;
  loadingComponent: any;
  componentId?: string;
  onRetry: () => void;
}) {
  return (
    <AsyncComponentErrorBoundary componentName={componentId} onRetry={onRetry}>
      <React.Suspense fallback={<LoadingComponent />}>
        <Component />
      </React.Suspense>
    </AsyncComponentErrorBoundary>
  );
}

// 路由元素包装器 - 处理重试逻辑
function RouteElementWrapper({
  route,
  routeComponent,
  loadingComponent,
}: { route: IRoute; routeComponent: any; loadingComponent: any }) {
  const [retryCount, setRetryCount] = React.useState(0);

  const handleRetry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  // 使用 key 强制重新挂载整个组件树
  return (
    <RouteContext.Provider
      key={`route-${route.id}-${retryCount}`}
      value={{ route }}
    >
      <RemoteComponent
        loader={routeComponent}
        loadingComponent={loadingComponent || DefaultLoading}
        componentId={route.id}
        onRetry={handleRetry}
      />
    </RouteContext.Provider>
  );
}

export function createClientRoutes(opts: {
  routesById: IRoutesById;
  routeComponents: Record<string, any>;
  parentId?: string;
  loadingComponent?: React.ReactNode;
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
}): IClientRoute[] {
  const { routesById, routeComponents, parentId } = opts;

  return Object.keys(routesById)
    .filter(id => routesById[id].parentId === parentId)
    .map(id => {
      const route = createClientRoute({
        route: routesById[id],
        routeComponent: routeComponents[id],
        loadingComponent: opts.loadingComponent,
        errorBoundary: opts.errorBoundary,
      });

      const children = createClientRoutes({
        routesById,
        routeComponents,
        parentId: route.id,
        loadingComponent: opts.loadingComponent,
        errorBoundary: opts.errorBoundary,
      });

      if (children.length > 0) {
        route.children = children;
      }
      return route;
    });
}

function createClientRoute(opts: {
  route: IRoute;
  routeComponent: any;
  loadingComponent?: React.ReactNode;
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
}): IClientRoute {
  const { route } = opts;
  const { redirect, ...props } = route;

  let loadingComponent: any = opts.loadingComponent;

  if (props?.loading) {
    if (String(props.loading).startsWith('(')) {
      loadingComponent = props.loading;
    }
  }

  return {
    element: redirect ? (
      <NavigateWithParams to={redirect} />
    ) : (
      <RouteElementWrapper
        route={route}
        routeComponent={opts.routeComponent}
        loadingComponent={loadingComponent}
      />
    ),
    ...props,
  };
}

function DefaultLoading() {
  return <Loading />;
}

function NavigateWithParams(props: { to: string }) {
  const params = useParams();
  const propsWithParams = {
    ...props,
    to: generatePath(props.to, params),
  };
  return <Navigate replace={true} {...propsWithParams} />;
}
