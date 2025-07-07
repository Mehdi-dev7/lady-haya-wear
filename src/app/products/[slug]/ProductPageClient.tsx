"use client";

import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductPageClientProps {
	product: any;
	allImages: any[];
	prevProduct: any;
	nextProduct: any;
	similarProducts: any[];
}

export function ProductPageClient({
	product,
	allImages,
	prevProduct,
	nextProduct,
	similarProducts,
}: ProductPageClientProps) {
	const [selectedColorIndex, setSelectedColorIndex] = useState(0);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);

	// Couleur actuellement sélectionnée
	const selectedColor = product.colors[selectedColorIndex];

	// Toutes les images de la couleur sélectionnée
	const colorImages = selectedColor
		? [selectedColor.mainImage, ...(selectedColor.additionalImages || [])]
		: [];

	// Image actuellement affichée
	const currentImage =
		colorImages[selectedImageIndex] || selectedColor?.mainImage;

	// Tailles disponibles pour la couleur sélectionnée
	const availableSizes =
		selectedColor?.sizes?.filter((size: any) => size.available) || [];

	return (
		<div className="min-h-screen bg-beige-light">
			{/* Navigation breadcrumb */}
			<nav className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-4 bg-white/50">
				<div className="flex items-center gap-2 text-sm text-nude-dark">
					<Link href="/" className="hover:text-red-400 transition-colors">
						Accueil
					</Link>
					<span>/</span>
					<Link
						href="/collections"
						className="hover:text-red-400 transition-colors"
					>
						Collections
					</Link>
					<span>/</span>
					<span className="text-red-400">{product.name}</span>
				</div>
			</nav>

			{/* Section principale du produit */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Galerie d'images */}
					<div className="space-y-4">
						{/* Image principale */}
						<div className="h-[500px] relative rounded-2xl overflow-hidden shadow-lg">
							{currentImage ? (
								<Image
									src={urlFor(currentImage)?.url() || "/assets/placeholder.jpg"}
									alt={currentImage?.alt || product.name}
									fill
									sizes="50vw"
									className="object-cover rounded-2xl transition-all duration-300"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center">
									<span className="text-6xl">🛍️</span>
								</div>
							)}
						</div>

						{/* Miniatures des images de la couleur sélectionnée */}
						{colorImages && colorImages.length > 1 && (
							<div className="flex justify-start gap-4 mt-8">
								{colorImages.map((image: any, i: number) => (
									<div
										key={i}
										className={`w-1/4 h-32 relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
											selectedImageIndex === i
												? "ring-2 ring-nude-dark shadow-lg"
												: "hover:shadow-md"
										}`}
										onClick={() => setSelectedImageIndex(i)}
									>
										<Image
											src={urlFor(image)?.url() || "/assets/placeholder.jpg"}
											alt={
												image?.alt || `${selectedColor?.name} - Image ${i + 1}`
											}
											fill
											sizes="30vw"
											className="object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Informations du produit */}
					<div className="space-y-6">
						{/* En-tête */}
						<div>
							{/* Badges */}
							<div className="flex gap-2 mb-4">
								{product.badges?.isNew && (
									<span className="bg-red-400 text-white px-3 py-1 rounded-full text-xs font-medium">
										Nouveau
									</span>
								)}
								{product.badges?.isPromo && (
									<span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
										Promo {product.badges?.promoPercentage}%
									</span>
								)}
							</div>

							<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-2">
								{product.name}
							</h1>
						</div>

						{/* Prix */}
						<div className="flex items-center gap-4">
							{product.badges?.isPromo && product.originalPrice && (
								<span className="text-xl text-gray-400 line-through">
									{product.originalPrice.toFixed(2)} €
								</span>
							)}
							<div className="text-3xl font-semibold text-logo">
								{product.price.toFixed(2)} €
							</div>
						</div>

						{/* Description */}
						<div className="prose prose-lg max-w-none">
							<p className="text-nude-dark leading-relaxed">
								{product.description}
							</p>
						</div>

						{/* Sélecteurs */}
						<div className="space-y-6">
							{/* Couleurs */}
							{product.colors && product.colors.length > 0 && (
								<div>
									<h3 className="text-lg font-medium text-nude-dark mb-3">
										Couleur
									</h3>
									<div className="flex gap-3">
										{product.colors.map((color: any, index: number) => (
											<button
												key={index}
												className={`relative group ${!color.available ? "opacity-50" : ""}`}
												title={color.name}
												disabled={!color.available}
												onClick={() => {
													setSelectedColorIndex(index);
													setSelectedImageIndex(0);
													setSelectedSize(null);
												}}
											>
												<div
													className={`w-12 h-12 rounded-full border-2 transition-colors ${
														selectedColorIndex === index
															? "border-nude-dark ring-2 ring-nude-dark"
															: "border-gray-300 hover:border-red-400"
													}`}
													style={{ backgroundColor: color.hexCode }}
												/>
												{!color.available && (
													<div className="absolute inset-0 flex items-center justify-center">
														<span className="text-red-500 text-lg">×</span>
													</div>
												)}
												<span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-nude-dark opacity-0 group-hover:opacity-100 transition-opacity">
													{color.name}
												</span>
											</button>
										))}
									</div>
								</div>
							)}

							{/* Tailles pour la couleur sélectionnée */}
							{selectedColor &&
								selectedColor.sizes &&
								selectedColor.sizes.length > 0 && (
									<div>
										<h3 className="text-lg font-medium text-nude-dark mb-3">
											Taille
										</h3>
										<div className="flex gap-2">
											{selectedColor.sizes.map((size: any, index: number) => (
												<button
													key={index}
													className={`px-4 py-2 rounded-lg border-2 transition-colors ${
														size.available
															? selectedSize === size.size
																? "border-red-400 bg-red-400 text-white"
																: "border-gray-300 hover:border-red-400"
															: "border-gray-200 text-gray-400 cursor-not-allowed"
													}`}
													disabled={!size.available}
													onClick={() => setSelectedSize(size.size)}
												>
													{size.size}
													{size.available &&
														size.quantity <= 5 &&
														size.quantity > 0 && (
															<span className="ml-1 text-xs">
																({size.quantity})
															</span>
														)}
												</button>
											))}
										</div>
									</div>
								)}

							{/* Quantité */}
							<div>
								<h3 className="text-lg font-medium text-nude-dark mb-3">
									Quantité
								</h3>
								<div className="flex items-center gap-4">
									<button className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-red-400 flex items-center justify-center transition-colors">
										-
									</button>
									<span className="text-lg font-medium">1</span>
									<button className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-red-400 flex items-center justify-center transition-colors">
										+
									</button>
								</div>
							</div>

							{/* Boutons d'action */}
							<div className="flex gap-4">
								<button
									className="flex-1 bg-red-400 text-white py-4 px-6 rounded-2xl font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={!selectedSize}
								>
									{selectedSize
										? "Ajouter au panier"
										: "Sélectionnez une taille"}
								</button>
								<button className="p-4 border-2 border-red-400 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-colors">
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Informations supplémentaires */}
						<div className="border-t border-gray-200 pt-6 space-y-4">
							<div className="flex items-center gap-3">
								<svg
									className="w-5 h-5 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span className="text-sm text-nude-dark">
									Livraison gratuite dès 50€
								</span>
							</div>
							<div className="flex items-center gap-3">
								<svg
									className="w-5 h-5 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span className="text-sm text-nude-dark">
									Retours gratuits sous 30 jours
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Navigation entre produits */}
			{(prevProduct || nextProduct) && (
				<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-8 bg-white/50">
					<div className="flex justify-between items-center">
						{prevProduct && (
							<Link
								href={`/products/${prevProduct.slug?.current || prevProduct._id}`}
								className="flex items-center gap-4 group"
							>
								<div className="w-16 h-16 relative rounded-2xl overflow-hidden">
									<Image
										src={
											urlFor(prevProduct.colors?.[0]?.mainImage)?.url() ||
											"/assets/placeholder.jpg"
										}
										alt={prevProduct.name}
										fill
										sizes="64px"
										className="object-cover rounded-2xl"
									/>
								</div>
								<div className="text-left">
									<p className="text-sm text-gray-500">Précédent</p>
									<p className="font-medium text-nude-dark group-hover:text-red-400 transition-colors">
										{prevProduct.name}
									</p>
								</div>
							</Link>
						)}

						{nextProduct && (
							<Link
								href={`/products/${nextProduct.slug?.current || nextProduct._id}`}
								className="flex items-center gap-4 group ml-auto"
							>
								<div className="text-right">
									<p className="text-sm text-gray-500">Suivant</p>
									<p className="font-medium text-nude-dark group-hover:text-red-400 transition-colors">
										{nextProduct.name}
									</p>
								</div>
								<div className="w-16 h-16 relative rounded-2xl overflow-hidden">
									<Image
										src={
											urlFor(nextProduct.colors?.[0]?.mainImage)?.url() ||
											"/assets/placeholder.jpg"
										}
										alt={nextProduct.name}
										fill
										sizes="64px"
										className="object-cover rounded-2xl"
									/>
								</div>
							</Link>
						)}
					</div>
				</section>
			)}

			{/* Produits similaires */}
			{similarProducts.length > 0 && (
				<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16 bg-rose-light-2">
					<div className="text-center mb-12">
						<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
							Produits similaires
						</h2>
						<p className="text-lg text-nude-dark">
							Découvrez d'autres produits de cette collection
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{similarProducts.map((similarProduct) => (
							<Link
								key={similarProduct._id}
								href={`/products/${similarProduct.slug?.current || similarProduct._id}`}
								className="group"
							>
								<div className="relative h-80 rounded-2xl overflow-hidden shadow-lg mb-4">
									<Image
										src={
											urlFor(similarProduct.colors?.[0]?.mainImage)?.url() ||
											"/assets/placeholder.jpg"
										}
										alt={similarProduct.name}
										fill
										sizes="25vw"
										className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
								<h3 className="font-medium text-nude-dark text-lg mb-2">
									{similarProduct.name}
								</h3>
								<p className="text-2xl font-semibold text-logo">
									{similarProduct.price.toFixed(2)} €
								</p>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
