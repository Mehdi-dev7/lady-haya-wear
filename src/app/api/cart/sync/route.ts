import { enrichCartItems } from "@/lib/syncUtils";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		// Vérifier l'authentification
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;

		const { localCartItems } = await request.json();

		// Récupérer le panier existant en base de données
		const dbCartItems = await prisma.cartItem.findMany({
			where: { userId },
		});

		// Synchroniser : fusionner les articles locaux avec ceux de la base
		const syncedItems = [];

		// Ajouter/mettre à jour les articles locaux dans la base
		for (const localItem of localCartItems) {
			const existingItem = dbCartItems.find(
				(dbItem) =>
					dbItem.productId === localItem.productId &&
					dbItem.colorName === localItem.color &&
					dbItem.sizeName === localItem.size
			);

			if (existingItem) {
				// Mettre à jour la quantité (prendre la plus récente)
				const updatedItem = await prisma.cartItem.update({
					where: { id: existingItem.id },
					data: {
						quantity: Math.max(existingItem.quantity, localItem.quantity),
						price: localItem.price,
					},
				});
				syncedItems.push(updatedItem);
			} else {
				// Créer un nouvel article
				const newItem = await prisma.cartItem.create({
					data: {
						userId,
						productId: localItem.productId,
						colorName: localItem.color,
						sizeName: localItem.size,
						quantity: localItem.quantity,
						price: localItem.price,
					},
				});
				syncedItems.push(newItem);
			}
		}

		// Ajouter les articles qui n'existent que en base
		for (const dbItem of dbCartItems) {
			const existsInLocal = localCartItems.some(
				(localItem) =>
					localItem.productId === dbItem.productId &&
					localItem.color === dbItem.colorName &&
					localItem.size === dbItem.sizeName
			);

			if (!existsInLocal) {
				syncedItems.push(dbItem);
			}
		}

		// Enrichir les données avec les détails Sanity
		const enrichedItems = await enrichCartItems(syncedItems);

		return NextResponse.json({ cartItems: enrichedItems }, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la synchronisation du panier:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la synchronisation" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		// Vérifier l'authentification
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;

		// Récupérer le panier depuis la base de données
		const cartItems = await prisma.cartItem.findMany({
			where: { userId },
		});

		// Enrichir les données avec les détails Sanity
		const enrichedItems = await enrichCartItems(cartItems);

		return NextResponse.json({ cartItems: enrichedItems }, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la récupération du panier:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération" },
			{ status: 500 }
		);
	}
}
