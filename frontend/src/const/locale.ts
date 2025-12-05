import { supportLocales } from '@/locales/resources';

export const DEFAULT_LANG = 'zh-CN';

/**
 * Check if the language is supported
 * @param locale
 */
export const isLocaleNotSupport = (locale: string) => !supportLocales.includes(locale);
