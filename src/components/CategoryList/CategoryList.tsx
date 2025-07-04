"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const categories = [
	{ id: 1, name: "Abayas", image: "/assets/grid/img1.jpeg" },
	{ id: 2, name: "Kimonos", image: "/assets/grid/img2.jpeg" },
	{ id: 3, name: "Robes", image: "/assets/grid/img3.jpeg" },
	{ id: 4, name: "Tuniques", image: "/assets/grid/img4.jpeg" },
	{ id: 5, name: "Jupes", image: "/assets/grid/img5.jpeg" },
	{ id: 6, name: "Pantalons", image: "/assets/grid/img6.jpeg" },
	{ id: 7, name: "Accessoires", image: "/assets/grid/img7.jpeg" },
	{ id: 8, name: "Écharpes", image: "/assets/grid/img9.jpeg" },
	{ id: 9, name: "Voiles", image: "/assets/grid/img12.jpeg" },
	{ id: 10, name: "Ensembles", image: "/assets/grid/img10.jpeg" },
	{ id: 11, name: "Caftans", image: "/assets/grid/img11.jpeg" },
];

export default function CategoryList() {
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
				<h2 className="text-5xl lg:text-6xl font-alex-brush text-logo mb-4 mt-10">
					Nos Collections
				</h2>
				<p className="text-nude-dark-2 font-light text-lg lg:text-xl">
					Découvrez nos catégories élégantes
				</p>
			</div>

			{/* Container de scroll */}
			<div className="relative">
				{/* Masques de fade-out sur les bords */}
				<div className="absolute left-0 top-0 bottom-0 w-18 lg:w-32 bg-gradient-to-r from-rose-light  to-rose-light/50 z-10 pointer-events-none"></div>
				<div className="absolute right-0 top-0 bottom-0 w-18 lg:w-32 bg-gradient-to-l from-rose-light  to-rose-light/50 z-10 pointer-events-none"></div>

				<div
					ref={scrollContainerRef}
					className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
					style={{ scrollSnapType: "x mandatory" }}
				>
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/list?cat=${category.name.toLowerCase()}`}
							className="flex-shrink-0 w-64 h-80 group"
							style={{ scrollSnapAlign: "center" }}
						>
							<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl">
								<Image
									src={category.image}
									alt={category.name}
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
						className="bg-white/80 hover:bg-white text-logo p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
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
						className="bg-white/80 hover:bg-white text-logo p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
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
