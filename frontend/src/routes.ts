import type { RoutesTree } from "@store/types";

// 配置式路由
export const routes: RoutesTree[] = [
  {
    path: "",
    component: "layout/MainContentWrap",
    routes: [
      {
        path: "/",
        redirect: "/gray",
      },
      {
        component: "layout/BaseLayout.tsx",
        routes: [
          {
            path: "",
            component: "pages/base/layout.tsx",
            routes: [
              {
                path: "/base",
                component: "pages/base/page.tsx",
                props: {
                  name: "base",
                  title: "基础页面",
                },
              },
            ],
          },
          // 灰度发布管理路由
          {
            path: "",
            component: "pages/gray/layout.tsx",
            routes: [
              {
                path: "/gray",
                component: "pages/gray/page.tsx",
                props: {
                  name: "gray",
                  title: "灰度发布管理",
                },
              },
            ],
          },
          {
            path: "*",
            component: "pages/404/page.tsx",
          },
        ],
      },
    ],
  },
];

// 约定式路由
// export const routes: RoutesTree[] = [];
