import {
	checkRateLimit,
	logSecurityEvent,
	sanitizeObject,
	secureEmailSchema,
} from "@/lib/security";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const loginSchema = z.object({
	email: secureEmailSchema,
	password: z.string().min(1, "Mot de passe requis"),
});

export async function POST(request: NextRequest) {
	try {
		// ===== RATE LIMITING =====
		const ip =
			request.ip || request.headers.get("x-forwarded-for") || "unknown";
		const identifier = `login-${ip}`;

		if (!checkRateLimit(identifier, 5, 15 * 60 * 1000)) {
			// 5 tentatives par 15 minutes
			logSecurityEvent("LOGIN_RATE_LIMIT", { ip }, ip);
			return NextResponse.json(
				{ error: "Trop de tentatives. Réessayez dans 15 minutes." },
				{ status: 429 }
			);
		}

		// ===== VALIDATION ET SANITISATION =====
		const rawData = await request.json();
		const sanitizedData = sanitizeObject(rawData);

		const parsed = loginSchema.safeParse(sanitizedData);
		if (!parsed.success) {
			logSecurityEvent(
				"LOGIN_VALIDATION_ERROR",
				{
					errors: parsed.error.flatten(),
					ip,
				},
				ip
			);

			return NextResponse.json({ error: "Données invalides" }, { status: 400 });
		}

		const { email, password } = parsed.data;

		// ===== VÉRIFICATION UTILISATEUR =====
		const user = await prisma.user.findUnique({
			where: { email },
			include: { profile: true },
		});

		if (!user || !user.password) {
			logSecurityEvent(
				"LOGIN_FAILED",
				{
					email,
					reason: "user_not_found_or_no_password",
					ip,
				},
				ip
			);

			return NextResponse.json(
				{ error: "Email ou mot de passe incorrect" },
				{ status: 401 }
			);
		}

		// ===== VÉRIFICATION MOT DE PASSE =====
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			logSecurityEvent(
				"LOGIN_FAILED",
				{
					email,
					reason: "invalid_password",
					ip,
				},
				ip
			);

			return NextResponse.json(
				{ error: "Email ou mot de passe incorrect" },
				{ status: 401 }
			);
		}

		// ===== VÉRIFICATION EMAIL =====
		if (!user.emailVerified) {
			logSecurityEvent(
				"LOGIN_FAILED",
				{
					email,
					reason: "email_not_verified",
					ip,
				},
				ip
			);

			return NextResponse.json(
				{ error: "Email non vérifié. Vérifiez votre boîte mail." },
				{ status: 403 }
			);
		}

		// ===== CRÉATION TOKEN SÉCURISÉ =====
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				name:
					user.profile?.firstName && user.profile?.lastName
						? `${user.profile.firstName} ${user.profile.lastName}`
						: user.email,
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 jours
			},
			process.env.NEXTAUTH_SECRET!,
			{
				expiresIn: "7d",
				algorithm: "HS256",
			}
		);

		// ===== RÉPONSE SÉCURISÉE =====
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

		// ===== COOKIE SÉCURISÉ =====
		response.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60, // 7 jours
			path: "/",
		});

		// ===== LOG SUCCÈS =====
		logSecurityEvent(
			"LOGIN_SUCCESS",
			{
				email,
				userId: user.id,
				ip,
			},
			ip
		);

		return response;
	} catch (error) {
		console.error("Erreur lors de la connexion:", error);
		return NextResponse.json(
			{ error: "Utilisateur inconnu ou inexistant" },
			{ status: 500 }
		);
	}
}
