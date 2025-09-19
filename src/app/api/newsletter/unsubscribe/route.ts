import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST - Désabonnement de la newsletter
export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email requis" }, { status: 400 });
		}

		// Validation basique de l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ error: "Email invalide" }, { status: 400 });
		}

		// Trouver l'utilisateur et le désabonner
		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Email non trouvé" },
				{ status: 404 }
			);
		}

		if (!user.newsletterSubscribed) {
			return NextResponse.json(
				{ error: "Cet email n'est pas abonné à la newsletter" },
				{ status: 400 }
			);
		}

		// Désabonner l'utilisateur
		await prisma.user.update({
			where: { email: email.toLowerCase() },
			data: { newsletterSubscribed: false },
		});

		return NextResponse.json({
			success: true,
			message: "Désabonnement réussi",
		});
	} catch (error) {
		console.error("Erreur lors du désabonnement:", error);
		return NextResponse.json(
			{ error: "Erreur lors du désabonnement" },
			{ status: 500 }
		);
	}
}
