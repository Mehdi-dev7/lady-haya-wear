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
	// Configuration Turbopack pour spécifier le répertoire racine
	turbopack: {
		root: __dirname,
	},
};

export default nextConfig;
