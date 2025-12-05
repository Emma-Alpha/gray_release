import { ConfigProvider, theme } from 'antd';
import type { Locale as AntdLocale } from 'antd/es/locale';
import React, { useState, useEffect } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import '../index.css';
import { DEFAULT_LANG } from '@/const/locale';
import { useRouteTitle } from '@/hooks/useRouteTitle';
import { getAntdLocale } from '@/utils/locale';
import queryString from 'query-string';
import Locale from './Locale';
import AppTheme from './ThemeContext';

import '@ant-design/v5-patch-for-react-19';

export const MainContentWrap = () => {
  useRouteTitle();
  const [antdLocale, setAntdLocale] = useState<unknown>(null);
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);

  const { lang } = queryString.parse(location.search);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        gcTime: 0,
      },
    },
  });

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const loadedLocale = await getAntdLocale(
          (lang as string) ?? DEFAULT_LANG,
        );
        setAntdLocale(loadedLocale);
      } catch (error) {
        console.error('Failed to load locale:', error);
        // 保持默认的中文 locale
      } finally {
        setIsLocaleLoaded(true);
      }
    };

    loadLocale();
  }, [lang]);

  // 可以添加一个加载状态
  if (!isLocaleLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <AppTheme>
      <Locale
        antdLocale={antdLocale}
        defaultLang={lang ? (lang as string) : DEFAULT_LANG}
      >
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </Locale>
    </AppTheme>
  );
};

export default MainContentWrap;
