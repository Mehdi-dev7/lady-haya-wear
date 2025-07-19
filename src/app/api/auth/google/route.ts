import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

const client = new OAuth2Client({
	clientId: process.env.GOOGLE_CLIENT_ID!,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
	redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
});

export async function GET(request: NextRequest) {
	try {
		// Vérifier les variables d'environnement
		if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
			return NextResponse.json(
				{ error: "Configuration Google OAuth manquante" },
				{ status: 500 }
			);
		}

		// Générer l'URL d'authentification Google
		const authUrl = client.generateAuthUrl({
			access_type: "offline",
			scope: ["profile", "email"],
			include_granted_scopes: true,
			prompt: "select_account", // Ajout pour forcer le choix du compte
		});

		// Rediriger vers Google OAuth
		return NextResponse.redirect(authUrl);
	} catch (error) {
		console.error("Erreur lors de l'authentification Google:", error);
		return NextResponse.json(
			{ error: "Erreur lors de l'authentification Google" },
			{ status: 500 }
		);
	}
}
