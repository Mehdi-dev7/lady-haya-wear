import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { token, password } = await request.json();
		if (!token || !password) {
			return NextResponse.json(
				{ error: "Token ou mot de passe manquant." },
				{ status: 400 }
			);
		}
		// Chercher l'utilisateur avec ce token et vérifier l'expiration
		const user = await prisma.user.findFirst({
			where: {
				resetToken: token,
				resetTokenExpiry: { gte: new Date() },
			},
		});
		if (!user) {
			return NextResponse.json(
				{ error: "Lien de réinitialisation invalide ou expiré." },
				{ status: 400 }
			);
		}
		// Hasher le nouveau mot de passe
		const hashed = await bcrypt.hash(password, 10);
		// Mettre à jour le mot de passe et supprimer le token
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashed,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur reset-password:", error);
		return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
	}
}
