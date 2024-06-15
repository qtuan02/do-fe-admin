/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL_LOCAL: process.env.API_URL_LOCAL,
        API_URL_HOST: process.env.API_URL_HOST,
        PUSHER_KEY: process.env.PUSHER_KEY,
        PUSHER_CLUSTER: process.env.PUSHER_CLUSTER
    },
    reactStrictMode: false
};

export default nextConfig;