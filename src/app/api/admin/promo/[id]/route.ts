import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Récupérer un code promo spécifique
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const promoCode = await prisma.promoCode.findUnique({
			where: { id },
		});

		if (!promoCode) {
			return NextResponse.json(
				{ error: "Code de promotion non trouvé" },
				{ status: 404 }
			);
		}

		// Formater les données pour le frontend
		const formattedPromo = {
			id: promoCode.id,
			code: promoCode.code,
			discount:
				promoCode.type === "PERCENTAGE"
					? `${promoCode.value}%`
					: `€${promoCode.value}`,
			type: promoCode.type === "PERCENTAGE" ? "Pourcentage" : "Montant fixe",
			validFrom: promoCode.validFrom.toISOString().split("T")[0],
			validTo: promoCode.validUntil.toISOString().split("T")[0],
			maxUsage: promoCode.maxUses?.toString() || "",
		};

		return NextResponse.json(formattedPromo);
	} catch (error) {
		console.error("Erreur lors de la récupération du code promo:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération du code promo" },
			{ status: 500 }
		);
	}
}

// PUT - Modifier un code promo
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { code, discount, type, validFrom, validTo, maxUsage } = body;

		// Validation des données
		if (!code || !discount || !type || !validFrom || !validTo) {
			return NextResponse.json(
				{ error: "Tous les champs obligatoires doivent être remplis" },
				{ status: 400 }
			);
		}

		// Vérifier si le code promo existe
		const existingPromo = await prisma.promoCode.findUnique({
			where: { id },
		});

		if (!existingPromo) {
			return NextResponse.json(
				{ error: "Code de promotion non trouvé" },
				{ status: 404 }
			);
		}

		// Vérifier si le nouveau code existe déjà (sauf pour le code actuel)
		const duplicateCode = await prisma.promoCode.findFirst({
			where: {
				code: code.toUpperCase(),
				id: { not: id },
			},
		});

		if (duplicateCode) {
			return NextResponse.json(
				{ error: "Ce code de promotion existe déjà" },
				{ status: 400 }
			);
		}

		// Extraire la valeur numérique du discount
		let value: number;
		if (type === "Pourcentage") {
			value = parseFloat(discount.replace("%", ""));
		} else {
			value = parseFloat(discount.replace("€", ""));
		}

		// Modifier le code promo
		const updatedPromoCode = await prisma.promoCode.update({
			where: { id },
			data: {
				code: code.toUpperCase(),
				type: type === "Pourcentage" ? "PERCENTAGE" : "FIXED",
				value: value,
				validFrom: new Date(validFrom),
				validUntil: new Date(validTo),
				maxUses: maxUsage ? parseInt(maxUsage) : null,
			},
		});

		// Retourner le code promo formaté
		const formattedPromo = {
			id: updatedPromoCode.id,
			code: updatedPromoCode.code,
			discount:
				updatedPromoCode.type === "PERCENTAGE"
					? `${updatedPromoCode.value}%`
					: `€${updatedPromoCode.value}`,
			type:
				updatedPromoCode.type === "PERCENTAGE" ? "Pourcentage" : "Montant fixe",
			validFrom: updatedPromoCode.validFrom.toISOString().split("T")[0],
			validTo: updatedPromoCode.validUntil.toISOString().split("T")[0],
			usage: updatedPromoCode.usedCount,
			maxUsage: updatedPromoCode.maxUses,
			status: getPromoStatus(updatedPromoCode),
		};

		return NextResponse.json(formattedPromo);
	} catch (error) {
		console.error("Erreur lors de la modification du code promo:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la modification du code promo" },
			{ status: 500 }
		);
	}
}

// DELETE - Supprimer un code promo
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		// Vérifier si le code promo existe
		const existingPromo = await prisma.promoCode.findUnique({
			where: { id },
		});

		if (!existingPromo) {
			return NextResponse.json(
				{ error: "Code de promotion non trouvé" },
				{ status: 404 }
			);
		}

		// Vérifier si le code promo a été utilisé
		const usedPromo = await prisma.order.findFirst({
			where: { promoCodeId: id },
		});

		if (usedPromo) {
			return NextResponse.json(
				{ error: "Impossible de supprimer un code promo qui a été utilisé" },
				{ status: 400 }
			);
		}

		// Supprimer le code promo
		await prisma.promoCode.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: "Code de promotion supprimé avec succès" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erreur lors de la suppression du code promo:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la suppression du code promo" },
			{ status: 500 }
		);
	}
}

// Fonction pour déterminer le statut d'un code promo
function getPromoStatus(promo: any) {
	const now = new Date();

	// Vérifier si le code est expiré
	if (promo.validUntil < now) {
		return "Expirée";
	}

	// Vérifier si le code a atteint sa limite d'utilisations
	if (promo.maxUses && promo.usedCount >= promo.maxUses) {
		return "Inactive";
	}

	// Vérifier si le code est actif
	if (!promo.active) {
		return "Inactive";
	}

	return "Active";
}
