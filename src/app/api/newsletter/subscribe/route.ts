import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST - Inscription publique à la newsletter
export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email requis" }, { status: 400 });
		}

		// Validation basique de l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ error: "Email invalide" }, { status: 400 });
		}

		// Vérifier si l'email existe déjà
		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		let user;
		if (existingUser) {
			// Si l'utilisateur existe, mettre à jour son statut newsletter
			if (existingUser.newsletterSubscribed) {
				return NextResponse.json(
					{ error: "Cet email est déjà inscrit à notre newsletter" },
					{ status: 400 }
				);
			}

			user = await prisma.user.update({
				where: { email: email.toLowerCase() },
				data: { newsletterSubscribed: true },
			});
		} else {
			// Créer un nouvel abonné
			user = await prisma.user.create({
				data: {
					email: email.toLowerCase(),
					newsletterSubscribed: true,
				},
			});
		}

		// Optionnel : Envoyer un email de confirmation via Brevo
		try {
			await sendWelcomeEmail(email);
		} catch (emailError) {
			console.error("Erreur envoi email de bienvenue:", emailError);
			// On continue même si l'email échoue
		}

		return NextResponse.json({
			success: true,
			message: "Inscription réussie ! Merci de rejoindre notre communauté.",
		});
	} catch (error) {
		console.error("Erreur lors de l'inscription newsletter:", error);
		return NextResponse.json(
			{ error: "Erreur lors de l'inscription" },
			{ status: 500 }
		);
	}
}

// Fonction pour envoyer l'email de bienvenue
async function sendWelcomeEmail(email: string) {
	const BREVO_API_KEY = process.env.BREVO_API_KEY;
	const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

	if (!BREVO_API_KEY) {
		console.warn("BREVO_API_KEY non configurée");
		return;
	}

	const htmlContent = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Bienvenue chez Lady Haya Wear</title>
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background: linear-gradient(135deg, #f9dede, #f5f1e9); padding: 30px; text-align: center; }
				.logo { font-family: 'Alex Brush', cursive; font-size: 2.5rem; color: #8a5f3d; margin-bottom: 10px; }
				.content { background: white; padding: 30px; }
				.footer { background: #f8ede4; padding: 20px; text-align: center; font-size: 0.9rem; color: #b49982; }
				.btn { display: inline-block; background: #8a5f3d; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<div class="logo">Lady Haya Wear</div>
					<p style="color: #ab8d73; margin: 0;">Élégance et raffinement</p>
				</div>
				<div class="content">
					<h2 style="color: #8a5f3d;">Bienvenue dans notre communauté ! 🎉</h2>
					<p>Merci de vous être inscrit(e) à notre newsletter.</p>
					<p>Vous recevrez en avant-première :</p>
					<ul>
						<li>Nos nouvelles collections</li>
						<li>Des offres exclusives</li>
						<li>Des conseils mode et style</li>
					</ul>
					<p>À très bientôt,<br>L'équipe Lady Haya Wear</p>
					<br>
					<a href="${process.env.NEXT_PUBLIC_APP_URL || "https://ladyhaya-wear.fr"}/collections" class="btn">Découvrir nos collections</a>
				</div>
				<div class="footer">
					<p>Lady Haya Wear - Élégance féminine</p>
					<p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://ladyhaya-wear.fr"}/unsubscribe" style="color: #b49982;">Se désabonner</a></p>
				</div>
			</div>
		</body>
		</html>
	`;

	const response = await fetch(BREVO_API_URL, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"api-key": BREVO_API_KEY,
		},
		body: JSON.stringify({
			sender: {
				name: "Lady Haya Wear",
				email: process.env.BREVO_FROM_EMAIL || "noreply@ladyhaya-wear.fr",
			},
			to: [{ email }],
			subject: "Bienvenue chez Lady Haya Wear ! ✨",
			htmlContent: htmlContent,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Erreur Brevo: ${error}`);
	}

	return response.json();
}
