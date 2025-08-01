import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get("code");
		const state = searchParams.get("state");
		const error = searchParams.get("error");

		// Vérifier s'il y a une erreur
		if (error) {
			console.error("Erreur Facebook OAuth:", error);
			return NextResponse.redirect("/login?error=facebook_auth_failed");
		}

		// Vérifier le code d'autorisation
		if (!code) {
			console.error("Code d'autorisation manquant");
			return NextResponse.redirect("/login?error=facebook_code_missing");
		}

		// Vérifier le state pour la sécurité
		const cookieStore = await cookies();
		const storedState = cookieStore.get("fb_state")?.value;

		if (!storedState || state !== storedState) {
			console.error("State invalide");
			return NextResponse.redirect("/login?error=facebook_state_invalid");
		}

		// Échanger le code contre un token d'accès
		const tokenResponse = await fetch(
			"https://graph.facebook.com/v18.0/oauth/access_token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_id: FACEBOOK_APP_ID!,
					client_secret: FACEBOOK_APP_SECRET!,
					code: code,
					redirect_uri:
						process.env.NODE_ENV === "production"
							? "https://lady-haya-wear.vercel.app/api/auth/facebook/callback"
							: "http://localhost:3000/api/auth/facebook/callback",
				}),
			}
		);

		if (!tokenResponse.ok) {
			console.error(
				"Erreur lors de l'échange du token:",
				await tokenResponse.text()
			);
			return NextResponse.redirect("/login?error=facebook_token_failed");
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;

		// Récupérer les informations de l'utilisateur Facebook
		const userResponse = await fetch(
			`https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`
		);

		if (!userResponse.ok) {
			console.error(
				"Erreur lors de la récupération des données utilisateur:",
				await userResponse.text()
			);
			return NextResponse.redirect("/login?error=facebook_user_data_failed");
		}

		const userData = await userResponse.json();

		// Vérifier que l'email est présent
		if (!userData.email) {
			console.error("Email non fourni par Facebook");
			return NextResponse.redirect("/login?error=facebook_email_missing");
		}

		// Récupérer les informations Instagram si disponibles
		let instagramData = null;
		try {
			const instagramResponse = await fetch(
				`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
			);

			if (instagramResponse.ok) {
				const instagramResult = await instagramResponse.json();
				if (instagramResult.data && instagramResult.data.length > 0) {
					const instagramAccount =
						instagramResult.data[0].instagram_business_account;
					if (instagramAccount) {
						const instagramUserResponse = await fetch(
							`https://graph.facebook.com/v18.0/${instagramAccount.id}?fields=id,username,account_type&access_token=${accessToken}`
						);
						if (instagramUserResponse.ok) {
							instagramData = await instagramUserResponse.json();
						}
					}
				}
			}
		} catch (error) {
			console.log("Instagram non connecté ou non disponible");
		}

		// Créer ou mettre à jour l'utilisateur dans votre base de données
		const user = {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			picture: userData.picture?.data?.url,
			provider: "facebook",
			instagram: instagramData
				? {
						id: instagramData.id,
						username: instagramData.username,
						accountType: instagramData.account_type,
					}
				: null,
		};

		// TODO: Intégrer avec votre système d'authentification
		// - Vérifier si l'utilisateur existe déjà
		// - Créer ou mettre à jour l'utilisateur
		// - Créer une session

		console.log("Utilisateur Facebook connecté:", user);

		// Rediriger vers la page de succès
		const response = NextResponse.redirect("/account?success=facebook_login");

		// Nettoyer le cookie de state
		response.cookies.delete("fb_state");

		return response;
	} catch (error) {
		console.error("Erreur lors du callback Facebook:", error);
		return NextResponse.redirect("/login?error=facebook_callback_failed");
	}
}
