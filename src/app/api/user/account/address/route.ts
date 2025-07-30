import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ address: null }, { status: 401 });
		}
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		if (!userId) {
			return NextResponse.json({ address: null }, { status: 401 });
		}

		// Vérifier si on veut toutes les adresses
		const { searchParams } = new URL(request.url);
		const all = searchParams.get("all");

		if (all === "1") {
			// Retourner toutes les adresses
			const addresses = await prisma.address.findMany({
				where: { userId, type: "SHIPPING" },
				orderBy: [{ isDefault: "desc" }],
			});
			return NextResponse.json({ addresses });
		} else {
			// Retourner seulement l'adresse principale
			const address = await prisma.address.findFirst({
				where: { userId, type: "SHIPPING", isDefault: true },
			});
			return NextResponse.json({ address });
		}
	} catch (error) {
		console.error("Erreur get address:", error);
		return NextResponse.json({ address: null }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
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
		const { civility, lastName, firstName, street, company, zipCode, city } =
			body;
		if (!lastName || !firstName || !street || !zipCode || !city) {
			return NextResponse.json(
				{ error: "Champs requis manquants" },
				{ status: 400 }
			);
		}

		// Créer une nouvelle adresse
		const address = await prisma.address.create({
			data: {
				userId,
				civility: civility === "M." ? "MR" : "MME",
				firstName,
				lastName,
				street,
				city,
				zipCode,
				company: company || null,
				type: "SHIPPING",
				isDefault: false, // Nouvelle adresse n'est pas principale par défaut
				country: "France",
			},
		});
		return NextResponse.json({ success: true, address });
	} catch (error) {
		console.error("Erreur create address:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

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
		const { nom, ligne1, ligne2, codePostal, ville } = body;
		if (!nom || !ligne1 || !codePostal || !ville) {
			return NextResponse.json(
				{ error: "Champs requis manquants" },
				{ status: 400 }
			);
		}
		// On cherche une adresse principale existante
		const existing = await prisma.address.findFirst({
			where: { userId, type: "SHIPPING", isDefault: true },
		});
		let address;
		if (existing) {
			address = await prisma.address.update({
				where: { id: existing.id },
				data: {
					firstName: nom,
					lastName: "",
					street: ligne1,
					city: ville,
					zipCode: codePostal,
					company: ligne2 || null,
					type: "SHIPPING",
					isDefault: true,
					country: "France",
				},
			});
		} else {
			address = await prisma.address.create({
				data: {
					userId,
					firstName: nom,
					lastName: "",
					street: ligne1,
					city: ville,
					zipCode: codePostal,
					company: ligne2 || null,
					type: "SHIPPING",
					isDefault: true,
					country: "France",
				},
			});
		}
		return NextResponse.json({ success: true, address });
	} catch (error) {
		console.error("Erreur update address:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
