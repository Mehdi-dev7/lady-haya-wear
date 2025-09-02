"use client";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryListProps {
	categories: any[];
}

export default function CategoryList({ categories }: CategoryListProps) {
	const [currentIndex, setCurrentIndex] = useState(1); // Commencer par la 2ème image
	const [isLargeScreen, setIsLargeScreen] = useState(false);
	const [screenWidth, setScreenWidth] = useState(1200);

	// Détecter la taille d'écran côté client
	useEffect(() => {
		const checkScreenSize = () => {
			const width = window.innerWidth;
			setScreenWidth(width);
			setIsLargeScreen(width >= 1536);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	// Pas d'auto-rotation - l'utilisateur contrôle

	const goToNext = () => {
		setCurrentIndex((prev) => {
			// Bloquer si on est déjà au dernier élément
			if (prev >= categories.length - 1) {
				return prev;
			}
			return prev + 1;
		});
	};

	const goToPrev = () => {
		setCurrentIndex((prev) => {
			// Bloquer si on est déjà au premier élément
			if (prev <= 0) {
				return prev;
			}
			return prev - 1;
		});
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	// Fonction pour calculer la position et l'effet 3D inspiré du CSS de référence
	const getSlideStyle = (index: number) => {
		const diff = index - currentIndex;
		const absDistance = Math.abs(diff);

		let transform = "";
		let opacity = 1;
		let zIndex = 1;
		let filter = "none";

		// Espacement réduit pour éviter les débordements sur les côtés
		const baseSpacing = isLargeScreen ? 250 : 180;

		// Système de z-index relatif : chaque image domine celles plus éloignées
		const calculateZIndex = (distance: number) => {
			// Plus la distance est faible, plus le z-index est élevé
			// Mais on laisse de l'espace pour que chaque niveau puisse dominer le suivant
			return 100 - distance * 10;
		};

		if (absDistance === 0) {
			// Slide centrale - priorité maximale
			transform = "translateX(0) rotateY(0deg) scale(1) translateZ(0px)";
			opacity = 1;
			zIndex = calculateZIndex(0); // 100
			filter = "drop-shadow(0px 8px 24px rgba(18, 28, 53, 0.3))";
		} else if (absDistance === 1) {
			// Slides adjacentes - dominent distance 2+
			const side = diff > 0 ? 1 : -1;
			transform = `translateX(${side * baseSpacing}px) rotateY(${-side * 45}deg) scale(0.8) translateZ(-100px)`;
			opacity = 0.8;
			zIndex = calculateZIndex(1); // 90
			filter = "drop-shadow(0px 6px 18px rgba(18, 28, 53, 0.2))";
		} else if (absDistance === 2) {
			// Slides en 2ème position - bien visibles, plus proches
			const side = diff > 0 ? 1 : -1;
			transform = `translateX(${side * (baseSpacing * 1.1)}px) rotateY(${-side * 65}deg) scale(0.6) translateZ(-200px)`;
			opacity = 0.4; // Plus visible
			zIndex = calculateZIndex(2); // 80
			filter = "drop-shadow(0px 4px 12px rgba(18, 28, 53, 0.15))";
		} else {
			// Slides en 3ème position et plus - complètement cachées pour éviter débordement
			const side = diff > 0 ? 1 : -1;
			transform = `translateX(${side * (baseSpacing * 1.2)}px) rotateY(${-side * 80}deg) scale(0.4) translateZ(-300px)`;
			opacity = 0; // Complètement invisible
			zIndex = 0; // Tout au fond
			filter = "none";
		}

		// Masquage CSS simplifié pour 3 niveaux
		let clipPath = "none";
		if (absDistance === 2) {
			const side = diff > 0 ? 1 : -1;
			if (side > 0) {
				// Image à droite - masquer légèrement le côté gauche qui dépasse
				clipPath = "polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%)";
			} else {
				// Image à gauche - masquer légèrement le côté droit qui dépasse
				clipPath = "polygon(0% 0%, 80% 0%, 80% 100%, 0% 100%)";
			}
		} else if (absDistance >= 3) {
			// Images en 3ème position et plus - complètement masquées
			clipPath = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"; // Masque tout
		}

		return {
			transform,
			opacity,
			zIndex,
			filter,
			clipPath,
		};
	};

	return (
		<div className="relative px-4 py-1 md:py-2 overflow-hidden">
			{/* Titre de section */}
			<div className="text-center mb-2 md:mb-4">
				<h2 className="text-5xl lg:text-6xl font-alex-brush text-logo mb-2 md:mb-4 md:mt-2">
					Nos Collections
				</h2>
				<p className="text-nude-dark-2 font-light text-lg lg:text-xl">
					Découvrez nos collections élégantes
				</p>
			</div>

			{/* Container 3D Coverflow avec masquage des côtés */}
			<div className="relative h-[600px] lg:h-[700px] 2xl:h-[800px] flex items-center justify-center perspective-1000 overflow-hidden">
				<div className="relative w-full max-w-4xl 2xl:max-w-5xl h-full flex items-center justify-center overflow-hidden">
					{categories.map((category, index) => {
						const slideStyle = getSlideStyle(index);
						const absDistance = Math.abs(index - currentIndex);

						// Rendre seulement 3 positions : centre + 2 de chaque côté pour éviter débordement
						if (absDistance > 2) return null;

						return (
							<div
								key={category._id}
								className="absolute w-96 h-[28rem] lg:w-[26rem] lg:h-[32rem] 2xl:w-[30rem] 2xl:h-[36rem] transition-all duration-700 ease-out cursor-pointer preserve-3d"
								style={slideStyle}
								onClick={() => goToSlide(index)}
							>
								<Link
									href={`/collections/${category.slug?.current || category._id}`}
									className="block w-full h-full group"
								>
									<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl transform-gpu">
										<Image
											src={
												category.image
													? urlFor(category.image)?.url() ||
														"/assets/placeholder.jpg"
													: "/assets/placeholder.jpg"
											}
											alt={category.image?.alt || category.name}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											className="object-cover transition-all duration-500 group-hover:scale-105"
										/>

										{/* Overlay gradient */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										{/* Contenu de la carte */}
										<div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
											<h3 className="text-xl font-balqis font-semibold mb-2">
												{category.name}
											</h3>
											<p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
												Découvrir la collection
											</p>
										</div>
									</div>
								</Link>
							</div>
						);
					})}
				</div>
			</div>

			{/* Boutons de navigation */}
			<div className="flex justify-center gap-4">
				<button
					onClick={goToPrev}
					disabled={currentIndex <= 0}
					className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
						currentIndex <= 0
							? "bg-gray-300/50 text-gray-400 cursor-not-allowed"
							: "bg-white/80 hover:bg-white text-logo hover:scale-110 cursor-pointer"
					}`}
					aria-label="Précédent"
				>
					<svg
						className="w-4 h-4 lg:w-6 lg:h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<button
					onClick={goToNext}
					disabled={currentIndex >= categories.length - 1}
					className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
						currentIndex >= categories.length - 1
							? "bg-gray-300/50 text-gray-400 cursor-not-allowed"
							: "bg-white/80 hover:bg-white text-logo hover:scale-110 cursor-pointer"
					}`}
					aria-label="Suivant"
				>
					<svg
						className="w-4 h-4 lg:w-6 lg:h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			{/* Indicateurs de pagination */}
			<div className="flex flex-col items-center gap-2 md:gap-3 mt-1 md:mt-2">
				{/* Compteur */}
				<div className="text-sm text-nude-dark font-medium">
					{currentIndex + 1} / {categories.length}
				</div>

				{/* Dots avec opacité */}
				<div className="flex justify-center gap-2">
					{categories.map((category, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
								index === currentIndex
									? "bg-logo opacity-100 scale-125"
									: index < currentIndex
										? "bg-logo opacity-50"
										: "bg-logo opacity-20 hover:opacity-40"
							}`}
							aria-label={`Aller à ${category.name} (${index + 1}/${categories.length})`}
							title={category.name}
						/>
					))}
				</div>
			</div>

			<style jsx>{`
				.perspective-1000 {
					perspective: 1200px;
					perspective-origin: center center;
				}

				.preserve-3d {
					transform-style: preserve-3d;
					backface-visibility: hidden;
				}

				.shadow-3xl {
					box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
				}

				.transform-gpu {
					transform: translateZ(0);
					will-change: transform, opacity, filter;
				}

				/* Désactiver les ombres par défaut de swiper si présentes */
				.swiper-slide-shadow-left,
				.swiper-slide-shadow-right {
					display: none !important;
				}

				/* Améliorer les transitions 3D */
				.absolute {
					backface-visibility: hidden;
					-webkit-backface-visibility: hidden;
				}
			`}</style>
		</div>
	);
}
