import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Lister tous les codes promo
export async function GET() {
	try {
		const promoCodes = await prisma.promoCode.findMany({
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({ promoCodes });
	} catch (error) {
		console.error("Erreur récupération codes promo:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

// POST - Créer un nouveau code promo
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			code,
			type,
			value,
			minAmount,
			maxUses,
			validFrom,
			validUntil,
			active,
		} = body;

		// Validation
		if (!code || !type || value === undefined) {
			return NextResponse.json(
				{ error: "Code, type et valeur requis" },
				{ status: 400 }
			);
		}

		// Vérifier si le code existe déjà
		const existingCode = await prisma.promoCode.findUnique({
			where: { code: code.toUpperCase() },
		});

		if (existingCode) {
			return NextResponse.json(
				{ error: "Ce code existe déjà" },
				{ status: 400 }
			);
		}

		// Créer le code promo
		const promoCode = await prisma.promoCode.create({
			data: {
				code: code.toUpperCase(),
				type,
				value: parseFloat(value),
				minAmount: minAmount ? parseFloat(minAmount) : null,
				maxUses: maxUses ? parseInt(maxUses) : null,
				validFrom: new Date(validFrom),
				validUntil: new Date(validUntil),
				active: Boolean(active),
			},
		});

		return NextResponse.json({ promoCode }, { status: 201 });
	} catch (error) {
		console.error("Erreur création code promo:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
