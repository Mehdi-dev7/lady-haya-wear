import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Configuration pour les images
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
