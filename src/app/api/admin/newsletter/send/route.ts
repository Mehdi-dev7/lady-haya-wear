import { getAdminFromRequest } from "@/lib/auth-utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fonction pour envoyer via Brevo
async function sendNewsletterViaBrevo(
	subject: string,
	content: string,
	recipients: string[]
) {
	const BREVO_API_KEY = process.env.BREVO_API_KEY;
	const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

	if (!BREVO_API_KEY) {
		throw new Error("BREVO_API_KEY non configurée");
	}

	// Créer le template HTML
	const htmlContent = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>${subject}</title>
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
					${content.replace(/\n/g, "<br>")}
					<br><br>
					<a href="${process.env.NEXT_PUBLIC_URL}/collections" class="btn">Découvrir nos collections</a>
				</div>
				<div class="footer">
					<p>Merci de votre confiance,<br>L'équipe Lady Haya Wear</p>
					<p><a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe" style="color: #b49982;">Se désabonner</a></p>
				</div>
			</div>
		</body>
		</html>
	`;

	// Envoyer à tous les destinataires
	const promises = recipients.map(async (email) => {
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
				subject: subject,
				htmlContent: htmlContent,
				textContent: content,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error(`Erreur envoi à ${email}:`, error);
			throw new Error(`Erreur envoi à ${email}`);
		}

		return response.json();
	});

	const results = await Promise.allSettled(promises);
	const successful = results.filter((r) => r.status === "fulfilled").length;
	const failed = results.filter((r) => r.status === "rejected").length;

	return { successful, failed, total: recipients.length };
}

// POST - Envoyer une newsletter
export async function POST(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		const { subject, content, campaignId } = await request.json();

		if (!subject || !content) {
			return NextResponse.json(
				{ error: "Sujet et contenu requis" },
				{ status: 400 }
			);
		}

		// Récupérer la liste des abonnés
		const subscribers = await prisma.user.findMany({
			where: {
				newsletterSubscribed: true, // ✅ Seulement les abonnés volontaires
			},
			select: {
				email: true,
			},
		});

		// Extraire les emails (pas de null possible car email est obligatoire)
		const recipientEmails = subscribers.map((sub) => sub.email);

		if (recipientEmails.length === 0) {
			return NextResponse.json(
				{ error: "Aucun abonné trouvé" },
				{ status: 400 }
			);
		}

		// Envoyer via Brevo
		const result = await sendNewsletterViaBrevo(
			subject,
			content,
			recipientEmails
		);

		// Ici on pourrait sauvegarder les statistiques d'envoi en base
		console.log(
			`Newsletter envoyée: ${result.successful}/${result.total} succès`
		);

		return NextResponse.json({
			success: true,
			message: `Newsletter envoyée à ${result.successful} destinataires`,
			stats: result,
		});
	} catch (error) {
		console.error("Erreur lors de l'envoi de la newsletter:", error);
		return NextResponse.json(
			{ error: "Erreur lors de l'envoi de la newsletter" },
			{ status: 500 }
		);
	}
}
