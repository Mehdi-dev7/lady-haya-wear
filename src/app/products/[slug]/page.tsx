import ProductImages from "@/components/ProductImages/ProductImages";
import { urlFor } from "@/lib/sanity";
import {
	getAllProductDetails,
	getProductDetailBySlug,
} from "@/lib/sanity-queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
	params: {
		slug: string;
	};
}

export default async function ProductPage({ params }: ProductPageProps) {
	const product = await getProductDetailBySlug(params.slug);

	if (!product) {
		notFound();
	}

	const allProducts = await getAllProductDetails();
	const currentIndex = allProducts.findIndex(
		(p) => p.slug?.current === params.slug
	);
	const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
	const nextProduct =
		currentIndex < allProducts.length - 1
			? allProducts[currentIndex + 1]
			: null;

	// Produits similaires (même catégorie)
	const similarProducts = allProducts
		.filter(
			(p) =>
				p.category?._ref === product.category?._ref && p._id !== product._id
		)
		.slice(0, 4);

	// Combiner toutes les images pour la galerie
	const allImages = [
		...product.colors.map((color) => color.productImage),
		...(product.galleryImages || []),
	];

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
						<ProductImages images={allImages} productName={product.name} />
					</div>

					{/* Informations du produit */}
					<div className="space-y-6">
						{/* En-tête */}
						<div>
							{/* Badges */}
							<div className="flex gap-2 mb-4">
								{product.isNew && (
									<span className="bg-red-400 text-white px-3 py-1 rounded-full text-xs font-medium">
										Nouveau
									</span>
								)}
								{product.isPromo && (
									<span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
										Promo {product.promoPercentage}%
									</span>
								)}
							</div>

							<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-2">
								{product.name}
							</h1>
						</div>

						{/* Prix */}
						<div className="flex items-center gap-4">
							{product.isPromo && product.originalPrice && (
								<span className="text-xl text-gray-400 line-through">
									{product.originalPrice.toFixed(2)} €
								</span>
							)}
							<div className="text-3xl font-semibold text-red-400">
								{product.price.toFixed(2)} €
							</div>
						</div>

						{/* Stock */}
						<div className="mb-6">
							<span
								className={`px-4 py-2 rounded-full text-sm font-medium ${
									product.stockQuantity > 0
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{product.stockQuantity > 0
									? `${product.stockQuantity} en stock`
									: "Rupture de stock"}
							</span>
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
										{product.colors.map((color, index) => (
											<button
												key={index}
												className={`relative group ${!color.available ? "opacity-50" : ""}`}
												title={color.name}
												disabled={!color.available}
											>
												<div
													className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-red-400 transition-colors overflow-hidden"
													style={{ backgroundColor: color.hexCode }}
												>
													<Image
														src={
															urlFor(color.productImage)?.url() ||
															"/assets/placeholder.jpg"
														}
														alt={color.name}
														width={48}
														height={48}
														className="object-cover"
													/>
												</div>
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

							{/* Tailles */}
							{product.sizes && product.sizes.length > 0 && (
								<div>
									<h3 className="text-lg font-medium text-nude-dark mb-3">
										Taille
									</h3>
									<div className="flex gap-2">
										{product.sizes.map((size, index) => (
											<button
												key={index}
												className={`px-4 py-2 border border-nude-dark rounded-lg transition-colors ${
													size.available
														? "hover:bg-nude-dark hover:text-white"
														: "opacity-50 cursor-not-allowed"
												}`}
												disabled={!size.available}
											>
												{size.size} {size.available && `(${size.quantity})`}
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
								<div className="flex items-center gap-3">
									<button className="w-10 h-10 border border-nude-dark rounded-lg hover:bg-nude-dark hover:text-white transition-colors">
										-
									</button>
									<span className="w-16 text-center text-lg">1</span>
									<button className="w-10 h-10 border border-nude-dark rounded-lg hover:bg-nude-dark hover:text-white transition-colors">
										+
									</button>
								</div>
							</div>
						</div>

						{/* Boutons d'action */}
						<div className="flex gap-4 pt-6">
							<button className="flex-1 bg-red-400 text-white py-4 px-6 rounded-2xl hover:bg-red-500 transition-colors font-medium">
								Ajouter au panier
							</button>
							<button className="p-4 border border-red-400 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-colors">
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
				<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-8 border-t border-gray-200">
					<div className="flex justify-between items-center">
						{prevProduct ? (
							<Link
								href={`/products/${prevProduct.slug?.current}`}
								className="flex items-center gap-3 group"
							>
								<svg
									className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
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
								<div className="text-left">
									<p className="text-sm text-nude-dark">Précédent</p>
									<p className="font-medium">{prevProduct.name}</p>
								</div>
							</Link>
						) : (
							<div></div>
						)}

						{nextProduct ? (
							<Link
								href={`/products/${nextProduct.slug?.current}`}
								className="flex items-center gap-3 group text-right"
							>
								<div>
									<p className="text-sm text-nude-dark">Suivant</p>
									<p className="font-medium">{nextProduct.name}</p>
								</div>
								<svg
									className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
							</Link>
						) : (
							<div></div>
						)}
					</div>
				</section>
			)}

			{/* Produits similaires */}
			{similarProducts.length > 0 && (
				<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16 bg-white/50">
					<h2 className="text-3xl font-alex-brush text-logo text-center mb-12">
						Vous aimerez aussi
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{similarProducts.map((similarProduct) => (
							<Link
								key={similarProduct._id}
								href={`/products/${similarProduct.slug?.current}`}
								className="group"
							>
								<div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
									{similarProduct.colors && similarProduct.colors.length > 0 ? (
										<Image
											src={
												urlFor(similarProduct.colors[0].productImage)?.url() ||
												"/assets/placeholder.jpg"
											}
											alt={
												similarProduct.colors[0].productImage?.alt ||
												similarProduct.name
											}
											fill
											sizes="25vw"
											className="object-cover transition-transform group-hover:scale-105"
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center">
											<span className="text-4xl">🛍️</span>
										</div>
									)}
								</div>
								<h3 className="font-medium text-nude-dark">
									{similarProduct.name}
								</h3>
								<p className="text-red-400 font-semibold">
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
