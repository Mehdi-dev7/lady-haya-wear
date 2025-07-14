import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const registerSchema = z.object({
	email: z
		.string()
		.min(1, "Email requis")
		.email("Format d'email invalide")
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Adresse email invalide"
		),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Le mot de passe doit contenir une maj et un chiffre"
		),
	firstName: z
		.string()
		.min(2, "Le prénom doit contenir au moins 2 lettres")
		.max(50, "Le prénom ne peut pas dépasser 50 caractères")
		.regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres")
		.optional(),
	lastName: z
		.string()
		.min(2, "Le nom doit contenir au moins 2 lettres")
		.max(50, "Le nom ne peut pas dépasser 50 caractères")
		.regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres")
		.optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password, firstName, lastName } = registerSchema.parse(body);

		// Vérifier si l'utilisateur existe déjà
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Un utilisateur avec cet email existe déjà" },
				{ status: 400 }
			);
		}

		// Hasher le mot de passe
		const hashedPassword = await bcrypt.hash(password, 12);

		// Créer l'utilisateur
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				profile:
					firstName || lastName
						? {
								create: {
									firstName: firstName || "",
									lastName: lastName || "",
								},
							}
						: undefined,
			},
			include: {
				profile: true,
			},
		});

		// Créer un token de vérification
		const verificationToken = crypto.randomBytes(32).toString("hex");
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

		await prisma.verificationToken.create({
			data: {
				identifier: email,
				token: verificationToken,
				expires,
			},
		});

		// Envoyer l'email de vérification
		let emailSent = false;
		try {
			await sendVerificationEmail(email, verificationToken);
			emailSent = true;
		} catch (emailError) {
			console.error(
				"Erreur lors de l'envoi de l'email, mais inscription réussie:",
				emailError
			);
		}

		return NextResponse.json(
			{
				message: emailSent
					? "Inscription réussie. Vérifiez votre email pour activer votre compte."
					: "Inscription réussie. L'email de vérification n'a pas pu être envoyé, contactez le support.",
				user: {
					id: user.id,
					email: user.email,
					name:
						user.profile?.firstName && user.profile?.lastName
							? `${user.profile.firstName} ${user.profile.lastName}`
							: user.email,
				},
				emailSent,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Erreur lors de l'inscription:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.issues[0].message },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Erreur serveur lors de l'inscription" },
			{ status: 500 }
		);
	}
}

async function sendVerificationEmail(email: string, token: string) {
	try {
		const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

		const response = await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				to: email,
				subject: "Vérification de votre compte Lady Haya Wear",
				html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${process.env.NEXTAUTH_URL}/assets/logo-haya.png" alt="Lady Haya Wear" style="height: 60px;">
            </div>
            
            <h2 style="color: #8B4A47; text-align: center; margin-bottom: 30px;">
              Bienvenue chez Lady Haya Wear !
            </h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Merci de vous être inscrit(e) sur notre boutique en ligne. Pour activer votre compte, 
              veuillez cliquer sur le bouton ci-dessous :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #D4A574; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; 
                        display: inline-block;">
                Vérifier mon email
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              <br>
              <a href="${verificationUrl}" style="color: #8B4A47;">${verificationUrl}</a>
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              Ce lien expirera dans 24 heures.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              Ceci est un email automatique, merci de ne pas répondre.
              <br>
              Lady Haya Wear - Mode islamique moderne
            </p>
          </div>
        `,
			}),
		});

		if (!response.ok) {
			throw new Error("Erreur lors de l'envoi de l'email");
		}
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de vérification:", error);
		throw error;
	}
}
