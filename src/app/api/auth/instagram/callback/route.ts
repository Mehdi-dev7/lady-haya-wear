import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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
		const tokenResponse = await fetch(
			"https://api.instagram.com/oauth/access_token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_id: INSTAGRAM_APP_ID!,
					client_secret: INSTAGRAM_APP_SECRET!,
					grant_type: "authorization_code",
					redirect_uri:
						process.env.NODE_ENV === "production"
							? "https://lady-haya-wear.vercel.app/api/auth/instagram/callback"
							: "http://localhost:3000/api/auth/instagram/callback",
					code: code,
				}),
			}
		);

		if (!tokenResponse.ok) {
			console.error(
				"Erreur lors de l'échange du token:",
				await tokenResponse.text()
			);
			return NextResponse.redirect("/login?error=instagram_token_failed");
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;
		const userId = tokenData.user_id;

		// Récupérer les informations de l'utilisateur Instagram avec la nouvelle API
		const userResponse = await fetch(
			`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
		);

		if (!userResponse.ok) {
			console.error(
				"Erreur lors de la récupération des données utilisateur:",
				await userResponse.text()
			);
			return NextResponse.redirect("/login?error=instagram_user_data_failed");
		}

		const userData = await userResponse.json();

		console.log("Données Instagram reçues:", userData);

		// Créer un email unique basé sur l'ID Instagram
		const instagramEmail = `instagram_${userData.id}@lady-haya-wear.com`;

		// Formater le nom d'utilisateur pour un meilleur affichage
		const formatUsername = (username: string) => {
			// Capitaliser la première lettre
			return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
		};

		// Vérifier si l'utilisateur existe déjà via l'Account Instagram
		let user = await prisma.user.findFirst({
			where: {
				accounts: {
					some: {
						provider: "instagram",
						providerAccountId: userData.id,
					},
				},
			},
			include: { profile: true },
		});

		if (!user) {
			// Créer un nouvel utilisateur
			user = await prisma.user.create({
				data: {
					email: instagramEmail,
					emailVerified: new Date(), // L'email Instagram est considéré comme vérifié
					profile: {
						create: {
							firstName: formatUsername(userData.username || "Utilisateur"),
							lastName: "Instagram",
						},
					},
				},
				include: { profile: true },
			});
		} else {
			// Marquer l'email comme vérifié si ce n'est pas déjà fait
			if (!user.emailVerified) {
				await prisma.user.update({
					where: { id: user.id },
					data: { emailVerified: new Date() },
				});
			}
		}

		// Créer ou mettre à jour l'entrée Account pour Instagram
		const existingAccount = await prisma.account.findFirst({
			where: {
				userId: user.id,
				provider: "instagram",
			},
		});

		if (!existingAccount) {
			await prisma.account.create({
				data: {
					userId: user.id,
					provider: "instagram",
					providerAccountId: userData.id,
					type: "oauth",
					access_token: accessToken,
					scope: "instagram_business_basic", // Nouveau scope
				},
			});
		} else {
			// Mettre à jour le token d'accès
			await prisma.account.update({
				where: { id: existingAccount.id },
				data: {
					access_token: accessToken,
					scope: "instagram_business_basic", // Mettre à jour le scope
				},
			});
		}

		// Créer le token JWT avec des informations plus claires
		const displayName = user.profile?.firstName
			? `${user.profile.firstName} ${user.profile.lastName || ""}`.trim()
			: formatUsername(userData.username || "Utilisateur");

		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				name: displayName,
				provider: "instagram",
				instagramUsername: userData.username,
			},
			process.env.NEXTAUTH_SECRET!,
			{ expiresIn: "7d" }
		);

		// Rediriger vers la page d'accueil avec le cookie de session
		const response = NextResponse.redirect(new URL("/", request.url));
		response.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60, // 7 jours
		});

		// Nettoyer le cookie de state
		response.cookies.delete("ig_state");

		return response;
	} catch (error) {
		console.error("Erreur lors du callback Instagram:", error);
		return NextResponse.redirect("/login?error=instagram_callback_failed");
	}
}
