import { render, RenderOptions } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router';

// 创建自定义渲染函数
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ConfigProvider prefixCls='test'>{children}</ConfigProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
