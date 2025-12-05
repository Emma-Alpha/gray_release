export interface RouteItem {
  path?: string;
  wrappers?: string[];
  component?: string | (() => React.JSX.Element);
  redirect?: string;
  routes?: RouteItem[];
  [any: string]: any;
}

export interface IRouteConventionExportProps {
  routeProps?: Record<string, any>;
}

export interface IRoute extends IRouteConventionExportProps {
  id: string;
  path?: string;
  index?: boolean;
  parentId?: string;
  redirect?: string;
  loading?: string | React.ReactNode;
  absPath?: string;
  file?: string;
  name?: string;
  title?: string;
  cname?: string;
  key?: string;
  perarr?: string;
  microApp?: string;
  entry?: string;
  [key: string]: any;
}

export interface IClientRoute extends IRoute {
  element: React.ReactNode;
  children?: IClientRoute[];
  routes?: IClientRoute[];
}

export interface IRoutesById {
  [id: string]: IRoute;
}

export interface IRouteComponents {
  [id: string]: any;
}

export interface RenderClientOpts {
  /**
   * react dom 渲染的的目标 dom
   * @doc 一般不需要改，微前端的时候会变化
   */
  rootElement?: HTMLElement;
  /**
   * 设置路由 base，部署项目到非根目录下时使用。
   */
  basename?: string;
  /**
   * loading 中展示的组件 dom （全局加载组件）。
   */
  loadingComponent?: () => React.ReactNode;
  /**
   * 自定义错误边界组件
   */
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export interface IMemo {
  id: number;
  ret: any;
}
