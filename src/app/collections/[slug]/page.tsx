import { urlFor } from "@/lib/sanity";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/sanity-queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CollectionPageProps {
	params: {
		slug: string;
	};
}

export default async function CollectionPage({ params }: CollectionPageProps) {
	const category = await getCategoryBySlug(params.slug);

	if (!category) {
		notFound();
	}

	const products = await getProductsByCategory(params.slug);

	return (
		<div>
			{/* Header de la collection */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-200/40 py-16">
				<div className="flex flex-col md:flex-row items-center gap-8">
					{/* Image de la collection */}
					<div className="relative w-full md:w-1/3 h-80 rounded-2xl overflow-hidden shadow-lg">
						{category.image ? (
							<Image
								src={urlFor(category.image)?.url() || "/assets/placeholder.jpg"}
								alt={category.image.alt || category.name}
								fill
								sizes="33vw"
								className="object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center">
								<span className="text-6xl">👗</span>
							</div>
						)}
					</div>

					{/* Informations de la collection */}
					<div className="flex-1 text-center md:text-left">
						<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
							{category.name}
						</h1>

						{category.description && (
							<p className="text-lg text-nude-dark mb-6 max-w-2xl">
								{category.description}
							</p>
						)}

						<div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
							<Link
								href="/collections"
								className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
							>
								← Toutes les collections
							</Link>

							<Link
								href="/"
								className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
							>
								Accueil
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Produits de la collection */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-beige-light py-16">
				{/* En-tête des produits */}
				<div className="text-center mb-12">
					<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
						{products.length} produit{products.length > 1 ? "s" : ""} dans cette
						collection
					</h2>

					{/* Filtres (optionnel) */}
					<div className="flex justify-center gap-2">
						<select className="px-4 py-2 border border-nude-dark rounded-2xl focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white">
							<option value="">Trier par</option>
							<option value="price-asc">Prix croissant</option>
							<option value="price-desc">Prix décroissant</option>
							<option value="newest">Plus récents</option>
						</select>
					</div>
				</div>

				{/* Grille des produits */}
				{products.length > 0 ? (
					<div className="flex gap-x-8 gap-y-16 justify-between flex-wrap">
						{products.map((product, index) => (
							<Link
								key={product._id}
								href="/products"
								className={`w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 ${
									index % 2 === 0 ? "bg-nude-light" : "bg-rose-light-2"
								}`}
							>
								{/* Image du produit */}
								<div className="relative w-full h-80 rounded-2xl overflow-hidden group">
									{product.images && product.images.length > 0 ? (
										<>
											{/* Image principale */}
											<Image
												src={
													urlFor(product.images[0])?.url() ||
													"/assets/placeholder.jpg"
												}
												alt={product.images[0].alt || product.name}
												fill
												sizes="25vw"
												className="absolute object-cover rounded-2xl transition-opacity duration-500 group-hover:opacity-0"
											/>
											
											{/* Image de hover (deuxième image) */}
											{product.images.length > 1 && (
												<Image
													src={
														urlFor(product.images[1])?.url() ||
														"/assets/placeholder.jpg"
													}
													alt={product.images[1].alt || product.name}
													fill
													sizes="25vw"
													className="absolute object-cover rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
												/>
											)}
										</>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center rounded-2xl">
											<span className="text-4xl">🛍️</span>
										</div>
									)}

									{/* Badge "Nouveau" si le produit est récent */}
									{product.isNew && (
										<div className="absolute top-2 left-2 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-medium z-20">
											Nouveau
										</div>
									)}
								</div>

								{/* Informations du produit */}
								<div className="flex justify-between">
									<span className="font-medium text-nude-dark">
										{product.name}
									</span>
									<span className="font-semibold text-nude-dark">
										{product.price.toFixed(2)}€
									</span>
								</div>

								{product.description && (
									<div className="text-sm text-gray-500 line-clamp-2">
										{product.description}
									</div>
								)}

								{/* Statut stock */}
								<div className="flex justify-between items-center">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											product.inStock
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{product.inStock ? "En stock" : "Rupture"}
									</span>
								</div>

								{/* Boutons d'action */}
								<div className="flex items-center justify-between gap-3 pointer-events-none">
									<button className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-2 px-4 text-xs hover:bg-red-400 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto">
										Ajouter au panier
									</button>
									<button className="p-2 hover:scale-110 transition-transform duration-200 cursor-pointer pointer-events-auto">
										<svg
											className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors duration-200"
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
							</Link>
						))}
					</div>
				) : (
					/* Message si aucun produit */
					<div className="text-center py-16">
						<div className="text-6xl mb-4">🛍️</div>
						<h3 className="text-2xl font-alex-brush text-logo mb-2">
							Aucun produit dans cette collection
						</h3>
						<p className="text-nude-dark mb-6">
							Cette collection sera bientôt disponible avec de nouveaux
							produits.
						</p>
						<Link
							href="/collections"
							className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-3 px-6 text-sm hover:bg-red-400 hover:text-white transition-all duration-300"
						>
							Voir toutes les collections
						</Link>
					</div>
				)}
			</section>

			{/* Section CTA */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<div className="text-center">
					<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
						Vous aimez cette collection ?
					</h2>
					<p className="text-lg text-nude-dark mb-8 max-w-2xl mx-auto">
						Découvrez nos autres collections pour compléter votre garde-robe
						avec des pièces élégantes et tendance.
					</p>
					<Link
						href="/collections"
						className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-3 px-6 text-sm hover:bg-red-400 hover:text-white transition-all duration-300"
					>
						Découvrir toutes nos collections
					</Link>
				</div>
			</section>
		</div>
	);
}
