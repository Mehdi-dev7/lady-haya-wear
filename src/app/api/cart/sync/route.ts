import { enrichCartItems } from "@/lib/syncUtils";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type LocalCartItem = {
	productId: string;
	color: string;
	size: string;
	quantity: number;
	price: number;
};

type DBCartItem = {
	productId: string;
	colorName: string | null;
	sizeName: string | null;
	quantity: number;
	price: number;
	// autres champs éventuels
};

export async function POST(request: NextRequest) {
	console.log(
		"[API cart/sync] SYNC API appelée, cookies:",
		request.cookies.getAll()
	);
	try {
		// Vérifier l'authentification
		const token = request.cookies.get("auth-token")?.value;
		console.log("[API cart/sync] Token reçu:", token);
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		console.log("[API cart/sync] UserId décodé:", userId);

		const { localCartItems }: { localCartItems: LocalCartItem[] } =
			await request.json();

		// Récupérer le panier existant en base de données
		const dbCartItems: DBCartItem[] = await prisma.cartItem.findMany({
			where: { userId },
		});

		// Synchroniser : fusionner les articles locaux avec ceux de la base
		const syncedItems = [];

		// Ajouter/mettre à jour les articles locaux dans la base (utiliser upsert)
		for (const localItem of localCartItems) {
			try {
				const upsertedItem = await prisma.cartItem.upsert({
					where: {
						userId_productId_colorName_sizeName: {
							userId,
							productId: localItem.productId,
							colorName: localItem.color,
							sizeName: localItem.size,
						},
					},
					update: {
						quantity: Math.max(localItem.quantity, 1), // Prendre la quantité locale
						price: localItem.price,
					},
					create: {
						userId,
						productId: localItem.productId,
						colorName: localItem.color,
						sizeName: localItem.size,
						quantity: localItem.quantity,
						price: localItem.price,
					},
				});
				syncedItems.push(upsertedItem);
			} catch (error) {
				console.error(
					`Erreur lors de l'upsert de l'article ${localItem.productId}:`,
					error
				);
				// Essayer de récupérer l'enregistrement existant
				const existingItem = await prisma.cartItem.findUnique({
					where: {
						userId_productId_colorName_sizeName: {
							userId,
							productId: localItem.productId,
							colorName: localItem.color,
							sizeName: localItem.size,
						},
					},
				});
				if (existingItem) {
					syncedItems.push(existingItem);
				}
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
		console.log("[API cart/sync] Fin de sync, items en BDD:", syncedItems);

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
