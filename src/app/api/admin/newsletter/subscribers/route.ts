import { getAdminFromRequest } from "@/lib/auth-utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Récupérer tous les abonnés
export async function GET(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		// Pour l'instant, on récupère depuis les users qui ont accepté la newsletter
		// Plus tard on pourra créer une table dédiée Newsletter
		const subscribers = await prisma.user.findMany({
			where: {
				// Supposons qu'on ajoute un champ newsletterSubscribed
				// newsletterSubscribed: true
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
				profile: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Transformer les données pour correspondre à l'interface
		const formattedSubscribers = subscribers.map((user) => ({
			id: user.id,
			email: user.email,
			name: user.profile
				? `${user.profile.firstName || ""} ${user.profile.lastName || ""}`.trim()
				: null,
			subscribedAt: user.createdAt.toISOString(),
			isActive: true,
		}));

		return NextResponse.json(formattedSubscribers);
	} catch (error) {
		console.error("Erreur lors de la récupération des abonnés:", error);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 }
		);
	}
}

// POST - Ajouter un abonné manuellement
export async function POST(request: NextRequest) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		const { email, name } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email requis" }, { status: 400 });
		}

		// Vérifier si l'email existe déjà
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Cet email est déjà inscrit" },
				{ status: 400 }
			);
		}

		// Créer un nouvel abonné avec profil si nom fourni
		const newSubscriber = await prisma.user.create({
			data: {
				email,
				// newsletterSubscribed: true
				profile: name
					? {
							create: {
								firstName: name.split(" ")[0] || "",
								lastName: name.split(" ").slice(1).join(" ") || "",
							},
						}
					: undefined,
			},
			include: {
				profile: true,
			},
		});

		return NextResponse.json({
			id: newSubscriber.id,
			email: newSubscriber.email,
			name: newSubscriber.profile
				? `${newSubscriber.profile.firstName || ""} ${newSubscriber.profile.lastName || ""}`.trim()
				: null,
			subscribedAt: newSubscriber.createdAt.toISOString(),
			isActive: true,
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout de l'abonné:", error);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 }
		);
	}
}
