import AddProducts from "@/components/AddProducts/AddProducts";
import CustomizeProducts from "@/components/CustomizeProducts/CustomizeProducts";
import ProductImages from "@/components/ProductImages/ProductImages";
import { urlFor } from "@/lib/sanity";
import {
	getAllProductDetails,
	getProductDetailBySlug,
} from "@/lib/sanity-queries";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { slug } = await params;
	const product = await getProductDetailBySlug(slug);

	if (!product) {
		notFound();
	}

	// Récupérer tous les produits détaillés pour la navigation
	const allProducts = await getAllProductDetails();
	const currentIndex = allProducts.findIndex((p) => p._id === product._id);
	const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
	const nextProduct =
		currentIndex < allProducts.length - 1
			? allProducts[currentIndex + 1]
			: null;

	// Combiner toutes les images pour la galerie
	const allImages = [
		...product.colors.map((color) => color.productImage),
		...(product.galleryImages || []),
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-beige-light to-rose-light-2">
			{/* Header avec navigation */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-200/40 py-8">
				<div className="flex items-center justify-between">
					<Link
						href="/collections"
						className="flex items-center gap-2 text-nude-dark hover:text-logo transition-colors duration-300"
					>
						<svg
							className="w-5 h-5"
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
						Retour aux collections
					</Link>

					{/* Navigation entre produits */}
					<div className="flex items-center gap-4">
						{prevProduct && (
							<Link
								href={`/products/${prevProduct.slug?.current || prevProduct._id}`}
								className="flex items-center gap-2 text-nude-dark hover:text-logo transition-colors duration-300"
							>
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
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								Précédent
							</Link>
						)}

						<span className="text-nude-dark text-sm">
							{currentIndex + 1} / {allProducts.length}
						</span>

						{nextProduct && (
							<Link
								href={`/products/${nextProduct.slug?.current || nextProduct._id}`}
								className="flex items-center gap-2 text-nude-dark hover:text-logo transition-colors duration-300"
							>
								Suivant
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
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						)}
					</div>
				</div>
			</section>

			{/* Contenu principal */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16">
				<div className="flex flex-col lg:flex-row gap-16">
					{/* Images du produit */}
					<div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
						<div className="bg-white rounded-3xl shadow-xl p-6">
							<ProductImages images={allImages} productName={product.name} />
						</div>
					</div>

					{/* Informations du produit */}
					<div className="w-full lg:w-1/2 flex flex-col gap-8">
						{/* En-tête du produit */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<div className="flex items-center gap-3 mb-4">
								{product.isNew && (
									<span className="bg-red-400 text-white px-3 py-1 rounded-full text-sm font-medium">
										Nouveau
									</span>
								)}
								{product.isPromo && (
									<span className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
										Promo {product.promoPercentage}%
									</span>
								)}
							</div>

							<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
								{product.name}
							</h1>

							<p className="text-lg text-nude-dark mb-6 leading-relaxed">
								{product.description}
							</p>

							{/* Prix */}
							<div className="flex items-center gap-4 mb-6">
								{product.isPromo && product.originalPrice && (
									<h3 className="text-xl text-gray-400 line-through">
										{product.originalPrice.toFixed(2)}€
									</h3>
								)}
								<h3 className="font-medium text-3xl text-logo">
									{product.price.toFixed(2)}€
								</h3>
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
						</div>

						{/* Sélection des couleurs */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<h2 className="text-2xl font-alex-brush text-logo mb-6">
								Couleurs disponibles
							</h2>
							<div className="flex flex-wrap gap-4">
								{product.colors.map((color, index) => (
									<div
										key={index}
										className={`relative cursor-pointer group ${
											!color.available ? "opacity-50" : ""
										}`}
									>
										<div
											className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-logo transition-colors duration-300"
											style={{ backgroundColor: color.hexCode }}
											title={color.name}
										/>
										{!color.available && (
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="text-red-500 text-lg">×</span>
											</div>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Sélection des tailles */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<h2 className="text-2xl font-alex-brush text-logo mb-6">
								Tailles disponibles
							</h2>
							<div className="flex flex-wrap gap-3">
								{product.sizes.map((size, index) => (
									<button
										key={index}
										className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
											size.available
												? "border-nude-dark text-nude-dark hover:bg-nude-dark hover:text-white"
												: "border-gray-300 text-gray-400 cursor-not-allowed"
										}`}
										disabled={!size.available}
									>
										{size.size} {size.available && `(${size.quantity})`}
									</button>
								))}
							</div>
						</div>

						{/* Personnalisation */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<h2 className="text-2xl font-alex-brush text-logo mb-6">
								Personnaliser votre produit
							</h2>
							<CustomizeProducts />
						</div>

						{/* Ajouter au panier */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<h2 className="text-2xl font-alex-brush text-logo mb-6">
								Ajouter à votre panier
							</h2>
							<AddProducts />
						</div>

						{/* Informations détaillées */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<h2 className="text-2xl font-alex-brush text-logo mb-6">
								Informations produit
							</h2>

							<div className="space-y-6">
								{/* Description détaillée */}
								<div>
									<h4 className="font-medium text-nude-dark mb-3">
										Description
									</h4>
									<p className="text-nude-dark leading-relaxed">
										{product.description}
									</p>
								</div>

								{/* Livraison */}
								<div>
									<h4 className="font-medium text-nude-dark mb-3">
										Livraison & retour
									</h4>
									<p className="text-nude-dark leading-relaxed">
										Livraison gratuite à partir de 50€. Retours acceptés sous 30
										jours. Votre satisfaction est notre priorité.
									</p>
								</div>

								{/* Paiements sécurisés */}
								<div>
									<h4 className="font-medium text-nude-dark mb-3">
										Paiements sécurisés
									</h4>
									<p className="text-nude-dark leading-relaxed">
										Paiement 100% sécurisé par carte bancaire, PayPal ou Apple
										Pay. Vos données sont protégées.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section produits similaires */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<div className="text-center mb-12">
					<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
						Vous aimerez aussi
					</h2>
					<p className="text-lg text-nude-dark max-w-2xl mx-auto">
						Découvrez nos autres produits qui pourraient vous plaire
					</p>
				</div>

				{/* Grille de produits similaires */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{allProducts.slice(0, 4).map((relatedProduct, index) => (
						<Link
							key={relatedProduct._id}
							href={`/products/${relatedProduct.slug?.current || relatedProduct._id}`}
							className={`group p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 ${
								index % 2 === 0 ? "bg-nude-light" : "bg-rose-light-2"
							}`}
						>
							<div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4">
								{relatedProduct.colors && relatedProduct.colors.length > 0 ? (
									<img
										src={
											urlFor(relatedProduct.colors[0].productImage)?.url() ||
											"/assets/placeholder.jpg"
										}
										alt={
											relatedProduct.colors[0].productImage?.alt ||
											relatedProduct.name ||
											"Produit"
										}
										className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
									/>
								) : (
									<div className="w-full h-full bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center rounded-2xl">
										<span className="text-4xl">🛍️</span>
									</div>
								)}
							</div>

							<div className="text-center">
								<h3 className="font-medium text-nude-dark mb-2">
									{relatedProduct.name}
								</h3>
								<p className="font-semibold text-logo">
									{relatedProduct.price.toFixed(2)}€
								</p>
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
