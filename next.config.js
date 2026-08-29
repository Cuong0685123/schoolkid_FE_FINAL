/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            }
        ],
        minimumCacheTTL: 2592000, // Cache ảnh 30 ngày trên Vercel CDN
    },
    async redirects() {
        return [
            {
                source: '/apps/mail',
                destination: '/apps/mail/inbox',
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;