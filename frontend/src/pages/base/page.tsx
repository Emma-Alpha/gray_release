import { useThemeStore } from '@store/theme';
import { Button } from 'antd';
import React from 'react';

export default function BasePage() {
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);

  return (
    <>
      <Button type="primary">antd按钮</Button>
      <button
        type="button"
        className={
          ' dark:text-red-600 dark:bg-[var(--tailwindssantd-color-primary)] bg-[var(--tailwindssantd-color-primary)]'
        }
      >
        tailwind按钮
      </button>
      <button type="button" onClick={() => setTheme('dark')}>
        切换主题({theme})
      </button>
    </>
  );
}
