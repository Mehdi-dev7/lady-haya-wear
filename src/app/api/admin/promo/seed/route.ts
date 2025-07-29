import { PrismaClient, PromoType } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
	try {
		// Codes promo de test
		const testCodes = [
			{
				code: "NEWSLETTER20",
				type: PromoType.PERCENTAGE,
				value: 20,
				minAmount: 30,
				maxUses: 100,
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
				active: true,
			},
			{
				code: "WELCOME10",
				type: PromoType.FIXED,
				value: 10,
				minAmount: 50,
				maxUses: 50,
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 jours
				active: true,
			},
			{
				code: "FREESHIP",
				type: PromoType.FREE_SHIPPING,
				value: 0,
				minAmount: 25,
				maxUses: 200,
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 jours
				active: true,
			},
			{
				code: "FLASH50",
				type: PromoType.PERCENTAGE,
				value: 50,
				minAmount: 100,
				maxUses: 10,
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
				active: true,
			},
		];

		const createdCodes = [];

		for (const codeData of testCodes) {
			try {
				const existingCode = await prisma.promoCode.findUnique({
					where: { code: codeData.code },
				});

				if (!existingCode) {
					const promoCode = await prisma.promoCode.create({
						data: codeData,
					});
					createdCodes.push(promoCode);
				}
			} catch (error) {
				console.error(`Erreur création code ${codeData.code}:`, error);
			}
		}

		return NextResponse.json({
			message: `${createdCodes.length} codes promo créés`,
			codes: createdCodes,
		});
	} catch (error) {
		console.error("Erreur seed codes promo:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
