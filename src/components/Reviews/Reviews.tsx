"use client";
import { useEffect, useState } from "react";

// Données de faux avis pour commencer
const fakeReviews = [
	{
		id: 1,
		name: "Sarah M.",
		review:
			"Absolument magnifique ! La qualité est exceptionnelle et le tissu est très confortable. Je recommande vivement !",
		rating: 5,
		date: "2024-01-15",
	},
	{
		id: 2,
		name: "Amina K.",
		review:
			"Très satisfaite de mon achat. Les couleurs sont encore plus belles qu'en photo et la coupe est parfaite.",
		rating: 5,
		date: "2024-01-12",
	},
	{
		id: 3,
		name: "Fatima L.",
		review:
			"Service client au top et livraison rapide. Les vêtements sont de très bonne qualité, je reviendrai !",
		rating: 5,
		date: "2024-01-10",
	},
	{
		id: 4,
		name: "Khadija B.",
		review:
			"Parfait pour les occasions spéciales. Le style est élégant et moderne, exactement ce que je cherchais.",
		rating: 5,
		date: "2024-01-08",
	},
	{
		id: 5,
		name: "Aicha R.",
		review:
			"Qualité premium et finitions impeccables. C'est devenu ma boutique préférée pour les vêtements féminins !",
		rating: 5,
		date: "2024-01-05",
	},
	{
		id: 6,
		name: "Leila D.",
		review:
			"Très belle collection et prix raisonnables. L'expérience d'achat était parfaite du début à la fin.",
		rating: 5,
		date: "2024-01-03",
	},
];

export default function Reviews() {
	const [currentReview, setCurrentReview] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Auto-rotation des avis
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentReview((prev) => (prev + 1) % fakeReviews.length);
		}, 4000); // Change toutes les 4 secondes

		return () => clearInterval(interval);
	}, [isAutoPlaying]);

	const goToReview = (index: number) => {
		setCurrentReview(index);
		setIsAutoPlaying(false);
		// Reprendre l'auto-play après 10 secondes
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<svg
				key={i}
				className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		));
	};

	return (
		<section className="relative py-16 bg-gradient-to-br from-rose-light via-beige-light to-nude-light overflow-hidden">
			{/* Background decoration */}
			

			<div className="relative z-10 max-w-6xl mx-auto px-4">
				{/* Titre de section */}
				<div className="text-center mb-12">
					<h2 className="text-5xl lg:text-6xl font-alex-brush text-logo mb-4">
						Nos Clientes Témoignent
					</h2>
					<p className="text-nude-dark-2 font-light text-lg lg:text-xl max-w-2xl mx-auto">
						Découvrez ce que nos clientes pensent de nos créations
					</p>
				</div>

				{/* Container des avis */}
				<div className="relative">
					{/* Avis principal */}
					<div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border-2 border-rose-dark max-w-4xl mx-auto">
						<div className="text-center">
							{/* Étoiles */}
							<div className="flex justify-center mb-6">
								{renderStars(fakeReviews[currentReview].rating)}
							</div>

							{/* Avis avec guillemets */}
							<div className="relative mb-8">
								<svg
									className="absolute -top-4 -left-4 w-12 h-12 text-rose-dark"
									fill="currentColor"
									viewBox="0 0 32 32"
								>
									<path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-4c0-2.2 1.8-4 4-4V8zM22 8c-3.3 0-6 2.7-6 6v10h10V14h-4c0-2.2 1.8-4 4-4V8z" />
								</svg>
								<blockquote className="text-lg lg:text-xl text-nude-dark-2 font-light italic leading-relaxed px-8">
									"{fakeReviews[currentReview].review}"
								</blockquote>
								<svg
									className="absolute -bottom-4 -right-4 w-12 h-12 text-rose-dark rotate-180"
									fill="currentColor"
									viewBox="0 0 32 32"
								>
									<path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-4c0-2.2 1.8-4 4-4V8zM22 8c-3.3 0-6 2.7-6 6v10h10V14h-4c0-2.2 1.8-4 4-4V8z" />
								</svg>
							</div>

							{/* Nom du client */}
							<div className="border-t border-logo pt-6">
								<p className="text-logo font-balqis text-xl font-semibold">
									{fakeReviews[currentReview].name}
								</p>
								<p className="text-nude-dark text-sm mt-1">Cliente vérifiée</p>
							</div>
						</div>
					</div>

					{/* Navigation dots */}
					<div className="flex justify-center mt-8 gap-3">
						{fakeReviews.map((_, index) => (
							<button
								key={index}
								onClick={() => goToReview(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
									index === currentReview
										? "bg-logo opacity-100 scale-125"
										: "bg-logo opacity-50 hover:opacity-70"
								}`}
								aria-label={`Voir l'avis ${index + 1}`}
							/>
						))}
					</div>

					{/* Message d'encouragement pour les premiers avis */}
					<div className="mt-12 text-center">
						<p className="text-nude-dark-2 font-light text-lg">
							Vos avis nous aident à grandir ✨
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
