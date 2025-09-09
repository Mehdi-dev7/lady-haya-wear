import { getAdminFromRequest } from "@/lib/auth-utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Récupérer toutes les campagnes
export async function GET(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		// Pour l'instant, simuler avec un compteur limité et plus logique
		// Plus tard, on créera une vraie table NewsletterCampaign
		const now = new Date();
		// Limiter à maximum 5 campagnes, basé sur les heures
		const campaignCount = Math.min(Math.floor(now.getHours() / 4) + 1, 5);

		const campaigns: any[] = [];
		for (let i = 0; i < campaignCount; i++) {
			campaigns.push({
				id: `${i + 1}`,
				subject: `Newsletter ${i + 1}`,
				type: "general",
				status: "sent",
				recipientCount: 1,
				sentAt: new Date(now.getTime() - i * 3600000).toISOString(), // Décalage de 1h par campagne
				createdAt: new Date(now.getTime() - i * 3600000).toISOString(),
			});
		}

		return NextResponse.json(campaigns);
	} catch (error) {
		console.error("Erreur lors de la récupération des campagnes:", error);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 }
		);
	}
}

// POST - Créer une nouvelle campagne (brouillon)
export async function POST(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		const { subject, content, type, status } = await request.json();

		if (!subject || !content) {
			return NextResponse.json(
				{ error: "Sujet et contenu requis" },
				{ status: 400 }
			);
		}

		// Ici on sauvegarderait en base la campagne
		// Pour l'instant, on simule la création
		const newCampaign = {
			id: Date.now().toString(),
			subject,
			content,
			type: type || "general",
			status: status || "draft",
			recipientCount: 0,
			createdAt: new Date().toISOString(),
		};

		return NextResponse.json(newCampaign);
	} catch (error) {
		console.error("Erreur lors de la création de la campagne:", error);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 }
		);
	}
}
