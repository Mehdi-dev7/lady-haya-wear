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

			// Envoyer un email de bienvenue pour les nouveaux utilisateurs Google
			try {
				await sendWelcomeEmail(email, given_name || name || "");
				console.log(`Email de bienvenue envoyé à ${email}`);
			} catch (emailError) {
				console.error(
					"Erreur lors de l'envoi de l'email de bienvenue:",
					emailError
				);
				// Ne pas faire échouer l'inscription si l'email échoue
			}
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

async function sendWelcomeEmail(email: string, firstName: string) {
	try {
		const response = await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				to: email,
				subject: "Bienvenue chez Lady Haya Wear ! 🌸",
				html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafafa;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8B4A47; font-family: 'Alex Brush', cursive; font-size: 32px; margin: 0;">
                  Lady Haya Wear
                </h1>
                <p style="color: #D4A574; font-style: italic; margin: 5px 0 0 0;">Mode islamique moderne</p>
              </div>
              
              <h2 style="color: #8B4A47; text-align: center; margin-bottom: 20px;">
                Bienvenue ${firstName ? firstName : ""} ! 🌸
              </h2>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                Nous sommes ravis de vous accueillir dans la famille Lady Haya Wear ! 
                Votre compte a été créé avec succès via Google.
              </p>
              
              <div style="background-color: #f8f4f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #8B4A47; margin-top: 0;">🎁 Avantages de votre compte :</h3>
                <ul style="color: #333; line-height: 1.6;">
                  <li>Accès prioritaire aux nouvelles collections</li>
                  <li>Offres exclusives et promotions membres</li>
                  <li>Suivi de vos commandes en temps réel</li>
                  <li>Liste de souhaits personnalisée</li>
                  <li>Adresses de livraison sauvegardées</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}" 
                   style="background-color: #D4A574; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 25px; font-weight: bold; 
                          display: inline-block; transition: background-color 0.3s;">
                  Découvrir nos collections
                </a>
              </div>
              
              <div style="background-color: #8B4A47; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="margin-top: 0; color: white;">📧 Restez connectée !</h3>
                <p style="margin-bottom: 0;">
                  Suivez-nous sur nos réseaux sociaux pour ne rien manquer de nos actualités, 
                  conseils mode et inspirations.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                Ceci est un email automatique, merci de ne pas répondre.
                <br>
                Lady Haya Wear - Mode islamique moderne et élégante
                <br>
                <a href="${process.env.NEXTAUTH_URL}/mentions/mentions-legales" style="color: #8B4A47;">Mentions légales</a> | 
                <a href="${process.env.NEXTAUTH_URL}/mentions/politique-confidentialite" style="color: #8B4A47;">Politique de confidentialité</a>
              </p>
              
            </div>
          </div>
        `,
			}),
		});

		if (!response.ok) {
			throw new Error("Erreur lors de l'envoi de l'email");
		}
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
		throw error;
	}
}
