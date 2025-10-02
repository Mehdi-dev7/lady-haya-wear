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

		// Optionnel : Envoyer un email de confirmation via Brevo avec le code promo
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
				.header { background: #f9dede; padding: 30px; text-align: center; }
				.logo { font-family: 'Alex Brush', cursive; font-size: 2.5rem; color: #8a5f3d; margin-bottom: 10px; }
				.content { background: white; padding: 30px; }
				.footer { background: #f9dede; padding: 20px; text-align: center; font-size: 0.9rem; color: #666; }
				.btn { display: inline-block; background: #8a5f3d; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
				.promo-box { background: #b49982; color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
				.promo-code { background: #f9dede; color: #8a5f3d; padding: 15px 25px; border-radius: 8px; font-family: monospace; font-size: 1.2rem; font-weight: bold; margin: 15px 0; display: inline-block; }
				.promo-text { font-size: 1.1rem; margin-bottom: 15px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<div class="logo">Lady Haya Wear</div>
					<p style="color: #8a5f3d; margin: 0;">Votre boutique de mode</p>
				</div>
				<div class="content">
					<h2 style="color: #8a5f3d;">Bienvenue dans notre communauté ! 🎉</h2>
					<p>Merci de vous être inscrit(e) à notre newsletter.</p>
					
					<div class="promo-box">
						<div class="promo-text">🎁 <strong>Votre cadeau de bienvenue :</strong></div>
						<div style="font-size: 1.3rem; margin-bottom: 10px;">10% de réduction sur votre première commande !</div>
						<div style="font-size: 1.3rem; margin-bottom: 10px;">avec le code promo :</div>
						<div class="promo-code">NEWSLETTER10</div>
						<div style="font-size: 0.9rem; opacity: 0.9;">Valable sur une commande de 20€ minimum</div>
					</div>
					
					<p>Vous recevrez également :</p>
					<ul>
						<li>Nos nouvelles collections en avant-première</li>
						<li>Des informations exclusives sur nos produits</li>
						<li>Des conseils mode et style personnalisés</li>
						<li>Des offres spéciales réservées aux abonnés</li>
					</ul>
					
					<p>À très bientôt,<br>L'équipe Lady Haya Wear</p>
					<br>
					<a href="${process.env.NEXT_PUBLIC_APP_URL || "https://ladyhaya-wear.fr"}/collections" class="btn">Découvrir nos collections</a>
				</div>
				<div class="footer">
					<p>Lady Haya Wear</p>
					<p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://ladyhaya-wear.fr"}/mentions/politique-confidentialite" style="color: #666;">Politique de confidentialité</a></p>
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
				email: process.env.BREVO_FROM_EMAIL || "contact@ladyhaya-wear.fr",
			},
			to: [{ email }],
			subject: "Bienvenue chez Lady Haya Wear",
			htmlContent: htmlContent,
			headers: {
				"List-Unsubscribe": `<${process.env.NEXT_PUBLIC_APP_URL || "https://ladyhaya-wear.fr"}/unsubscribe?email=${encodeURIComponent(email)}>`,
				"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
				"X-Mailer": "Lady Haya Wear Newsletter",
				"X-Priority": "3",
			},
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Erreur Brevo: ${error}`);
	}

	return response.json();
}
