import { enrichFavorites } from "@/lib/syncUtils";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type LocalFavorite = {
	productId: string;
};

export async function POST(request: NextRequest) {
	try {
		// Vérifier l'authentification
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;

		const { localFavorites }: { localFavorites: LocalFavorite[] } =
			await request.json();

		// Récupérer les favoris existants en base de données
		const dbFavorites = await prisma.favorite.findMany({
			where: { userId },
		});

		// Synchroniser : fusionner les favoris locaux avec ceux de la base
		const syncedFavorites = [];

		// Ajouter les favoris locaux à la base s'ils n'existent pas
		for (const localFav of localFavorites) {
			try {
				// Utiliser upsert avec une gestion d'erreur plus robuste
				const favorite = await prisma.favorite.upsert({
					where: {
						userId_productId: {
							userId,
							productId: localFav.productId,
						},
					},
					update: {
						// Rien à mettre à jour, le favori existe déjà
					},
					create: {
						userId,
						productId: localFav.productId,
					},
				});
				syncedFavorites.push(favorite);
			} catch (error: any) {
				// Si c'est une erreur de contrainte unique, essayer de récupérer l'existant
				if (error.code === "P2002") {
					try {
						const existingFav = await prisma.favorite.findUnique({
							where: {
								userId_productId: {
									userId,
									productId: localFav.productId,
								},
							},
						});
						if (existingFav) {
							syncedFavorites.push(existingFav);
						}
					} catch (findError) {
						console.error(
							`Erreur lors de la récupération du favori ${localFav.productId}:`,
							findError
						);
					}
				} else {
					console.error(
						`Erreur lors de l'upsert du favori ${localFav.productId}:`,
						error
					);
				}
			}
		}

		// Ajouter les favoris qui n'existent que en base
		for (const dbFav of dbFavorites) {
			const existsInLocal = localFavorites.some(
				(localFav) => localFav.productId === dbFav.productId
			);

			if (!existsInLocal) {
				syncedFavorites.push(dbFav);
			}
		}

		// Enrichir les données avec les détails Sanity
		const enrichedFavorites = await enrichFavorites(syncedFavorites);

		return NextResponse.json({ favorites: enrichedFavorites }, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la synchronisation des favoris:", error);
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

		// Récupérer les favoris depuis la base de données
		const favorites = await prisma.favorite.findMany({
			where: { userId },
		});

		// Enrichir les données avec les détails Sanity
		const enrichedFavorites = await enrichFavorites(favorites);

		return NextResponse.json({ favorites: enrichedFavorites }, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la récupération des favoris:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération" },
			{ status: 500 }
		);
	}
}
