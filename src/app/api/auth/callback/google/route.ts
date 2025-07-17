import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// SUPPRIMÉ : instanciation globale du client Google
// const client = new OAuth2Client({ ... });

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const code = searchParams.get("code");

		if (!code) {
			return NextResponse.redirect(
				new URL("/login?error=google_auth_failed", request.url)
			);
		}

		// Instanciation du client Google DANS le handler
		const client = new OAuth2Client({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
		});

		// Échanger le code contre un token d'accès
		const { tokens } = await client.getToken(code);
		client.setCredentials(tokens);

		// Obtenir les informations de l'utilisateur depuis Google
		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		if (!payload) {
			return NextResponse.redirect(
				new URL("/login?error=google_auth_failed", request.url)
			);
		}

		const { email, name, given_name, family_name } = payload;

		if (!email) {
			return NextResponse.redirect(
				new URL("/login?error=google_auth_failed", request.url)
			);
		}

		// Vérifier si l'utilisateur existe déjà
		let user = await prisma.user.findUnique({
			where: { email },
			include: { profile: true },
		});

		if (!user) {
			// Créer un nouvel utilisateur
			user = await prisma.user.create({
				data: {
					email,
					emailVerified: new Date(), // L'email Google est déjà vérifié
					profile: {
						create: {
							firstName: given_name || "",
							lastName: family_name || "",
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

		// Créer ou mettre à jour l'entrée Account pour Google
		const existingAccount = await prisma.account.findFirst({
			where: {
				userId: user.id,
				provider: "google",
			},
		});
		if (!existingAccount) {
			await prisma.account.create({
				data: {
					userId: user.id,
					provider: "google",
					providerAccountId: email,
					type: "oauth",
				},
			});
		}

		// Créer le token JWT
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				name:
					user.profile?.firstName && user.profile?.lastName
						? `${user.profile.firstName} ${user.profile.lastName}`
						: name || user.email,
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

		return response;
	} catch (error) {
		console.error("Erreur lors du callback Google:", error);
		return NextResponse.redirect(
			new URL("/login?error=google_auth_failed", request.url)
		);
	}
}
