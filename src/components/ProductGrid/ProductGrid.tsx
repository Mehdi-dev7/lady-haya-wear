"use client";

import { useFavorites } from "@/lib/FavoritesContext";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import Filter from "../Filter/Filter";

interface ProductGridProps {
	products: any[];
	title?: string;
	showFilters?: boolean;
	categories?: any[];
}

export default function ProductGrid({
	products,
	title,
	showFilters = false,
	categories = [],
}: ProductGridProps) {
	const { favorites, toggleFavorite } = useFavorites();
	const [filteredProducts, setFilteredProducts] = useState(products);

	// Mettre à jour les produits filtrés quand les produits changent
	useEffect(() => {
		setFilteredProducts(products);
	}, [products]);

	const handleToggleFavorite = (product: any, e: React.MouseEvent) => {
		e.preventDefault(); // Empêcher la navigation du Link
		e.stopPropagation();

		// Vérifier si le produit est actuellement dans les favoris
		const isCurrentlyInFavorites = favorites.some(
			(fav) => fav.productId === product._id
		);

		// Créer l'objet Product attendu par le contexte
		const productForFavorites = {
			productId: product._id,
			name: product.name,
			price: product.price || 0,
			originalPrice: product.originalPrice,
			image: urlFor(product.mainImage)?.url() || "/assets/placeholder.jpg",
			imageAlt: product.mainImage?.alt || product.name,
			slug: product.slug?.current || product._id,
			category: product.category,
		};

		toggleFavorite(productForFavorites);

		// Notification pour les favoris
		if (isCurrentlyInFavorites) {
			toast.info(`${product.name} retiré des favoris`, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		} else {
			toast.success(`${product.name} ajouté aux favoris !`, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	};

	return (
		<div className="mb-12">
			{title && (
				<div className="text-center mb-12">
					<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
						{title}
					</h2>
				</div>
			)}

			{/* Filtres avancés */}
			{showFilters && (
				<Filter
					products={products}
					onFilterChange={setFilteredProducts}
					categories={categories}
				/>
			)}

			{filteredProducts.length > 0 ? (
				<div className="flex gap-x-6 gap-y-8 sm:gap-y-16 justify-start flex-wrap">
					{filteredProducts.map((product, index) => (
						<Link
							key={product._id}
							href={`/products/${product.slug?.current || product._id}`}
							className={`w-full flex flex-col gap-4 sm:w-[45%] lg:w-[27%] xl:w-[25%] group p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 ${index % 2 === 0 ? "bg-[#d9c4b5]/80" : "bg-rose-light-2"}`}
						>
							{/* Image du produit */}
							<div className="relative w-full h-[28rem] rounded-2xl overflow-hidden group">
								{/* Image principale */}
								<Image
									src={
										urlFor(product.mainImage)?.url() ||
										"/assets/placeholder.jpg"
									}
									alt={product.mainImage?.alt || product.name}
									fill
									sizes="25vw"
									className="absolute object-cover rounded-2xl transition-opacity duration-500 group-hover:opacity-0"
								/>

								{/* Image de hover */}
								{product.hoverImage && (
									<Image
										src={
											urlFor(product.hoverImage)?.url() ||
											"/assets/placeholder.jpg"
										}
										alt={product.hoverImage?.alt || product.name}
										fill
										sizes="25vw"
										className="absolute object-cover rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									/>
								)}

								{/* Badge "Nouveau" si le produit est récent */}
								{product.isNew && (
									<div className="absolute top-2 left-2 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-medium z-20">
										Nouveau
									</div>
								)}
							</div>

							{/* Informations du produit */}
							<div className="flex flex-col gap-2">
								<h3 className="font-medium text-nude-dark-2 text-lg">
									{product.name}
								</h3>
								<p className="text-sm text-gray-500 line-clamp-2">
									{product.shortDescription}
								</p>

								{/* Prix */}
								<div className="flex items-center gap-2 mt-2">
									{product.originalPrice &&
										product.originalPrice > product.price && (
											<span className="text-sm text-gray-400 line-through">
												{product.originalPrice.toFixed(2)} €
											</span>
										)}
									<span className="text-lg font-semibold text-nude-dark">
										{product.price
											? `${product.price.toFixed(2)} €`
											: "Prix sur demande"}
									</span>
								</div>
							</div>

							{/* Boutons d'action */}
							<div className="flex items-center justify-between gap-3 pointer-events-none">
								<button className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-2 px-4 text-xs hover:bg-red-400 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto">
									Voir le produit
								</button>
								<button
									onClick={(e) => handleToggleFavorite(product, e)}
									className="p-2 hover:scale-110 transition-transform duration-200 cursor-pointer pointer-events-auto"
								>
									{favorites.some((fav) => fav.productId === product._id) ? (
										<FaHeart className="text-xl text-red-400" />
									) : (
										<FiHeart className="text-xl text-gray-400 hover:text-red-400 transition-colors duration-200" />
									)}
								</button>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<div className="text-6xl mb-4">🛍️</div>
					<h3 className="text-2xl font-alex-brush text-logo mb-2">
						Aucun produit trouvé
					</h3>
					<p className="text-nude-dark mb-6">
						Aucun produit ne correspond à vos critères.
					</p>
				</div>
			)}
		</div>
	);
}
