import { getAdminFromRequest } from "@/lib/auth-utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Récupérer l'historique des campagnes
export async function GET(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const skip = (page - 1) * limit;

		// Récupérer les campagnes avec pagination
		const [campaigns, total] = await Promise.all([
			prisma.newsletterCampaign.findMany({
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.newsletterCampaign.count(),
		]);

		// Calculer les statistiques globales
		const stats = await prisma.newsletterCampaign.aggregate({
			_count: {
				id: true,
			},
			_sum: {
				sentCount: true,
				failedCount: true,
				recipientCount: true,
			},
		});

		return NextResponse.json({
			campaigns,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
			stats: {
				totalCampaigns: stats._count.id,
				totalEmailsSent: stats._sum.sentCount || 0,
				totalEmailsFailed: stats._sum.failedCount || 0,
				totalRecipients: stats._sum.recipientCount || 0,
			},
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des campagnes:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des campagnes" },
			{ status: 500 }
		);
	}
}

// DELETE - Supprimer une campagne
export async function DELETE(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		const { campaignId } = await request.json();

		if (!campaignId) {
			return NextResponse.json(
				{ error: "ID de campagne requis" },
				{ status: 400 }
			);
		}

		await prisma.newsletterCampaign.delete({
			where: { id: campaignId },
		});

		return NextResponse.json({
			success: true,
			message: "Campagne supprimée avec succès",
		});
	} catch (error) {
		console.error("Erreur lors de la suppression de la campagne:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la suppression de la campagne" },
			{ status: 500 }
		);
	}
}
