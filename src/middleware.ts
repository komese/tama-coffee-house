import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // api, _next, _vercel, および拡張子を含む静的ファイル（.*\\..*）を完全に除外し、
    // それ以外の全てのリクエスト（/, /ja/bbs 等）のみミドルウェアを実行する
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
