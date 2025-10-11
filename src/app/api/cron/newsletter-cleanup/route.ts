import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST - Nettoyage automatique des campagnes (appelé par un cron job)
export async function POST(request: NextRequest) {
	try {
		// Vérification de sécurité optionnelle : token secret pour les cron jobs
		const authHeader = request.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		// Si un CRON_SECRET est configuré, on vérifie le token
		if (cronSecret) {
			if (authHeader !== `Bearer ${cronSecret}`) {
				console.error("Token cron invalide");
				return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
			}
		} else {
			console.warn("⚠️ CRON_SECRET non configuré - API non sécurisée");
		}

		// Date limite : il y a 6 mois
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		// Compter les campagnes à supprimer
		const campaignsToDelete = await prisma.newsletterCampaign.count({
			where: {
				createdAt: {
					lt: sixMonthsAgo,
				},
			},
		});

		if (campaignsToDelete === 0) {
			console.log(
				"🧹 Nettoyage automatique: Aucune campagne ancienne à supprimer"
			);
			return NextResponse.json({
				success: true,
				message: "Aucune campagne ancienne à supprimer",
				deleted: 0,
			});
		}

		// Supprimer les campagnes anciennes
		const result = await prisma.newsletterCampaign.deleteMany({
			where: {
				createdAt: {
					lt: sixMonthsAgo,
				},
			},
		});

		console.log(
			`🧹 Nettoyage automatique: ${result.count} campagnes supprimées (plus de 6 mois)`
		);

		return NextResponse.json({
			success: true,
			message: `${result.count} campagnes anciennes supprimées avec succès`,
			deleted: result.count,
			cutoffDate: sixMonthsAgo.toISOString(),
		});
	} catch (error) {
		console.error("Erreur lors du nettoyage automatique des campagnes:", error);
		return NextResponse.json(
			{ error: "Erreur lors du nettoyage automatique" },
			{ status: 500 }
		);
	}
}

// GET - Vérification de santé du cron job
export async function GET() {
	try {
		// Date limite : il y a 6 mois
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		// Compter les campagnes anciennes
		const oldCampaigns = await prisma.newsletterCampaign.count({
			where: {
				createdAt: {
					lt: sixMonthsAgo,
				},
			},
		});

		// Compter le total des campagnes
		const totalCampaigns = await prisma.newsletterCampaign.count();

		return NextResponse.json({
			status: "healthy",
			oldCampaigns,
			totalCampaigns,
			cutoffDate: sixMonthsAgo.toISOString(),
			nextCleanupWouldDelete: oldCampaigns,
		});
	} catch (error) {
		console.error(
			"Erreur lors de la vérification du cron de nettoyage:",
			error
		);
		return NextResponse.json(
			{ error: "Erreur lors de la vérification" },
			{ status: 500 }
		);
	}
}
