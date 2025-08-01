import { NextRequest, NextResponse } from "next/server";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const REDIRECT_URI =
	process.env.NODE_ENV === "production"
		? "https://ladyhaya-wear.fr/api/auth/facebook/callback"
		: "http://localhost:3000/api/auth/facebook/callback";

export async function GET(request: NextRequest) {
	try {
		// Générer un state aléatoire pour la sécurité
		const state = Math.random().toString(36).substring(7);

		// Construire l'URL d'autorisation Facebook
		const authUrl =
			`https://www.facebook.com/v18.0/dialog/oauth?` +
			`client_id=${FACEBOOK_APP_ID}` +
			`&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
			`&state=${state}` +
			`&scope=email,public_profile,instagram_basic`;

		// Stocker le state dans un cookie sécurisé
		const response = NextResponse.redirect(authUrl);
		response.cookies.set("fb_state", state, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 300, // 5 minutes
		});

		return response;
	} catch (error) {
		console.error("Erreur lors de l'initialisation de l'auth Facebook:", error);
		return NextResponse.redirect("/login?error=facebook_init_failed");
	}
}
