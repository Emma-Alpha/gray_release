import ThemeProvider from '@/components/ThemeProvider';
import { CLOUD_THEME_APPEARANCE } from '@/const/theme';
import { setCookie } from '@/utils/cookie';

// import { useGlobalStore } from "@store/global";
import React, { memo, useEffect, type ReactNode } from 'react';

import { SYSTEM_PREFIX } from '@/const/system';
import { GlobalStyle } from '@/styles';
import { useUserStore } from '@store/user';
import { createStyles } from 'antd-style';
const useStyles = createStyles(({ css, token }) => ({
  app: css`
    position: relative;

    overscroll-behavior: none;
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    min-height: 100dvh;
    max-height: 100dvh;

    @media (min-device-width: 576px) {
      overflow: hidden;
    }
  `,
  // scrollbar-width and scrollbar-color are supported from Chrome 121
  // https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color
  scrollbar: css`
    scrollbar-color: ${token.colorFill} transparent;
    scrollbar-width: thin;

    #lobe-mobile-scroll-container {
      scrollbar-width: none;

      ::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  `,

  // so this is a polyfill for older browsers
  scrollbarPolyfill: css`
    ::-webkit-scrollbar {
      width: 0.75em;
      height: 0.75em;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }

    :hover::-webkit-scrollbar-thumb {
      border: 3px solid transparent;
      background-color: ${token.colorText};
      background-clip: content-box;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `,
}));

interface AppThemeProps {
  children: ReactNode;
}

const AppTheme = memo(({ children }: AppThemeProps) => {
  const themeMode = useUserStore(s => s.themeMode);
  const animationMode = useUserStore(s => s.animationMode);
  const neutralColor = useUserStore(s => s.neutralColor);
  const primaryColor = useUserStore(s => s.primaryColor);
  const { styles, cx } = useStyles();

  useEffect(() => {
    // Update data-theme accordingly if user selects light or dark
    if (themeMode !== 'auto') {
      document.documentElement.dataset.theme = themeMode;
      return;
    }

    // For auto mode, we need to watch system preferences
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on system preference
    document.documentElement.dataset.theme = mediaQuery.matches
      ? 'dark'
      : 'light';

    // Update theme when system preference changes
    function handleChange(e) {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  return (
    <ThemeProvider
      prefixCls={SYSTEM_PREFIX}
      appearance={themeMode !== 'auto' ? themeMode : undefined}
      className={cx(styles.app, styles.scrollbar, styles.scrollbarPolyfill)}
      customTheme={{
        neutralColor: neutralColor,
        primaryColor: primaryColor,
      }}
      theme={{
        cssVar: true,
        token: {
          motion: animationMode !== 'disabled',
          motionUnit: animationMode === 'agile' ? 0.05 : 0.1,
        },
      }}
      themeMode={themeMode}
      onAppearanceChange={appearance => {
        if (themeMode !== 'auto') return;

        setCookie(CLOUD_THEME_APPEARANCE, appearance);
      }}
    >
      {children}
      <GlobalStyle />
    </ThemeProvider>
  );
});

export default AppTheme;
