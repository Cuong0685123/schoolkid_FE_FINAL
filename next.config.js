/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'wsrv.nl',
            },
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
            },

            {
    protocol: 'https',
    hostname: 'images.unsplash.com',
}
        ],
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