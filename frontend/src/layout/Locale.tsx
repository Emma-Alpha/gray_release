import { ConfigProvider } from 'antd';
import type { Locale as AntdLocale } from 'antd/es/locale';
import dayjs from 'dayjs';
import React, {
  type PropsWithChildren,
  memo,
  useEffect,
  useState,
} from 'react';

import { isRtlLang } from 'rtl-detect';

import { createI18nNext } from '@/locales/create';
import { getAntdLocale } from '@/utils/locale';

const updateDayjs = async (lang: string) => {
  // load default lang
  let dayJSLocale: any;
  try {
    // dayjs locale is using `en` instead of `en-US`
    // refs: https://github.com/lobehub/lobe-chat/issues/3396
    const locale = lang.toLowerCase() === 'en-us' ? 'en' : lang.toLowerCase();

    dayJSLocale = await import(`dayjs/locale/${locale}.js`);
  } catch {
    console.warn(`dayjs locale for ${lang} not found, fallback to en`);
    dayJSLocale = await import('dayjs/locale/en.js');
  }

  dayjs.locale(dayJSLocale.default);
};

interface LocaleLayoutProps extends PropsWithChildren {
  antdLocale?: unknown;
  defaultLang?: string;
}

const Locale = memo<LocaleLayoutProps>(
  ({ children, defaultLang, antdLocale }) => {
    const [i18n] = useState(createI18nNext(defaultLang));
    const [lang, setLang] = useState(defaultLang);
    const [locale, setLocale] = useState(antdLocale);

    console.log(antdLocale, defaultLang);

    // if on browser side, init i18n instance only once
    if (!i18n.instance.isInitialized)
      // console.debug('locale', lang);
      i18n.init().then(async () => {
        if (!lang) return;

        await updateDayjs(lang);
      });

    // handle i18n instance language change
    useEffect(() => {
      const handleLang = async (lng: string) => {
        setLang(lng);

        if (lang === lng) return;

        const newLocale = await getAntdLocale(lng);
        setLocale(newLocale);

        await updateDayjs(lng);
      };

      i18n.instance.on('languageChanged', handleLang);
      return () => {
        i18n.instance.off('languageChanged', handleLang);
      };
    }, [i18n, lang]);

    // detect document direction
    const documentDir = isRtlLang(lang) ? 'rtl' : 'ltr';

    console.log(documentDir, locale);

    return (
      <ConfigProvider direction={documentDir} locale={locale as AntdLocale}>
        {children}
      </ConfigProvider>
    );
  },
);

Locale.displayName = 'Locale';

export default Locale;
