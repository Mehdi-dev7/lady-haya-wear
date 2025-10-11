import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		if (!userId) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}
		const body = await request.json();
		const { currentPassword, newPassword } = body;
		if (!currentPassword || !newPassword) {
			return NextResponse.json(
				{ error: "Champs requis manquants" },
				{ status: 400 }
			);
		}
		// Récupérer l'utilisateur
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user || !user.password) {
			return NextResponse.json(
				{ error: "Utilisateur introuvable ou sans mot de passe local." },
				{ status: 400 }
			);
		}
		// Vérifier le mot de passe actuel
		const isValid = await bcrypt.compare(currentPassword, user.password);
		if (!isValid) {
			return NextResponse.json(
				{ error: "Mot de passe actuel incorrect." },
				{ status: 400 }
			);
		}
		// Vérifier la force du nouveau mot de passe
		const strong =
			/[A-Z]/.test(newPassword) &&
			/[a-z]/.test(newPassword) &&
			/[0-9]/.test(newPassword) &&
			newPassword.length >= 8;
		if (!strong) {
			return NextResponse.json(
				{
					error:
						"Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.",
				},
				{ status: 400 }
			);
		}
		// Hasher le nouveau mot de passe
		const hashed = await bcrypt.hash(newPassword, 10);
		await prisma.user.update({
			where: { id: userId },
			data: { password: hashed },
		});
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur update password:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
