import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
	try {
		// Vérifier l'authentification
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;

		const { productId } = await request.json();

		// Supprimer le favori de la base de données
		await prisma.favorite.deleteMany({
			where: {
				userId,
				productId,
			},
		});

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la suppression du favori:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la suppression" },
			{ status: 500 }
		);
	}
}
