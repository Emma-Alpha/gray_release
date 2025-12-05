import { Layout as AntdLayout } from "antd";
import React from "react";
import { Outlet } from "react-router";

const BaseLayout = () => {
  return (
    <AntdLayout className="flex !flex-col h-full w-full">
      <Outlet />
    </AntdLayout>
  );
};
export default BaseLayout;
