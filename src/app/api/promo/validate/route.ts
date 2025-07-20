import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const { code, total } = await request.json();

		if (!code || !total) {
			return NextResponse.json(
				{ error: "Code et montant requis" },
				{ status: 400 }
			);
		}

		// Rechercher le code promo
		const promoCode = await prisma.promoCode.findUnique({
			where: { code: code.toUpperCase() },
		});

		if (!promoCode) {
			return NextResponse.json(
				{ valid: false, message: "Code promo invalide" },
				{ status: 200 }
			);
		}

		// Vérifier si le code est actif
		if (!promoCode.active) {
			return NextResponse.json(
				{ valid: false, message: "Ce code promo n'est plus actif" },
				{ status: 200 }
			);
		}

		// Vérifier les dates de validité
		const now = new Date();
		if (now < promoCode.validFrom || now > promoCode.validUntil) {
			return NextResponse.json(
				{
					valid: false,
					message: "Ce code promo a expiré ou n'est pas encore valide",
				},
				{ status: 200 }
			);
		}

		// Vérifier le montant minimum
		if (promoCode.minAmount && total < promoCode.minAmount) {
			return NextResponse.json(
				{
					valid: false,
					message: `Montant minimum requis : ${promoCode.minAmount.toFixed(2)}€`,
				},
				{ status: 200 }
			);
		}

		// Vérifier le nombre max d'utilisations
		if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
			return NextResponse.json(
				{
					valid: false,
					message: "Ce code promo a atteint sa limite d'utilisations",
				},
				{ status: 200 }
			);
		}

		// Calculer la réduction
		let discount = 0;
		let discountType = "";

		switch (promoCode.type) {
			case "PERCENTAGE":
				discount = (total * promoCode.value) / 100;
				discountType = `${promoCode.value}%`;
				break;
			case "FIXED":
				discount = promoCode.value;
				discountType = `${promoCode.value.toFixed(2)}€`;
				break;
			case "FREE_SHIPPING":
				discount = 0; // Sera géré dans le calcul de livraison
				discountType = "Livraison gratuite";
				break;
		}

		return NextResponse.json({
			valid: true,
			discount,
			discountType,
			promoCode: {
				id: promoCode.id,
				code: promoCode.code,
				type: promoCode.type,
				value: promoCode.value,
			},
		});
	} catch (error) {
		console.error("Erreur validation code promo:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
