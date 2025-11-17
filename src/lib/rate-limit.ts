import { redis } from "./redis";
import { logSecurityEvent } from "./security";

/**
 * Rate Limiting avec Redis (Upstash)
 *
 * Système de limitation de requêtes partagé entre toutes les instances
 * - Utilise Redis pour le stockage distribué
 * - Expiration automatique (TTL)
 * - Incrémentation atomique (thread-safe)
 */

export interface RateLimitResult {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number; // Timestamp de réinitialisation
}

/**
 * Vérifie et applique le rate limiting
 *
 * @param identifier - Identifiant unique (ex: "login:192.168.1.1", "promo:user123")
 * @param limit - Nombre maximum de requêtes autorisées
 * @param windowSeconds - Fenêtre de temps en secondes
 * @returns RateLimitResult avec le statut et les informations
 *
 * @example
 * const result = await checkRateLimit("login:192.168.1.1", 5, 900);
 * if (!result.success) {
 *   return Response.json({ error: "Trop de tentatives" }, { status: 429 });
 * }
 */
export async function checkRateLimit(
	identifier: string,
	limit: number,
	windowSeconds: number
): Promise<RateLimitResult> {
	const key = `rate_limit:${identifier}`;

	try {
		// Pipeline Redis pour optimiser (2 commandes en 1 requête)
		const pipeline = redis.pipeline();
		pipeline.incr(key);
		pipeline.ttl(key);

		const results = (await pipeline.exec()) as [number, number];
		const count = results[0];
		const ttl = results[1];

		// Si c'est la première requête (ou clé expirée), définir l'expiration
		if (ttl === -1) {
			await redis.expire(key, windowSeconds);
		}

		// Calculer le timestamp de réinitialisation
		const resetTimestamp =
			Date.now() + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000);

		const success = count <= limit;
		const remaining = Math.max(0, limit - count);

		// Logger si limite atteinte
		if (!success) {
			logSecurityEvent(
				"RATE_LIMIT_EXCEEDED",
				{
					identifier,
					limit,
					count,
					window: windowSeconds,
				},
				identifier
			);
		}

		return {
			success,
			limit,
			remaining,
			reset: resetTimestamp,
		};
	} catch (error) {
		// En cas d'erreur Redis, on laisse passer (fail-open)
		// Mais on log l'erreur
		console.error("[RATE_LIMIT_ERROR]", error);
		logSecurityEvent(
			"RATE_LIMIT_ERROR",
			{
				identifier,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			identifier
		);

		// Retourner success: true pour ne pas bloquer en cas d'erreur Redis
		return {
			success: true,
			limit,
			remaining: limit,
			reset: Date.now() + windowSeconds * 1000,
		};
	}
}

/**
 * Réinitialise le compteur de rate limiting pour un identifiant
 *
 * @param identifier - Identifiant unique
 *
 * @example
 * await resetRateLimit("login:192.168.1.1");
 */
export async function resetRateLimit(identifier: string): Promise<void> {
	const key = `rate_limit:${identifier}`;
	try {
		await redis.del(key);
		logSecurityEvent("RATE_LIMIT_RESET", { identifier }, identifier);
	} catch (error) {
		console.error("[RATE_LIMIT_RESET_ERROR]", error);
	}
}

/**
 * Récupère l'état actuel du rate limiting pour un identifiant
 *
 * @param identifier - Identifiant unique
 * @param limit - Limite maximale
 * @returns RateLimitResult avec le statut actuel
 *
 * @example
 * const status = await getRateLimitStatus("login:192.168.1.1", 5);
 * console.log(`Remaining: ${status.remaining}/${status.limit}`);
 */
export async function getRateLimitStatus(
	identifier: string,
	limit: number
): Promise<RateLimitResult> {
	const key = `rate_limit:${identifier}`;

	try {
		const pipeline = redis.pipeline();
		pipeline.get(key);
		pipeline.ttl(key);

		const results = (await pipeline.exec()) as [number | null, number];
		const count = results[0] || 0;
		const ttl = results[1];

		const resetTimestamp = Date.now() + (ttl > 0 ? ttl * 1000 : 0);
		const remaining = Math.max(0, limit - count);

		return {
			success: count < limit,
			limit,
			remaining,
			reset: resetTimestamp,
		};
	} catch (error) {
		console.error("[RATE_LIMIT_STATUS_ERROR]", error);
		return {
			success: true,
			limit,
			remaining: limit,
			reset: Date.now(),
		};
	}
}

/**
 * Configuration des limites par endpoint
 */
export const RATE_LIMITS = {
	// Authentification
	LOGIN: { limit: 5, window: 900 }, // 5 tentatives / 15 minutes
	REGISTER: { limit: 3, window: 3600 }, // 3 inscriptions / 1 heure
	FORGOT_PASSWORD: { limit: 3, window: 3600 }, // 3 demandes / 1 heure
	RESET_PASSWORD: { limit: 5, window: 3600 }, // 5 reset / 1 heure

	// Promotions
	PROMO_VALIDATE: { limit: 10, window: 3600 }, // 10 validations / 1 heure

	// Newsletter
	NEWSLETTER_SUBSCRIBE: { limit: 3, window: 86400 }, // 3 souscriptions / 1 jour

	// Contact
	CONTACT_FORM: { limit: 5, window: 3600 }, // 5 messages / 1 heure

	// Commandes
	ORDER_CREATE: { limit: 10, window: 3600 }, // 10 commandes / 1 heure

	// Global API
	API_GLOBAL: { limit: 100, window: 900 }, // 100 requêtes / 15 minutes
} as const;
