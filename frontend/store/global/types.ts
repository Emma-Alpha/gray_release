import type { SiderRoutesProps } from '@store/types';

export interface YearProps {
  s: string;
  e: string;
}

export interface moduleItemProps {
  defaultroute?: string;
  id: string;
  name: string;
  path: string;
  perarr: string;
}

export interface currentUserProps {
  apipasswd?: string;
  cname?: string;
  email?: string;
  name?: string;
  stype?: string;
}

export interface BearState {
  year: YearProps;
  getYearData: (params: any) => Promise<void>;
  currentUser: currentUserProps;
  getCurrentUser: (params: any) => Promise<{ currentUser: currentUserProps }>;
  navCode: string[];
  getNav: (params: any) => Promise<{ navCode: string[] }>;
  modules: moduleItemProps[];
  getModule: (params: any) => Promise<{ modules: moduleItemProps[] }>;
  getBasicInfo: (params: any) => Promise<BasicInfoResponse>;

  layout: {
    renderSider?: boolean;
    renderHeader?: boolean;
    renderFooter?: boolean;
  };

  setLayout: (params: BearState['layout']) => void;

  syncGetCurrentUser: (params: any) => void;
  syncGetNav: (params: any) => void;
  syncGetModule: (params: any) => void;

  microActiveApps: any[];
  setMicroActiveApps: (params: MicroActiveAppsProps) => void;
  siderRoutes: SiderRoutesProps;
  setSiderRoutes: (params: SiderRoutesProps) => void;
}

export interface MicroActiveAppsProps {
  action: 'add' | 'delete' | 'update';
  appInfo: any;
}

export interface BasicInfoResponse {
  currentUser: Object;
  navCode: string[];
  modules: moduleItemProps[];
}
