import { Redis } from "@upstash/redis";

/**
 * Client Redis Upstash pour rate limiting et cache
 *
 * Configuration serverless optimisée pour Vercel
 * - Partagé entre toutes les instances
 * - Persistant (survit aux redémarrages)
 * - Latence ultra-faible (<5ms)
 */

// Vérifier que les variables d'environnement sont présentes
if (!process.env.UPSTASH_REDIS_REST_URL) {
	throw new Error("UPSTASH_REDIS_REST_URL is not defined");
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
	throw new Error("UPSTASH_REDIS_REST_TOKEN is not defined");
}

export const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
