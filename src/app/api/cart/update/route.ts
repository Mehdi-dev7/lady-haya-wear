import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		// Vérifier l'authentification
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;

		const { productId, color, size, quantity } = await request.json();

		// Mettre à jour la quantité en base de données
		await prisma.cartItem.updateMany({
			where: {
				userId,
				productId,
				colorName: color,
				sizeName: size,
			},
			data: {
				quantity,
			},
		});

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la mise à jour du panier:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la mise à jour" },
			{ status: 500 }
		);
	}
}
