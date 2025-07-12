"use client";

import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { getAllCategories, getAllProducts } from "@/lib/sanity-queries";
import { useEffect, useState } from "react";

export default function AllProducts() {
	const [products, setProducts] = useState<any[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(12); // 12 produits par page
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [allProducts, allCategories] = await Promise.all([
					getAllProducts(),
					getAllCategories(),
				]);
				setProducts(allProducts);
				setCategories(allCategories);
			} catch (error) {
				console.error("Erreur lors du chargement des données:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Calculer les produits à afficher pour la page actuelle
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = products.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);

	// Calculer le nombre total de pages
	const totalPages = Math.ceil(products.length / productsPerPage);

	// Fonction pour changer de page
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		// Scroll vers le haut de la grille
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-beige-light flex items-center justify-center">
				<div className="text-center">
					<div className="text-6xl mb-4">🛍️</div>
					<p className="text-nude-dark text-lg">Chargement des produits...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header de la page */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 mt-18">
				<div className="text-center">
					<h1 className="text-5xl lg:text-6xl font-alex-brush text-logo mb-4">
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
					products={currentProducts}
					title=""
					showFilters={true}
					categories={categories}
				/>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center items-center gap-2 mt-12">
						{/* Bouton précédent */}
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-4 py-2 rounded-lg border-2 border-nude-dark text-nude-dark hover:bg-nude-dark hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Précédent
						</button>

						{/* Numéros de pages */}
						<div className="flex gap-2">
							{Array.from({ length: totalPages }, (_, index) => index + 1).map(
								(pageNumber) => (
									<button
										key={pageNumber}
										onClick={() => handlePageChange(pageNumber)}
										className={`px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
											currentPage === pageNumber
												? "border-rose-dark bg-rose-dark text-white"
												: "border-nude-dark text-nude-dark hover:bg-nude-dark hover:text-white"
										}`}
									>
										{pageNumber}
									</button>
								)
							)}
						</div>

						{/* Bouton suivant */}
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="px-4 py-2 rounded-lg border-2 border-nude-dark text-nude-dark hover:bg-nude-dark hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Suivant
						</button>
					</div>
				)}

				{/* Indicateur de page */}
				{totalPages > 1 && (
					<div className="text-center mt-4 text-sm text-nude-dark">
						Page {currentPage} sur {totalPages} - {currentProducts.length}{" "}
						produit{currentProducts.length > 1 ? "s" : ""} affiché
						{currentProducts.length > 1 ? "s" : ""}
					</div>
				)}
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
