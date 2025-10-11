import { getAdminFromRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST - Nettoyer les anciennes campagnes (6 mois et plus)
export async function POST(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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
		console.error("Erreur lors du nettoyage des campagnes:", error);
		return NextResponse.json(
			{ error: "Erreur lors du nettoyage des campagnes" },
			{ status: 500 }
		);
	}
}

// GET - Vérifier combien de campagnes seraient supprimées (preview)
export async function GET(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		// Date limite : il y a 6 mois
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		// Compter les campagnes qui seraient supprimées
		const campaignsToDelete = await prisma.newsletterCampaign.count({
			where: {
				createdAt: {
					lt: sixMonthsAgo,
				},
			},
		});

		// Obtenir quelques exemples
		const exampleCampaigns = await prisma.newsletterCampaign.findMany({
			where: {
				createdAt: {
					lt: sixMonthsAgo,
				},
			},
			select: {
				id: true,
				subject: true,
				createdAt: true,
				status: true,
			},
			take: 5,
			orderBy: {
				createdAt: "asc",
			},
		});

		return NextResponse.json({
			campaignsToDelete,
			cutoffDate: sixMonthsAgo.toISOString(),
			examples: exampleCampaigns,
		});
	} catch (error) {
		console.error("Erreur lors de la vérification du nettoyage:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la vérification" },
			{ status: 500 }
		);
	}
}
