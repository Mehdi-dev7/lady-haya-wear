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

		// Pour l'instant, retourner un tableau vide
		// Plus tard, on créera une table NewsletterCampaign
		const campaigns = [];

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
