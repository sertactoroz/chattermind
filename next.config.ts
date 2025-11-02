import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
   devIndicators: false, // Hide  bottom-Left Next.js Icon 
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);