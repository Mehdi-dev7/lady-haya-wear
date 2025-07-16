import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email et mot de passe requis" },
				{ status: 400 }
			);
		}

		// Vérifier l'utilisateur dans la base de données
		const user = await prisma.user.findUnique({
			where: { email },
			include: { profile: true },
		});

		if (!user || !user.password) {
			return NextResponse.json(
				{ error: "Email ou mot de passe incorrect" },
				{ status: 401 }
			);
		}

		// Vérifier le mot de passe
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Email ou mot de passe incorrect" },
				{ status: 401 }
			);
		}

		// Vérifier que l'email est vérifié
		if (!user.emailVerified) {
			return NextResponse.json(
				{ error: "Email non vérifié. Vérifiez votre boîte mail." },
				{ status: 403 }
			);
		}

		// Créer le token JWT
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				name:
					user.profile?.firstName && user.profile?.lastName
						? `${user.profile.firstName} ${user.profile.lastName}`
						: user.email,
			},
			process.env.NEXTAUTH_SECRET!,
			{ expiresIn: "7d" }
		);

		// Créer la réponse avec cookie
		const response = NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name:
					user.profile?.firstName && user.profile?.lastName
						? `${user.profile.firstName} ${user.profile.lastName}`
						: user.email,
			},
		});

		// Définir le cookie
		response.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60, // 7 jours
		});

		return response;
	} catch (error) {
		console.error("Erreur lors de la connexion:", error);
		return NextResponse.json(
			{ error: "Utilisateur inconnu ou inexistant" },
			{ status: 500 }
		);
	}
}
