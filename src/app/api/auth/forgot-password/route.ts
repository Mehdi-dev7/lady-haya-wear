import { sendPasswordResetEmail } from "@/lib/brevo";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();
		if (!email || typeof email !== "string") {
			return NextResponse.json({ success: true }); // Toujours succès pour la sécurité
		}
		// Chercher l'utilisateur
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ success: true }); // Toujours succès
		}
		// Générer un token sécurisé et une date d'expiration (1h)
		const resetToken = uuidv4();
		const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h
		// Stocker le token et l'expiration
		await prisma.user.update({
			where: { email },
			data: { resetToken, resetTokenExpiry },
		});
		// Envoyer l'email via Brevo
		await sendPasswordResetEmail(email, resetToken);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur forgot-password:", error);
		// Toujours succès pour ne pas révéler l'existence de l'email
		return NextResponse.json({ success: true });
	}
}
