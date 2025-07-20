import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get("token");

		if (!token) {
					return NextResponse.redirect(
			new URL("/login?error=token_missing", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
		);
		}

		// Vérifier le token
		const verificationToken = await prisma.verificationToken.findUnique({
			where: { token },
		});

		if (!verificationToken) {
					return NextResponse.redirect(
			new URL("/login?error=token_invalid", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
		);
		}

		// Vérifier si le token n'a pas expiré
		if (verificationToken.expires < new Date()) {
			// Supprimer le token expiré
			await prisma.verificationToken.delete({
				where: { token },
			});
					return NextResponse.redirect(
			new URL("/login?error=token_expired", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
		);
		}

		// Marquer l'email comme vérifié
		const updatedUser = await prisma.user.update({
			where: { email: verificationToken.identifier },
			data: { emailVerified: new Date() },
		});

		console.log("✅ EMAIL VÉRIFIÉ - User:", updatedUser.email, "Vérifié:", !!updatedUser.emailVerified);

		// Supprimer le token de vérification
		await prisma.verificationToken.delete({
			where: { token },
		});

		// Redirection avec remplacement de l'historique pour éviter les onglets multiples
		const response = NextResponse.redirect(
			new URL("/login?success=email_verified", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
		);
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		return response;
	} catch (error) {
		console.error("Erreur lors de la vérification de l'email:", error);
		return NextResponse.redirect(
			new URL("/login?error=server_error", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email requis" }, { status: 400 });
		}

		// Vérifier si l'utilisateur existe
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Utilisateur non trouvé" },
				{ status: 404 }
			);
		}

		if (user.emailVerified) {
			return NextResponse.json(
				{ error: "Email déjà vérifié" },
				{ status: 400 }
			);
		}

		// Supprimer les anciens tokens de vérification
		await prisma.verificationToken.deleteMany({
			where: { identifier: email },
		});

		// Créer un nouveau token de vérification
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
		await sendVerificationEmail(email, verificationToken);

		return NextResponse.json(
			{ message: "Email de vérification envoyé" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de vérification:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

async function sendVerificationEmail(email: string, token: string) {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
		const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

		const response = await fetch(`${baseUrl}/api/send-email`, {
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
              Vérification de votre email
            </h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :
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
