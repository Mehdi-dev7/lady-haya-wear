import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { getAllCategories, getAllProducts } from "@/lib/sanity-queries";

export default async function AllProducts() {
	// Ces appels déclencheront le fichier error.tsx en cas d'erreur
	const [products, categories] = await Promise.all([
		getAllProducts(),
		getAllCategories(),
	]);

	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header de la page */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16">
				<div className="text-center">
					<h1 className="text-5xl lg:text-6xl font-alex-brush text-logo mt-12 lg:mt-14 mb-4">
						Tous nos produits
					</h1>
					<p className="text-lg text-nude-dark mb-6 max-w-2xl mx-auto">
						Découvrez notre collection complète de vêtements élégants et
						tendance pour femmes musulmanes. Des pièces uniques qui allient
						style et confort.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<div className="text-sm text-nude-dark bg-rose-light-2 px-4 py-2 rounded-full">
							{products.length} produit{products.length > 1 ? "s" : ""}{" "}
							disponible{products.length > 1 ? "s" : ""}
						</div>
					</div>
				</div>
			</section>

			{/* Grille des produits */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-2 mb-16">
				<ProductGrid
					products={products}
					title=""
					showFilters={true}
					categories={categories}
				/>
			</section>

			{/* Section CTA */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<div className="text-center">
					<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
						Vous ne trouvez pas votre bonheur ?
					</h2>
					<p className="text-lg text-nude-dark mb-8 max-w-2xl mx-auto">
						Nos collections sont régulièrement mises à jour avec de nouvelles
						pièces. N'hésitez pas à nous contacter pour des demandes spéciales.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/contact"
							className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
						>
							Nous contacter
						</a>
						<a
							href="/collections"
							className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
						>
							Voir par collection
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
