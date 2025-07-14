import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	// Routes qui nécessitent une authentification
	const protectedRoutes = ["/cart", "/profile", "/orders"];

	// Vérifier si la route actuelle est protégée
	const isProtectedRoute = protectedRoutes.some((route) =>
		req.nextUrl.pathname.startsWith(route)
	);

	if (isProtectedRoute) {
		// Utiliser le système d'authentification personnalisé
		const token = req.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		try {
			// Vérifier le token JWT personnalisé
			jwt.verify(token, process.env.NEXTAUTH_SECRET!);
		} catch (error) {
			// Token invalide, rediriger vers login
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|public|login).*)",
	],
};
