import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default intlMiddleware;

export const config = {
  matcher: '/((?!trpc|_next|_vercel|.*\\..*).*)',
};
