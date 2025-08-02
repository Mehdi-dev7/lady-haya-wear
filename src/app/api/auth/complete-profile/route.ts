import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, firstName, lastName, phone, provider, tempAuthData } = body;

		console.log("Données reçues:", {
			email,
			firstName,
			lastName,
			phone,
			provider,
		});

		// Validation des données
		if (!email || !firstName || !lastName) {
			console.log("Données manquantes:", { email, firstName, lastName });
			return NextResponse.json(
				{ error: "Email, prénom et nom sont obligatoires" },
				{ status: 400 }
			);
		}

		// Récupérer le token temporaire
		const cookieStore = await cookies();
		const tempToken = cookieStore.get("temp-auth-token")?.value;

		if (!tempToken) {
			console.log("Token temporaire manquant");
			return NextResponse.json({ error: "Session expirée" }, { status: 401 });
		}

		// Vérifier le token temporaire
		let decoded;
		try {
			decoded = jwt.verify(tempToken, process.env.NEXTAUTH_SECRET!) as any;
			console.log("Token décodé:", {
				temporary: decoded.temporary,
				provider: decoded.provider,
			});
		} catch (error) {
			console.error("Erreur de décodage du token:", error);
			return NextResponse.json({ error: "Token invalide" }, { status: 401 });
		}

		if (!decoded.temporary || decoded.provider !== provider) {
			console.log("Token invalide:", {
				temporary: decoded.temporary,
				provider: decoded.provider,
				expectedProvider: provider,
			});
			return NextResponse.json({ error: "Token invalide" }, { status: 401 });
		}

		// Vérifier si l'email existe déjà
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			console.log("Email déjà existant:", email);
			return NextResponse.json(
				{
					error:
						"Un compte avec cet email existe déjà. Veuillez utiliser un autre email ou vous connecter avec ce compte.",
				},
				{ status: 409 }
			);
		}

		// Vérifier si un compte Instagram existe déjà pour cet utilisateur
		const existingInstagramAccount = await prisma.account.findFirst({
			where: {
				provider: "instagram",
				providerAccountId: decoded.instagramId,
			},
			include: { user: true },
		});

		if (existingInstagramAccount) {
			console.log("Compte Instagram déjà lié:", decoded.instagramId);
			// Mettre à jour l'utilisateur existant avec les nouvelles informations
			const updatedUser = await prisma.user.update({
				where: { id: existingInstagramAccount.userId },
				data: {
					email,
					emailVerified: new Date(),
					profile: {
						upsert: {
							create: {
								firstName,
								lastName,
								phone: phone || null,
							},
							update: {
								firstName,
								lastName,
								phone: phone || null,
							},
						},
					},
				},
				include: { profile: true },
			});

			console.log("Utilisateur mis à jour:", updatedUser.id);

			// Créer le token JWT final
			const token = jwt.sign(
				{
					userId: updatedUser.id,
					email: updatedUser.email,
					name: `${updatedUser.profile?.firstName} ${updatedUser.profile?.lastName}`.trim(),
					provider: "instagram",
				},
				process.env.NEXTAUTH_SECRET!,
				{ expiresIn: "7d" }
			);

			const response = NextResponse.json({ success: true, updated: true });
			response.cookies.set("auth-token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 7 * 24 * 60 * 60, // 7 jours
			});

			response.cookies.delete("temp-auth-token");
			return response;
		}

		// Créer l'utilisateur avec les vraies informations
		const user = await prisma.user.create({
			data: {
				email,
				emailVerified: new Date(),
				profile: {
					create: {
						firstName,
						lastName,
						phone: phone || null,
					},
				},
				accounts: {
					create: {
						type: "oauth",
						provider: "instagram",
						providerAccountId: decoded.instagramId,
						access_token: "completed", // Token déjà utilisé
						scope: "instagram_business_basic",
					},
				},
			},
			include: { profile: true },
		});

		console.log("Nouvel utilisateur créé:", user.id);

		// Créer le token JWT final
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				name: `${user.profile?.firstName} ${user.profile?.lastName}`.trim(),
				provider: "instagram",
			},
			process.env.NEXTAUTH_SECRET!,
			{ expiresIn: "7d" }
		);

		// Rediriger vers la page d'accueil avec le cookie de session
		const response = NextResponse.json({ success: true, created: true });
		response.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60, // 7 jours
		});

		// Nettoyer le token temporaire
		response.cookies.delete("temp-auth-token");

		return response;
	} catch (error) {
		console.error("Erreur lors de la complétion du profil:", error);
		return NextResponse.json(
			{
				error: "Erreur lors de la création du profil",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}
