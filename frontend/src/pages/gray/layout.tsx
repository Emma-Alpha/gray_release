import React from "react";
import { Outlet } from "react-router";
import { Layout, Space, Tag } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useGrayStyles } from "./style";

const { Header, Content } = Layout;

export default function GrayLayout() {
  const { styles, cx } = useGrayStyles();

  return (
    <Layout className={cx(styles.layout, styles.page)}>
      <Header
        className={cx(styles.header, "flex items-center justify-between px-8")}
      >
        <Space size="large">
          <div className={styles.titleGradient}>🎯 灰度发布管理系统</div>
        </Space>
        <Space>
          <Tag icon={<SafetyCertificateOutlined />} color="processing">
            BFF 驱动
          </Tag>
        </Space>
      </Header>

      <Content className="p-6">
        <Outlet />
      </Content>
    </Layout>
  );
}
