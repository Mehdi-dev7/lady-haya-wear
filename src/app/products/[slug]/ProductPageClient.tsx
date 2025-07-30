"use client";

import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	TbChevronUp,
	TbCreditCard,
	TbHeadset,
	TbPackage,
	TbPackageExport,
	TbTruckDelivery,
} from "react-icons/tb";
import { toast } from "react-toastify";

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
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [showSizeGuide, setShowSizeGuide] = useState(false);
	const [showViewCart, setShowViewCart] = useState(false);
	const [similarProductsScrollRef, setSimilarProductsScrollRef] =
		useState<HTMLDivElement | null>(null);
	const router = useRouter();

	const { addToCart, cartItems } = useCart();
	const { favorites, toggleFavorite } = useFavorites();

	// Vérifier si le produit est dans les favoris
	const isInFavorites = favorites.some(
		(fav: any) => fav.productId === product._id
	);

	// Couleur actuellement sélectionnée
	const selectedColor = product.colors[selectedColorIndex];

	// Trouver la quantité de la taille sélectionnée
	const selectedSizeQuantity =
		(selectedSize &&
			selectedColor?.sizes?.find((size: any) => size.size === selectedSize)
				?.quantity) ||
		0;

	// Toutes les images de la couleur sélectionnée
	const colorImages = selectedColor
		? [selectedColor.mainImage, ...(selectedColor.additionalImages || [])]
		: [];

	// Image actuellement affichée
	const currentImage =
		colorImages[selectedImageIndex] || selectedColor?.mainImage;

	// Tailles disponibles pour la couleur sélectionnée
	const availableSizes =
		selectedColor?.sizes?.filter(
			(size: any) => size.available && size.quantity > 0
		) || [];

	// Vérifier si une couleur a des tailles disponibles
	const isColorAvailable = (color: any) => {
		return color.sizes?.some(
			(size: any) => size.available && size.quantity > 0
		);
	};

	const handleAddToCart = () => {
		if (!selectedSize || !selectedColor) {
			toast.error(
				"Veuillez sélectionner une taille avant d'ajouter au panier",
				{
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
			return;
		}

		setIsAddingToCart(true);

		// Simuler un délai pour l'ajout au panier
		setTimeout(() => {
			addToCart({
				productId: product.product?._id || product._id, // Toujours l'ID du produit principal
				name: product.name,
				price: product.price,
				originalPrice: product.originalPrice,
				image:
					urlFor(selectedColor.mainImage)?.url() || "/assets/placeholder.jpg",
				imageAlt: selectedColor.mainImage?.alt || product.name,
				color: selectedColor.name,
				colorHex: selectedColor.hexCode,
				size: selectedSize,
				quantity: quantity,
				maxQuantity: selectedSizeQuantity, // Stock maximum disponible
				slug: product.slug?.current || product._id,
			});

			setIsAddingToCart(false);
			setShowViewCart(true);
			// Réinitialiser la quantité à 1 après l'ajout
			setQuantity(1);
			// Notification de succès avec détails du produit
			toast.success(
				<div>
					<div className="font-semibold">Produit ajouté au panier !</div>
					<div className="text-sm opacity-90">
						{product.name} - {selectedColor.name} - Taille {selectedSize}
					</div>
					<div className="text-sm opacity-90">
						Quantité : {quantity} - {product.price.toFixed(2)} €
					</div>
				</div>,
				{
					position: "top-right",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
		}, 500);
	};

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity >= 1 && newQuantity <= selectedSizeQuantity) {
			setQuantity(newQuantity);
		}
	};

	const handleToggleFavorite = () => {
		const isCurrentlyInFavorites = favorites.some(
			(fav: any) => fav.productId === product._id
		);

		toggleFavorite({
			productId: product._id,
			name: product.name,
			price: product.price,
			originalPrice: product.originalPrice,
			image:
				urlFor(selectedColor?.mainImage)?.url() || "/assets/placeholder.jpg",
			imageAlt: selectedColor?.mainImage?.alt || product.name,
			slug: product.slug?.current || product._id,
			category: product.category,
		});

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

	// Fonctions pour le scroll horizontal des produits similaires
	const scrollSimilarProducts = (direction: "left" | "right") => {
		if (similarProductsScrollRef) {
			const scrollAmount = 280; // Largeur d'un produit + gap
			const currentScroll = similarProductsScrollRef.scrollLeft;
			const newScroll =
				direction === "left"
					? currentScroll - scrollAmount
					: currentScroll + scrollAmount;

			similarProductsScrollRef.scrollTo({
				left: newScroll,
				behavior: "smooth",
			});
		}
	};

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
				{/* Titre et badges - version mobile (au-dessus de l'image) */}
				<div className="block md:hidden mb-8">
					{/* Badges */}
					<div className="flex gap-2 mb-4 justify-center">
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

					<h1 className="text-4xl md:text-5xl font-alex-brush text-logo mb-2 text-center">
						{product.name}
					</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* Galerie d'images */}
					<div className="space-y-4 w-full max-w-[420px] md:w-[350px] lg:w-[450px] mx-auto lg:mx-0">
						{/* Image principale */}
						<div className="h-[400px] md:h-[450px] lg:h-[500px] relative rounded-2xl overflow-hidden shadow-lg">
							{currentImage ? (
								<Image
									src={urlFor(currentImage)?.url() || "/assets/placeholder.jpg"}
									alt={currentImage?.alt || product.name}
									fill
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
							<div className="flex justify-center lg:justify-start gap-2 lg:gap-4 mt-8">
								{colorImages.map((image: any, i: number) => (
									<div
										key={i}
										className={`w-20 h-20 lg:w-1/4 lg:h-32 relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
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
						{/* En-tête - version desktop */}
						<div className="hidden md:block">
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
							<div className="text-2xl md:text-3xl  font-semibold text-logo">
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
									<h3 className="text-xl font-medium text-nude-dark mb-3">
										Couleur
									</h3>
									<div className="flex gap-3">
										{product.colors.map((color: any, index: number) => {
											const isAvailable = isColorAvailable(color);
											return (
												<button
													key={index}
													className={`relative group ${!isAvailable ? "opacity-50" : ""}`}
													title={`${color.name}${!isAvailable ? " - Non disponible" : ""}`}
													disabled={!isAvailable}
													onClick={() => {
														if (isAvailable) {
															setSelectedColorIndex(index);
															setSelectedImageIndex(0);
															setSelectedSize(null);
														}
													}}
												>
													<div
														className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-colors ${
															selectedColorIndex === index
																? "border-nude-dark ring-2 ring-nude-dark"
																: "border-gray-300 hover:border-red-400"
														}`}
														style={{ backgroundColor: color.hexCode }}
													/>
													{!isAvailable && (
														<div className="absolute inset-0 flex items-center justify-center">
															<div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
														</div>
													)}
													<span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-nude-dark opacity-0 group-hover:opacity-100 transition-opacity">
														{color.name}
													</span>
												</button>
											);
										})}
									</div>
								</div>
							)}

							{/* Tailles pour la couleur sélectionnée */}
							{selectedColor &&
								selectedColor.sizes &&
								selectedColor.sizes.length > 0 && (
									<div>
										<h3 className="text-xl font-medium text-nude-dark mb-3">
											Taille
										</h3>
										<div className="flex gap-2">
											{selectedColor.sizes.map((size: any, index: number) => {
												const isAvailable = size.available && size.quantity > 0;
												return (
													<button
														key={index}
														className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 relative ${
															isAvailable
																? selectedSize === size.size
																	? "border-rose-dark bg-rose-dark text-white shadow-lg"
																	: "border-nude-dark text-nude-dark hover:border-rose-dark-2 hover:bg-rose-light hover:text-rose-dark-2 cursor-pointer"
																: "border-red-400 text-red-400 opacity-60 cursor-not-allowed"
														}`}
														disabled={!isAvailable}
														onClick={() =>
															isAvailable && setSelectedSize(size.size)
														}
													>
														{size.size}
														{!isAvailable && (
															<div className="absolute inset-0 flex items-center justify-center">
																<div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
															</div>
														)}
													</button>
												);
											})}
										</div>

										{/* Message d'alerte pour stock faible */}
										{selectedSize &&
											selectedSizeQuantity <= 3 &&
											selectedSizeQuantity > 0 && (
												<p className="text-xs text-black mt-4">
													⚠️ Il ne reste plus que{" "}
													<span className="font-bold text-red-500">
														{selectedSizeQuantity}
													</span>{" "}
													exemplaire{selectedSizeQuantity > 1 ? "s" : ""}
												</p>
											)}

										{/* Message si aucune taille n'est disponible */}
										{availableSizes.length === 0 && (
											<p className="text-sm text-red-500 mt-4">
												❌ Aucune taille disponible pour cette couleur
											</p>
										)}
									</div>
								)}

							{/* Guide des tailles */}
							<div className="border-t border-gray-200">
								<button
									onClick={() => setShowSizeGuide(!showSizeGuide)}
									className="flex items-center gap-2 text-nude-dark hover:text-rose-dark-2 transition-colors cursor-pointer"
								>
									<h2 className="text-lg font-medium">Guide des tailles</h2>
									<TbChevronUp
										className={`w-5 h-5 transition-transform duration-300 ${!showSizeGuide ? "rotate-180" : "rotate-0"}`}
									/>
								</button>

								{/* Contenu du guide des tailles */}
								{showSizeGuide && (
									<div className="mt-4 p-4 bg-rose-light-2 rounded-2xl border border-nude-light max-w-md">
										{/* Tableau des tailles */}
										<div>
											<h3 className="font-semibold text-nude-dark mb-3">
												Tailles disponibles
											</h3>
											<div className="space-y-2">
												{[
													{ size: "XS", height: "1M55-1M60" },
													{ size: "S", height: "1M60-1M65" },
													{ size: "M", height: "1M65-1M70" },
													{ size: "L", height: "1M70-1M75" },
													{ size: "XL", height: "1M75-1M80" },
													{ size: "XXL", height: "1M80-1M85" },
												].map((sizeInfo) => (
													<div
														key={sizeInfo.size}
														className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-nude-light"
													>
														<span className="font-semibold text-nude-dark">
															{sizeInfo.size}
														</span>
														<span className="text-sm text-gray-600">
															{sizeInfo.height}
														</span>
													</div>
												))}
											</div>

											<div className="mt-4 text-center">
												<Link
													href="/guide-tailles"
													className="inline-flex items-center gap-2 text-rose-dark-2 hover:text-rose-dark transition-colors text-sm font-medium underline"
												>
													Plus de détails sur les tailles
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
												</Link>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Quantité */}
							<div className="mb-10">
								<h3 className="text-xl font-medium text-nude-dark mb-3">
									Quantité
								</h3>
								<div className="flex items-center gap-4">
									<button
										onClick={() => handleQuantityChange(quantity - 1)}
										disabled={quantity <= 1}
										className="w-8 h-8 rounded-full ring-2 ring-nude-dark text-nude-dark hover:ring-rose-dark-2 hover:bg-rose-light hover:text-rose-dark-2 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										−
									</button>
									<div className="w-12 h-8 bg-white ring-2 ring-nude-dark rounded-lg flex items-center justify-center shadow-md">
										<span className="text-base font-semibold text-nude-dark">
											{quantity}
										</span>
									</div>
									<button
										onClick={() => handleQuantityChange(quantity + 1)}
										disabled={quantity >= selectedSizeQuantity}
										className="w-8 h-8 rounded-full ring-2 ring-nude-dark text-nude-dark hover:ring-rose-dark-2 hover:bg-rose-light hover:text-rose-dark-2 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										+
									</button>
								</div>
							</div>

							{/* Boutons d'action */}
							<div className="flex flex-col gap-4">
								{/* Boutons principaux - Ajouter au panier et Favori côte à côte */}
								<div className="flex gap-3 items-center justify-start sm:justify-center">
									<button
										onClick={handleAddToCart}
										disabled={!selectedSize || isAddingToCart}
										className="w-38 md:w-48 ring-2 ring-nude-dark text-nude-dark py-3 md:py-4 px-2 md:px-4 rounded-2xl font-medium hover:bg-rose-dark hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl text-sm md:text-base"
									>
										{isAddingToCart
											? "Ajout en cours..."
											: selectedSize
												? "Ajouter au panier"
												: "Choisir taille"}
									</button>
									<button
										onClick={handleToggleFavorite}
										className="w-18 md:w-28 py-3 md:py-4 px-2 md:px-4 ring-2 ring-nude-dark text-nude-dark rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center"
									>
										<svg
											className={`w-5 h-5 transition-all duration-300 ${
												isInFavorites ? "scale-110" : "scale-100"
											}`}
											fill={isInFavorites ? "currentColor" : "none"}
											stroke={isInFavorites ? "currentColor" : "currentColor"}
											style={{
												color: isInFavorites ? "#ef4444" : "currentColor",
											}}
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
								{/* Voir le panier - en dessous */}
								{(showViewCart || (cartItems && cartItems.length > 0)) && (
									<button
										className="w-38 md:w-48 ring-2 ring-nude-dark text-nude-dark py-3 md:py-4 px-2 md:px-4 rounded-2xl font-medium hover:bg-rose-dark hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl text-sm md:text-base sm:mx-auto"
										onClick={() => router.push("/cart")}
										type="button"
									>
										Voir le panier
									</button>
								)}
							</div>
						</div>

						{/* Informations supplémentaires */}
						<div className="border-t border-gray-200 pt-6 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{/* Livraison gratuite */}
								<div className="flex items-center gap-3 p-3 bg-nude-light rounded-lg shadow-sm border border-gray-100">
									<TbTruckDelivery className="w-6 h-6 text-green-500 flex-shrink-0" />
									<div>
										<div className="font-semibold text-sm text-nude-dark">
											Livraison gratuite
										</div>
										<div className="text-xs text-gray-600">Dès 60€ d'achat</div>
									</div>
								</div>

								{/* Paiement sécurisé */}
								<Link
									href="/services/paiement-securise"
									className="flex items-center gap-3 p-3 bg-nude-light rounded-lg shadow-sm border border-gray-100 hover:bg-nude-dark/10 transition-colors cursor-pointer"
								>
									<TbCreditCard className="w-6 h-6 text-blue-500 flex-shrink-0" />
									<div>
										<div className="font-semibold text-sm text-nude-dark">
											Paiement sécurisé
										</div>
										<div className="text-xs text-gray-600">
											CB, PayPal, Apple Pay
										</div>
									</div>
								</Link>

								{/* Satisfait ou remboursé */}
								<Link
									href="/services/retours"
									className="flex items-center gap-3 p-3 bg-nude-light rounded-lg shadow-sm border border-gray-100 hover:bg-nude-dark/10 transition-colors cursor-pointer"
								>
									<TbPackage className="w-6 h-6 text-orange-500 flex-shrink-0" />
									<div>
										<div className="font-semibold text-sm text-nude-dark">
											Echange possible dans les 30 jours
										</div>
									</div>
								</Link>

								{/* Service client */}
								<Link
									href="/services/service-client"
									className="flex items-center gap-3 p-3 bg-nude-light rounded-lg shadow-sm border border-gray-100 hover:bg-nude-dark/10 transition-colors cursor-pointer"
								>
									<TbHeadset className="w-6 h-6 text-purple-500 flex-shrink-0" />
									<div>
										<div className="font-semibold text-sm text-nude-dark">
											Service client
										</div>
										<div className="text-xs text-gray-600">Support 7j/7</div>
									</div>
								</Link>

								{/* Envoi rapide */}
								<Link
									href="/services/envoi-rapide"
									className="flex items-center gap-3 p-3 bg-nude-light rounded-lg shadow-sm border border-gray-100 hover:bg-nude-dark/10 transition-colors cursor-pointer"
								>
									<TbPackageExport className="w-6 h-6 text-red-500 flex-shrink-0" />
									<div>
										<div className="font-semibold text-sm text-nude-dark">
											Envoi rapide
										</div>
										<div className="text-xs text-gray-600">
											Livraison en 24-48h
										</div>
									</div>
								</Link>
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
								className="flex flex-col items-center gap-2 group hover:bg-rose-light-2 p-3 rounded-xl transition-all duration-300"
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
								<div className="text-center">
									<p className="text-sm md:text-base text-gray-500 flex items-center gap-1 justify-center">
										<svg
											className="w-3 h-3"
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
										Précédent
									</p>
									<p className="text-xs md:text-sm text-rose-dark-2 hover:text-nude-dark-2 transition-colors line-clamp-2">
										{prevProduct.name}
									</p>
								</div>
							</Link>
						)}

						{nextProduct && (
							<Link
								href={`/products/${nextProduct.slug?.current || nextProduct._id}`}
								className="flex flex-col items-center gap-2 group hover:bg-rose-light-2 p-3 rounded-xl transition-all duration-300"
							>
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
								<div className="text-center">
									<p className="text-sm md:text-base text-gray-500 flex items-center gap-1 justify-center">
										Suivant
										<svg
											className="w-3 h-3"
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
									</p>
									<p className="text-xs md:text-sm text-rose-dark-2 hover:text-nude-dark-2 transition-colors line-clamp-2">
										{nextProduct.name}
									</p>
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

					{/* Slider mobile - visible uniquement sur mobile */}
					<div className="md:hidden relative">
						{/* Container du slider */}
						<div
							ref={setSimilarProductsScrollRef}
							className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory justify-center"
						>
							{similarProducts.slice(0, 7).map((similarProduct) => (
								<Link
									key={similarProduct._id}
									href={`/products/${similarProduct.slug?.current || similarProduct._id}`}
									className="group flex-shrink-0 w-64 snap-start"
								>
									<div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
										<Image
											src={
												urlFor(similarProduct.colors?.[0]?.mainImage)?.url() ||
												"/assets/placeholder.jpg"
											}
											alt={similarProduct.name}
											fill
											sizes="256px"
											className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
										/>
										{/* Overlay avec dégradé pour le nom et prix */}
										<div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/90 via-white/60 to-transparent p-4 pb-2 flex flex-col justify-end">
											<h3 className="font-medium text-nude-dark text-sm mb-1 line-clamp-1 drop-shadow-sm">
												{similarProduct.name}
											</h3>
											<p className="text-lg font-semibold text-logo drop-shadow-sm">
												{similarProduct.price.toFixed(2)} €
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>

						{/* Boutons de navigation - sous l'image */}
						<div className="flex justify-center items-center gap-2 mt-4">
							<button
								onClick={() => scrollSimilarProducts("left")}
								className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-rose-light-2 hover:scale-110 transition-all duration-300 cursor-pointer"
								aria-label="Produits précédents"
							>
								<svg
									className="w-4 h-4 text-nude-dark"
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
								onClick={() => scrollSimilarProducts("right")}
								className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-rose-light-2 hover:scale-110 transition-all duration-300 cursor-pointer"
								aria-label="Produits suivants"
							>
								<svg
									className="w-4 h-4 text-nude-dark"
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

					{/* Grid desktop - visible uniquement sur desktop */}
					<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[450px] lg:max-w-[1000px] mx-auto lg:mx-0">
						{similarProducts.slice(0, 7).map((similarProduct) => (
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
