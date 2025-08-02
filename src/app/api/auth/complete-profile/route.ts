import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, firstName, lastName, phone, provider, tempAuthData } = body;

		// Validation des données
		if (!email || !firstName || !lastName) {
			return NextResponse.json(
				{ error: "Email, prénom et nom sont obligatoires" },
				{ status: 400 }
			);
		}

		// Récupérer le token temporaire
		const cookieStore = await cookies();
		const tempToken = cookieStore.get("temp-auth-token")?.value;

		if (!tempToken) {
			return NextResponse.json({ error: "Session expirée" }, { status: 401 });
		}

		// Vérifier le token temporaire
		const decoded = jwt.verify(tempToken, process.env.NEXTAUTH_SECRET!) as any;

		if (!decoded.temporary || decoded.provider !== provider) {
			return NextResponse.json({ error: "Token invalide" }, { status: 401 });
		}

		// Vérifier si l'email existe déjà
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Un compte avec cet email existe déjà" },
				{ status: 409 }
			);
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
		const response = NextResponse.json({ success: true });
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
			{ error: "Erreur lors de la création du profil" },
			{ status: 500 }
		);
	}
}
