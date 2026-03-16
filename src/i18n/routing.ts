import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ja', 'en', 'zh-TW', 'ko', 'pt-BR', 'de', 'fr', 'es', 'it', 'th'],
  defaultLocale: 'ja',
  localePrefix: 'as-needed'
});
