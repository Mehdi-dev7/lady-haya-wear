"use client";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface CategoryListProps {
	categories: any[];
}

export default function CategoryList({ categories }: CategoryListProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Positionner sur la 2ème image au chargement
	useEffect(() => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const cardWidth = container.children[0]?.clientWidth || 300;
			const gap = 16;
			const scrollPosition = cardWidth + gap; // Position pour la 2ème image

			// Petit délai pour s'assurer que le DOM est prêt
			setTimeout(() => {
				container.scrollTo({ left: scrollPosition, behavior: "smooth" });
			}, 100);
		}
	}, []);

	const scrollToNext = () => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const cardWidth = container.children[0]?.clientWidth || 300;
			const gap = 16;
			const scrollAmount = cardWidth + gap;
			container.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	const scrollToPrev = () => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const cardWidth = container.children[0]?.clientWidth || 300;
			const gap = 16;
			const scrollAmount = cardWidth + gap;
			container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<div className="relative px-4 py-8">
			{/* Titre de section */}
			<div className="text-center mb-8">
				<h2 className="text-5xl lg:text-6xl font-alex-brush text-logo mb-4 md:mt-2">
					Nos Collections
				</h2>
				<p className="text-nude-dark-2 font-light text-lg lg:text-xl">
					Découvrez nos collections élégantes
				</p>
			</div>

			{/* Container de scroll */}
			<div className="relative">
				{/* Masques de fade-out sur les bords (tablette et au-dessus) */}
				<div className="hidden md:block absolute left-0 top-0 bottom-0 w-18 lg:w-32 bg-gradient-to-r from-rose-light-2  to-rose-light/50 z-10 pointer-events-none"></div>
				<div className="hidden md:block absolute right-0 top-0 bottom-0 w-18 lg:w-32 bg-gradient-to-l from-rose-light-2  to-rose-light/50 z-10 pointer-events-none"></div>

				<div
					ref={scrollContainerRef}
					className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
					style={{ scrollSnapType: "x mandatory" }}
				>
					{categories.map((category) => (
						<Link
							key={category._id}
							href={`/collections/${category.slug?.current || category._id}`}
							className="flex-shrink-0 w-64 h-80 group"
							style={{ scrollSnapAlign: "center" }}
						>
							<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl">
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
					))}
				</div>

				{/* Boutons de navigation sous les images */}
				<div className="flex justify-center gap-4 mt-6">
					<button
						onClick={scrollToPrev}
						className="bg-white/80 hover:bg-white text-logo p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer"
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
						onClick={scrollToNext}
						className="bg-white/80 hover:bg-white text-logo p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer"
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
			</div>
		</div>
	);
}
