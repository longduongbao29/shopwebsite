/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
        BACKEND_URL: process.env.BACKEND_URL,
    },
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: `${process.env.BE_HOST}/api/:path*`, // internally renders this page
    //         },
    //     ];
    // },
}

module.exports = nextConfig
