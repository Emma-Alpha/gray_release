import { useEffect } from 'react';
import { useLocation, matchRoutes } from 'react-router';
import { useAppData } from '@config/router/appContext';

const APP_NAME = process.env.APP_NAME!;

export const useRouteTitle = () => {
  const location = useLocation();
  const { routes } = useAppData();

  useEffect(() => {
    // 将路由配置转换为适合 matchRoutes 的格式
    const routesList = Object.keys(routes).map((key) => {
      const route = routes[key];
      return {
        path: route.absPath,
        meta: route.props,
        id: key,
      };
    });
    // 匹配当前路径的路由
    const matchedRoutes = matchRoutes(routesList, location);

    if (matchedRoutes && matchedRoutes.length > 0) {
      // 找到最后一个匹配的路由（叶子路由）
      const leafRoute = matchedRoutes[matchedRoutes.length - 1];
      const title = leafRoute.route.meta?.title;

      if (title) {
        document.title = title;
      } else {
        document.title = APP_NAME;
      }
    }
  }, [location.pathname, routes]);
};
