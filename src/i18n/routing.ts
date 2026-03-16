import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ja', 'en', 'zh-TW', 'ko'],
  defaultLocale: 'ja',
  localePrefix: 'as-needed'
});
