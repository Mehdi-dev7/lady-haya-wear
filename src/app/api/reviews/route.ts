import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Récupérer les reviews approuvées pour affichage public
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "20");
		const page = parseInt(searchParams.get("page") || "1");
		const productId = searchParams.get("productId");

		// Construire les filtres
		const where: any = {
			status: "APPROVED",
			rating: {
				gte: 1, // Seulement les reviews avec une note
			},
		};

		if (productId) {
			where.productId = productId;
		}

		// Calculer l'offset pour la pagination
		const offset = (page - 1) * limit;

		// Récupérer les reviews avec pagination
		const [reviews, totalCount] = await Promise.all([
			prisma.review.findMany({
				where,
				select: {
					id: true,
					rating: true,
					comment: true,
					customerName: true,
					productName: true,
					productId: true,
					submittedAt: true,
					reviewedAt: true,
				},
				orderBy: { reviewedAt: "desc" }, // Les plus récemment approuvés en premier
				skip: offset,
				take: limit,
			}),
			prisma.review.count({ where }),
		]);

		// Calculer les statistiques
		const stats = await prisma.review.groupBy({
			by: ["rating"],
			where: {
				status: "APPROVED",
				rating: {
					gte: 1,
				},
			},
			_count: {
				rating: true,
			},
		});

		const ratingStats = stats.reduce(
			(acc, stat) => {
				acc[stat.rating] = stat._count.rating;
				return acc;
			},
			{} as Record<number, number>
		);

		// Calculer la moyenne des notes
		const totalReviews = Object.values(ratingStats).reduce(
			(sum, count) => sum + count,
			0
		);
		const weightedSum = Object.entries(ratingStats).reduce(
			(sum, [rating, count]) => sum + parseInt(rating) * count,
			0
		);
		const averageRating = totalReviews > 0 ? weightedSum / totalReviews : 0;

		// Formater les reviews pour l'affichage
		const formattedReviews = reviews.map((review) => ({
			id: review.id,
			name: review.customerName,
			review: review.comment || "Client satisfait", // Texte par défaut si pas de commentaire
			rating: review.rating,
			date:
				review.submittedAt?.toLocaleDateString("fr-FR") ||
				review.reviewedAt?.toLocaleDateString("fr-FR") ||
				"",
			productName: review.productName,
			productId: review.productId,
		}));

		return NextResponse.json({
			reviews: formattedReviews,
			pagination: {
				page,
				limit,
				total: totalCount,
				totalPages: Math.ceil(totalCount / limit),
			},
			stats: {
				total: totalReviews,
				average: parseFloat(averageRating.toFixed(1)),
				ratings: ratingStats,
			},
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des reviews:", error);
		return NextResponse.json(
			{
				error: "Erreur lors de la récupération des avis",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}

// POST - Créer un nouvel avis (pour les tests ou l'admin)
export async function POST(request: NextRequest) {
	try {
		const {
			userId,
			orderId,
			productId,
			productName,
			rating,
			comment,
			customerName,
			customerEmail,
		} = await request.json();

		// Validation des données
		if (
			!userId ||
			!orderId ||
			!productId ||
			!rating ||
			!customerName ||
			!customerEmail
		) {
			return NextResponse.json(
				{ error: "Données manquantes" },
				{ status: 400 }
			);
		}

		if (rating < 1 || rating > 5) {
			return NextResponse.json(
				{ error: "La note doit être entre 1 et 5" },
				{ status: 400 }
			);
		}

		// Vérifier si un avis existe déjà pour ce produit/commande
		const existingReview = await prisma.review.findUnique({
			where: {
				userId_orderId_productId: {
					userId,
					orderId,
					productId,
				},
			},
		});

		if (existingReview) {
			return NextResponse.json(
				{ error: "Un avis existe déjà pour ce produit dans cette commande" },
				{ status: 409 }
			);
		}

		// Créer le nouvel avis
		const review = await prisma.review.create({
			data: {
				userId,
				orderId,
				productId,
				productName,
				rating,
				comment: comment || "",
				customerName,
				customerEmail,
				status: "PENDING", // En attente de modération
				submittedAt: new Date(),
			},
		});

		return NextResponse.json({
			message: "Avis créé avec succès",
			review: {
				id: review.id,
				rating: review.rating,
				comment: review.comment,
				status: review.status,
			},
		});
	} catch (error) {
		console.error("Erreur lors de la création de l'avis:", error);
		return NextResponse.json(
			{
				error: "Erreur lors de la création de l'avis",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}
