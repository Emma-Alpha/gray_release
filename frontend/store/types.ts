interface SiderRoutesItem {
  path: string;
  name: string;
  id: string;
  icon: any;
  perarr: string;
  children?: SiderRoutesItem[];
}

export interface SiderRoutesProps {
  name?: string;
  routes?: SiderRoutesItem[];
}

export interface IBestAFSRoute {
  /**
   * @description 菜单上显示的名称，没有则不展示该菜单。
   */
  name?: string;
  /**
   * @description icon 图标。
   */
  icon?: any;
  /**
   * @description 权限位。
   */
  perarr?: string;
  /**
   * @name false 时不显示顶栏
   */
  headerRender?: boolean;
  /**
   * @name false 时不显示页脚
   */
  footerRender?: false;
  /**
   * @name false 时不显示菜单
   */
  menuRender?: false;
  /**
   * @name false 时不显示菜单的 title 和 logo
   */
  menuHeaderRender?: false;
  /**
   * @name false 时隐藏子菜单
   */
  hideChildrenInMenu?: false;
  /**
   * @name false 时隐藏自己和子菜单
   */
  hideInMenu?: false;
  /**
   * @name false 时不跳过权限认证
   */
  skipAuth?: boolean;
  /**
   * @name string 归属某个具体的分类
   */
  category?: string;
  /**
   * @name string 路由的 title
   */
  title?: string;
}

// 定义路由的数据结构
export interface RoutesTree {
  key?: string;
  path?: string;
  wrappers?: string[];
  component?: string | (() => React.JSX.Element);
  routes?: RoutesTree[];
  microApp?: string;
  entry?: string;
  redirect?: string;
  props?: IBestAFSRoute;
}

export interface ApiParams {
  id: string | number[] | string[] | number;
  action: string;
  data: any;
}
