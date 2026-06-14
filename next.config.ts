import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
   devIndicators: false, // Hide bottom-left Next.js icon
   async headers() {
      return [
         {
            source: '/:path*',
            headers: [
               {
                  key: 'Cross-Origin-Opener-Policy',
                  value: 'same-origin-allow-popups',
               },
            ],
         },
      ];
   },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
