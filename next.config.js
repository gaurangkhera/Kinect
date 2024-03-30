/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                "hostname": "files.edgestore.dev",
            },
            {
                hostname: "img.clerk.com"
            }
        ],
    }
}

module.exports = nextConfig
