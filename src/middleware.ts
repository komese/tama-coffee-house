import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(ja|en|zh-TW|ko|pt-BR|de|fr|es|it|th)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
