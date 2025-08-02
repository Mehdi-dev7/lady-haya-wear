import { NextRequest, NextResponse } from "next/server";

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const REDIRECT_URI =
	process.env.NODE_ENV === "production"
		? "https://lady-haya-wear.vercel.app/api/auth/instagram/callback"
		: "http://localhost:3000/api/auth/instagram/callback";

export async function GET(request: NextRequest) {
	try {
		// Générer un state aléatoire pour la sécurité
		const state = Math.random().toString(36).substring(7);

		// Construire l'URL d'autorisation Instagram avec la nouvelle API
		const authUrl =
			`https://api.instagram.com/oauth/authorize?` +
			`client_id=${INSTAGRAM_APP_ID}` +
			`&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
			`&scope=instagram_business_basic` + // Nouveau scope pour Instagram API
			`&response_type=code` +
			`&state=${state}`;

		// Stocker le state dans un cookie sécurisé
		const response = NextResponse.redirect(authUrl);
		response.cookies.set("ig_state", state, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 300, // 5 minutes
		});

		return response;
	} catch (error) {
		console.error(
			"Erreur lors de l'initialisation de l'auth Instagram:",
			error
		);
		return NextResponse.redirect("/login?error=instagram_init_failed");
	}
}
