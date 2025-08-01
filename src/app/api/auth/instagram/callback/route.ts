import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get("code");
		const state = searchParams.get("state");
		const error = searchParams.get("error");

		// Vérifier s'il y a une erreur
		if (error) {
			console.error("Erreur Instagram OAuth:", error);
			return NextResponse.redirect("/login?error=instagram_auth_failed");
		}

		// Vérifier le code d'autorisation
		if (!code) {
			console.error("Code d'autorisation manquant");
			return NextResponse.redirect("/login?error=instagram_code_missing");
		}

		// Vérifier le state pour la sécurité
		const cookieStore = await cookies();
		const storedState = cookieStore.get("ig_state")?.value;
		
		if (!storedState || state !== storedState) {
			console.error("State invalide");
			return NextResponse.redirect("/login?error=instagram_state_invalid");
		}

		// Échanger le code contre un token d'accès
		const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: INSTAGRAM_APP_ID!,
				client_secret: INSTAGRAM_APP_SECRET!,
				grant_type: "authorization_code",
				redirect_uri: process.env.NODE_ENV === "production"
					? "https://lady-haya-wear.vercel.app/api/auth/instagram/callback"
					: "http://localhost:3000/api/auth/instagram/callback",
				code: code,
			}),
		});

		if (!tokenResponse.ok) {
			console.error("Erreur lors de l'échange du token:", await tokenResponse.text());
			return NextResponse.redirect("/login?error=instagram_token_failed");
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;
		const userId = tokenData.user_id;

		// Récupérer les informations de l'utilisateur Instagram
		const userResponse = await fetch(
			`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
		);

		if (!userResponse.ok) {
			console.error("Erreur lors de la récupération des données utilisateur:", await userResponse.text());
			return NextResponse.redirect("/login?error=instagram_user_data_failed");
		}

		const userData = await userResponse.json();

		// Créer ou mettre à jour l'utilisateur dans votre base de données
		const user = {
			id: userData.id,
			username: userData.username,
			accountType: userData.account_type,
			provider: "instagram",
		};

		// TODO: Intégrer avec votre système d'authentification
		// - Vérifier si l'utilisateur existe déjà
		// - Créer ou mettre à jour l'utilisateur
		// - Créer une session

		console.log("Utilisateur Instagram connecté:", user);

		// Rediriger vers la page de succès
		const response = NextResponse.redirect("/account?success=instagram_login");
		
		// Nettoyer le cookie de state
		response.cookies.delete("ig_state");

		return response;

	} catch (error) {
		console.error("Erreur lors du callback Instagram:", error);
		return NextResponse.redirect("/login?error=instagram_callback_failed");
	}
} 