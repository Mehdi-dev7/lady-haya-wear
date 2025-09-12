import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST - Soumettre un avis client
export async function POST(request: NextRequest) {
	try {
		const { token, reviews } = await request.json();

		if (!token || !reviews || !Array.isArray(reviews)) {
			return NextResponse.json(
				{ error: "Token et avis requis" },
				{ status: 400 }
			);
		}

		// Vérifier que le token est valide et récupérer les reviews correspondantes
		const existingReviews = await prisma.review.findMany({
			where: {
				emailToken: token,
				status: "PENDING",
				emailSentAt: {
					not: null,
					// Vérifier que le token n'a pas expiré (30 jours)
					gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
				},
			},
			include: {
				order: {
					select: {
						orderNumber: true,
						customerName: true,
					},
				},
			},
		});

		if (existingReviews.length === 0) {
			return NextResponse.json(
				{ error: "Token invalide ou expiré" },
				{ status: 404 }
			);
		}

		let updatedReviews = 0;
		const errors = [];

		// Mettre à jour chaque review soumis
		for (const reviewData of reviews) {
			const { productId, rating, comment } = reviewData;

			// Validation
			if (!productId || !rating || rating < 1 || rating > 5) {
				errors.push(`Données invalides pour le produit ${productId}`);
				continue;
			}

			try {
				// Trouver le review correspondant
				const existingReview = existingReviews.find(
					(r) => r.productId === productId
				);

				if (!existingReview) {
					errors.push(`Review non trouvé pour le produit ${productId}`);
					continue;
				}

				// Mettre à jour le review
				await prisma.review.update({
					where: {
						id: existingReview.id,
					},
					data: {
						rating: parseInt(rating),
						comment: comment || "",
						submittedAt: new Date(),
						// Le statut reste PENDING pour modération admin
					},
				});

				updatedReviews++;
			} catch (error) {
				console.error(`Erreur pour le produit ${productId}:`, error);
				errors.push(`Erreur pour le produit ${productId}`);
			}
		}

		// Si au moins un avis a été soumis, invalider le token
		if (updatedReviews > 0) {
			await prisma.review.updateMany({
				where: {
					emailToken: token,
				},
				data: {
					emailToken: null, // Invalider le token après utilisation
				},
			});
		}

		return NextResponse.json({
			message: "Avis soumis avec succès",
			updatedReviews,
			errors: errors.length > 0 ? errors : undefined,
			orderInfo: existingReviews[0]?.order,
		});
	} catch (error) {
		console.error("Erreur lors de la soumission des avis:", error);
		return NextResponse.json(
			{
				error: "Erreur lors de la soumission",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}

// GET - Récupérer les informations d'un token pour afficher le formulaire
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get("token");

		if (!token) {
			return NextResponse.json({ error: "Token requis" }, { status: 400 });
		}

		// Récupérer les reviews associées au token
		const reviews = await prisma.review.findMany({
			where: {
				emailToken: token,
				status: "PENDING",
				emailSentAt: {
					not: null,
					// Vérifier que le token n'a pas expiré (30 jours)
					gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
				},
			},
			include: {
				order: {
					select: {
						orderNumber: true,
						customerName: true,
						createdAt: true,
					},
				},
			},
		});

		if (reviews.length === 0) {
			return NextResponse.json(
				{ error: "Token invalide ou expiré" },
				{ status: 404 }
			);
		}

		// Préparer les données pour le formulaire
		const orderInfo = {
			orderNumber: reviews[0].order.orderNumber,
			customerName: reviews[0].order.customerName,
			orderDate: reviews[0].order.createdAt.toLocaleDateString("fr-FR"),
		};

		const products = reviews.map((review) => ({
			id: review.productId,
			name: review.productName,
			currentRating: review.rating > 0 ? review.rating : null,
			currentComment: review.comment || "",
		}));

		return NextResponse.json({
			orderInfo,
			products,
			token,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération du token:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération" },
			{ status: 500 }
		);
	}
}
