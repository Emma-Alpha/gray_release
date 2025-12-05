import type { SiderRoutesProps } from '@store/types';
import _ from 'lodash-es';
import { create } from 'zustand';
import {
  apiGetCopyright,
  apiGetCurrentUser,
  apiGetModule,
  apiGetNav,
} from './indexApi';
import type { BearState, MicroActiveAppsProps } from './types';

function addApp(stateMicroActiveApps, appInfo, set) {
  // 如果已存在相同 id，则不处理
  if (stateMicroActiveApps.find(o => o.id === appInfo.id)) return;
  stateMicroActiveApps.push(appInfo);
  set({ microActiveApps: stateMicroActiveApps });
}

function removeApp(stateMicroActiveApps, appInfo, set) {
  const removeIndex = stateMicroActiveApps.findIndex(o => o.id === appInfo.id);
  if (removeIndex === -1) return;
  stateMicroActiveApps.splice(removeIndex, 1);
  set({ microActiveApps: stateMicroActiveApps });
}

function updateApp(stateMicroActiveApps, appInfo, set) {
  const updateIndex = stateMicroActiveApps.findIndex(o => o.id === appInfo.id);
  if (updateIndex === -1) return;
  stateMicroActiveApps[updateIndex] = appInfo;
  set({ microActiveApps: stateMicroActiveApps });
}

const useGlobalStore = create<BearState>()((set, get) => ({
  year: {
    s: '0',
    e: '0',
  },
  currentUser: {},
  navCode: [],
  microActiveApps: [],
  siderRoutes: {}, // 侧边栏路由配置
  getYearData: async (params: any) => {
    const { data } = await apiGetCopyright(params);
    set({ year: data.year });
  },
  syncGetCurrentUser: (params: any) => {
    apiGetCurrentUser(params).then(res => {
      const { data } = res;
      set({ currentUser: data?.user });
    });
  },
  getCurrentUser: async () => {
    const { data } = await apiGetCurrentUser({});
    set({ currentUser: data?.user });
    return { currentUser: data?.user };
  },
  syncGetNav: (params: any) => {
    apiGetNav(params).then(res => {
      const { data } = res;
      set({ navCode: data });
    });
  },
  getNav: async (params: any) => {
    const { data } = await apiGetNav(params);
    set({ navCode: data });
    return { navCode: data };
  },
  modules: [],
  syncGetModule: (params: any) => {
    apiGetModule(params).then(res => {
      const { data } = res;
      set({ modules: data });
    });
  },
  // 获取各个模块的信息 [{name: "模块名字", path: "激活路径", "perarr": "权限位", id: "xx", defaultroute: "应用默认打开路由"}]
  getModule: async (params: any) => {
    const { data } = await apiGetModule(params);
    set({ modules: data });
    return { modules: data };
  },
  getBasicInfo: async (params: any) => {
    try {
      const getCurrentUser = get().getCurrentUser;
      const currentUserRes = await getCurrentUser(params);
      const getNav = get().getNav;
      const navCodeRes = await getNav(params);
      const getModule = get().getModule;
      const modulesRes = await getModule(params);
      return {
        ...currentUserRes,
        ...navCodeRes,
        ...modulesRes,
      };
    } catch (error: any) {
      console.log(error);
      return {
        currentUser: '',
        navCode: [],
        modules: [],
      };
    }
  },
  layout: {
    renderFooter: false,
    renderHeader: true,
    renderSider: true,
  },
  setLayout: (params: BearState['layout']) => {
    const stateLayout = get().layout;
    set({ layout: { ...stateLayout, ...params } });
  },
  setMicroActiveApps: (params: MicroActiveAppsProps) => {
    const { action, appInfo } = params;
    const stateMicroActiveApps = _.cloneDeep(get().microActiveApps);
    switch (action) {
      case 'add':
        addApp(stateMicroActiveApps, appInfo, set);
        return;
      case 'delete':
        removeApp(stateMicroActiveApps, appInfo, set);
        return;
      case 'update':
        updateApp(stateMicroActiveApps, appInfo, set);
        return;
    }
  },
  setSiderRoutes: (params: SiderRoutesProps) => {
    const stateSiderRoutes = get().siderRoutes;
    set({ siderRoutes: { ...stateSiderRoutes, ...params } });
  },
}));

export default useGlobalStore;
