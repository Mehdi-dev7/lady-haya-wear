import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// PUT - Modifier un code promo
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
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

		// Vérifier si le code existe déjà (sauf pour celui qu'on modifie)
		const existingCode = await prisma.promoCode.findFirst({
			where: {
				code: code.toUpperCase(),
				id: { not: id },
			},
		});

		if (existingCode) {
			return NextResponse.json(
				{ error: "Ce code existe déjà" },
				{ status: 400 }
			);
		}

		// Modifier le code promo
		const promoCode = await prisma.promoCode.update({
			where: { id },
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

		return NextResponse.json({ promoCode });
	} catch (error) {
		console.error("Erreur modification code promo:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

// PATCH - Activer/désactiver un code promo
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const { active } = await request.json();

		const promoCode = await prisma.promoCode.update({
			where: { id },
			data: { active: Boolean(active) },
		});

		return NextResponse.json({ promoCode });
	} catch (error) {
		console.error("Erreur activation code promo:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

// DELETE - Supprimer un code promo
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		// Vérifier s'il y a des commandes qui utilisent ce code
		const ordersWithCode = await prisma.order.findFirst({
			where: { promoCodeId: id },
		});

		if (ordersWithCode) {
			return NextResponse.json(
				{ error: "Impossible de supprimer : ce code a été utilisé" },
				{ status: 400 }
			);
		}

		await prisma.promoCode.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur suppression code promo:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
