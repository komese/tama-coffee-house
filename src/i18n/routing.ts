import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ja', 'en', 'zh-TW'],
  defaultLocale: 'ja',
  localePrefix: 'as-needed'
});
