import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		// Désactiver temporairement la vérification de types pour le build
		ignoreBuildErrors: true,
	},
	eslint: {
		// Désactiver temporairement ESLint pour le build
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				port: "",
				pathname: "/images/**",
			},
		],
	},
};

export default nextConfig;
