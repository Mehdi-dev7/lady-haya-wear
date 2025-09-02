import { NextRequest, NextResponse } from "next/server";
import { securityMiddleware } from "./middleware-security";

export function middleware(request: NextRequest) {
	// ===== SÉCURITÉ GLOBALE =====
	const securityResponse = securityMiddleware(request);
	if (securityResponse.status !== 200) {
		return securityResponse;
	}

	// ===== PROTECTION DES ROUTES UTILISATEUR =====
	const protectedRoutes = ["/account", "/orders", "/checkout", "/cart"];

	// Vérifier si la route actuelle est protégée pour les utilisateurs
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	if (isProtectedRoute) {
		// Vérifier les cookies de session
		const hasSession =
			request.cookies.has("next-auth.session-token") ||
			request.cookies.has("__Secure-next-auth.session-token") ||
			request.cookies.has("auth-token");

		if (!hasSession) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// ===== PROTECTION DES ROUTES ADMIN =====
	const adminRoutes = ["/dashboard", "/studio"];

	// Vérifier si la route actuelle est une route admin
	const isAdminRoute = adminRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	if (isAdminRoute) {
		// Vérifier le cookie d'authentification admin
		const hasAdminToken = request.cookies.has("admin-token");

		if (!hasAdminToken) {
			const loginUrl = new URL("/admin-login", request.url);
			loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return securityResponse;
}

export const config = {
	matcher: [
		"/account/:path*",
		"/orders/:path*",
		"/checkout/:path*",
		"/cart/:path*",
		"/dashboard/:path*",
		"/studio/:path*",
	],
};
