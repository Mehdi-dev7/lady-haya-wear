"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface Product {
	id: string;
	name: string;
	currentRating: number | null;
	currentComment: string;
}

interface OrderInfo {
	orderNumber: string;
	customerName: string;
	orderDate: string;
}

interface ReviewFormData {
	[productId: string]: {
		rating: number;
		comment: string;
	};
}

// Composant interne qui utilise useSearchParams
function ReviewPageContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [reviews, setReviews] = useState<ReviewFormData>({});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) {
			setError("Token manquant");
			setLoading(false);
			return;
		}

		fetchReviewData();
	}, [token]);

	const fetchReviewData = async () => {
		try {
			console.log("🔍 Fetching review data for token:", token);
			const response = await fetch(`/api/reviews/submit?token=${token}`);
			const data = await response.json();

			console.log("📥 Response status:", response.status);
			console.log("📥 Response data:", data);

			if (!response.ok) {
				console.error("❌ API Error:", data.error);
				throw new Error(data.error || "Erreur lors du chargement");
			}

			setOrderInfo(data.orderInfo);
			setProducts(data.products);

			// Initialiser les reviews avec les données existantes
			const initialReviews: ReviewFormData = {};
			data.products.forEach((product: Product) => {
				initialReviews[product.id] = {
					rating: product.currentRating || 0,
					comment: product.currentComment || "",
				};
			});
			setReviews(initialReviews);
			console.log("✅ Data loaded successfully");
		} catch (err) {
			console.error("❌ Error:", err);
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

	const handleRatingChange = (productId: string, rating: number) => {
		setReviews((prev) => ({
			...prev,
			[productId]: {
				...prev[productId],
				rating,
			},
		}));
	};

	const handleCommentChange = (productId: string, comment: string) => {
		setReviews((prev) => ({
			...prev,
			[productId]: {
				...prev[productId],
				comment,
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			// Préparer les données pour l'API
			const reviewsData = Object.entries(reviews)
				.filter(([_, review]) => review.rating > 0) // Seulement les produits avec une note
				.map(([productId, review]) => ({
					productId,
					rating: review.rating,
					comment: review.comment,
				}));

			if (reviewsData.length === 0) {
				throw new Error("Veuillez donner au moins une note");
			}

			const response = await fetch("/api/reviews/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					reviews: reviewsData,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Erreur lors de la soumission");
			}

			setSubmitted(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setSubmitting(false);
		}
	};

	const renderStars = (productId: string, currentRating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<button
				key={i}
				type="button"
				onClick={() => handleRatingChange(productId, i + 1)}
				className={`w-8 h-8 ${
					i < currentRating ? "text-yellow-400" : "text-gray-300"
				} hover:text-yellow-400 transition-colors`}
			>
				<svg fill="currentColor" viewBox="0 0 20 20">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			</button>
		));
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-light via-beige-light to-nude-light pt-24">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo mx-auto mb-4"></div>
					<p className="text-nude-dark">Chargement...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-light via-beige-light to-nude-light pt-24">
				<div className="max-w-md mx-auto text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
					<div className="text-red-500 text-6xl mb-4">❌</div>
					<h1 className="text-2xl font-bold text-nude-dark-2 mb-4">Erreur</h1>
					<p className="text-nude-dark mb-6">{error}</p>
					<a
						href="/"
						className="inline-block bg-logo text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
					>
						Retour à l'accueil
					</a>
				</div>
			</div>
		);
	}

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-light via-beige-light to-nude-light pt-24">
				<div className="max-w-md mx-auto text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
					<div className="text-green-500 text-6xl mb-4">✅</div>
					<h1 className="text-2xl font-bold text-nude-dark-2 mb-4">Merci !</h1>
					<p className="text-nude-dark mb-6">
						Votre avis a été soumis avec succès. Il sera examiné par notre
						équipe avant publication.
					</p>
					<a
						href="/"
						className="inline-block bg-logo text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
					>
						Retour à l'accueil
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-rose-light via-beige-light to-nude-light py-12 pt-24">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8 mt-8">
					<h1 className="text-5xl font-alex-brush text-logo mb-4">
						Votre Avis Nous Intéresse
					</h1>
					{orderInfo && (
						<div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
							<p className="text-nude-dark-2 text-lg">
								<strong>Commande #{orderInfo.orderNumber}</strong>
							</p>
							<p className="text-nude-dark">
								{orderInfo.customerName} • {orderInfo.orderDate}
							</p>
						</div>
					)}
				</div>

				{/* Formulaire */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl"
						>
							<h3 className="text-xl font-semibold text-nude-dark-2 mb-4">
								{product.name}
							</h3>

							{/* Étoiles */}
							<div className="mb-4">
								<label className="block text-sm font-medium text-nude-dark mb-2">
									Note *
								</label>
								<div className="flex space-x-1">
									{renderStars(product.id, reviews[product.id]?.rating || 0)}
								</div>
								{reviews[product.id]?.rating > 0 && (
									<p className="text-sm text-nude-dark mt-1">
										{reviews[product.id].rating} étoile
										{reviews[product.id].rating > 1 ? "s" : ""}
									</p>
								)}
							</div>

							{/* Commentaire */}
							<div>
								<label className="block text-sm font-medium text-nude-dark mb-2">
									Commentaire (optionnel)
								</label>
								<textarea
									value={reviews[product.id]?.comment || ""}
									onChange={(e) =>
										handleCommentChange(product.id, e.target.value)
									}
									placeholder="Partagez votre expérience avec ce produit..."
									rows={3}
									className="dashboard-input w-full px-4 py-3 border border-gray-200 rounded-lg resize-none transition-all duration-200"
								/>
							</div>
						</div>
					))}

					{/* Bouton de soumission */}
					<div className="text-center">
						<button
							type="submit"
							disabled={submitting}
							className="bg-logo text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							{submitting ? "Envoi en cours..." : "Envoyer mon avis"}
						</button>
					</div>
				</form>

				{/* Note */}
				<div className="mt-8 text-center">
					<p className="text-nude-dark text-sm">
						Votre avis sera examiné par notre équipe avant publication.
						<br />
						Merci de contribuer à l'amélioration de notre service !
					</p>
				</div>
			</div>
		</div>
	);
}

// Composant principal avec Suspense
export default function ReviewPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-light via-beige-light to-nude-light pt-24">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo mx-auto mb-4"></div>
						<p className="text-nude-dark">Chargement...</p>
					</div>
				</div>
			}
		>
			<ReviewPageContent />
		</Suspense>
	);
}
