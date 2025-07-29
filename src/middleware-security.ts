import { NextRequest, NextResponse } from "next/server";
import {
	checkRateLimit,
	logSecurityEvent,
	securityHeaders,
} from "./lib/security";

export function securityMiddleware(request: NextRequest) {
	const response = NextResponse.next();

	// ===== HEADERS DE SÉCURITÉ =====
	Object.entries(securityHeaders).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	// ===== RATE LIMITING =====
	const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
	const userAgent = request.headers.get("user-agent") || "unknown";
	const identifier = `${ip}-${userAgent}`;

	// Rate limiting pour les routes sensibles
	const sensitiveRoutes = [
		"/api/auth/login",
		"/api/auth/register",
		"/api/contact",
	];
	const isSensitiveRoute = sensitiveRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	if (isSensitiveRoute) {
		const allowed = checkRateLimit(identifier, 5, 60 * 1000); // 5 tentatives par minute

		if (!allowed) {
			logSecurityEvent(
				"RATE_LIMIT_EXCEEDED",
				{
					ip,
					path: request.nextUrl.pathname,
					userAgent,
				},
				ip
			);

			return NextResponse.json(
				{ error: "Trop de tentatives. Réessayez dans 1 minute." },
				{ status: 429 }
			);
		}
	}

	// ===== PROTECTION CONTRE LES ATTACKS =====
	const userAgentHeader = request.headers.get("user-agent");
	if (userAgentHeader) {
		// Bloquer les user agents suspects
		const suspiciousPatterns = [
			/bot/i,
			/crawler/i,
			/spider/i,
			/scraper/i,
			/sqlmap/i,
			/nikto/i,
			/nmap/i,
		];

		const isSuspicious = suspiciousPatterns.some((pattern) =>
			pattern.test(userAgentHeader)
		);

		if (isSuspicious) {
			logSecurityEvent(
				"SUSPICIOUS_USER_AGENT",
				{
					userAgent: userAgentHeader,
					path: request.nextUrl.pathname,
				},
				ip
			);

			return NextResponse.json(
				{ error: "Accès non autorisé" },
				{ status: 403 }
			);
		}
	}

	// ===== PROTECTION CONTRE LES REQUÊTES MALFORMÉES =====
	const contentType = request.headers.get("content-type");
	if (
		request.method === "POST" &&
		contentType &&
		!contentType.includes("application/json")
	) {
		logSecurityEvent(
			"INVALID_CONTENT_TYPE",
			{
				contentType,
				path: request.nextUrl.pathname,
			},
			ip
		);

		return NextResponse.json(
			{ error: "Type de contenu non autorisé" },
			{ status: 400 }
		);
	}

	// ===== LOGGING DES ÉVÉNEMENTS SÉCURITÉ =====
	if (
		request.method === "POST" ||
		request.method === "PUT" ||
		request.method === "DELETE"
	) {
		logSecurityEvent(
			"API_REQUEST",
			{
				method: request.method,
				path: request.nextUrl.pathname,
				hasAuth:
					!!request.headers.get("authorization") ||
					!!request.cookies.get("auth-token"),
			},
			ip
		);
	}

	return response;
}
