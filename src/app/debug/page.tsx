import ClearFavorites from "@/components/Debug/ClearFavorites";
import { getAllProductDetails } from "@/lib/sanity-queries";

export default async function DebugPage() {
	const allProductDetails = await getAllProductDetails();

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-8">
				Debug - Fiches Produits Détaillées
			</h1>

			{/* Composant de nettoyage des favoris */}
			<div className="mb-8">
				<ClearFavorites />
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">
					Nombre total de fiches : {allProductDetails.length}
				</h2>
			</div>

			{allProductDetails.map((product, index) => (
				<div key={product._id} className="border p-4 mb-4 rounded-lg">
					<h3 className="text-xl font-semibold mb-2">
						{index + 1}. {product.name}
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<p>
								<strong>ID:</strong> {product._id}
							</p>
							<p>
								<strong>Slug:</strong> {product.slug?.current || "AUCUN SLUG"}
							</p>
							<p>
								<strong>Prix:</strong> {product.price}€
							</p>
							<p>
								<strong>Produit associé:</strong>{" "}
								{product.product?.name || "AUCUN PRODUIT"}
							</p>
							<p>
								<strong>Catégorie:</strong>{" "}
								{product.category?.name || "AUCUNE CATÉGORIE"}
							</p>
						</div>

						<div>
							<p>
								<strong>Nombre de couleurs:</strong>{" "}
								{product.colors?.length || 0}
							</p>
							<p>
								<strong>Badges:</strong>{" "}
								{product.badges ? JSON.stringify(product.badges) : "Aucun"}
							</p>
							<p>
								<strong>Featured:</strong> {product.featured ? "Oui" : "Non"}
							</p>
						</div>
					</div>

					{product.colors && product.colors.length > 0 && (
						<div className="mt-4">
							<h4 className="font-semibold mb-2">Couleurs:</h4>
							{product.colors.map((color, colorIndex) => (
								<div
									key={colorIndex}
									className="ml-4 mb-2 p-2 bg-gray-100 rounded"
								>
									<p>
										<strong>Nom:</strong> {color.name}
									</p>
									<p>
										<strong>Disponible:</strong>{" "}
										{color.available ? "Oui" : "Non"}
									</p>
									<p>
										<strong>Image principale:</strong>{" "}
										{color.mainImage ? "✅" : "❌"}
									</p>
									<p>
										<strong>Images supplémentaires:</strong>{" "}
										{color.additionalImages?.length || 0}
									</p>
									<p>
										<strong>Tailles:</strong> {color.sizes?.length || 0}
									</p>

									{color.sizes && color.sizes.length > 0 && (
										<div className="ml-4 mt-2">
											<p className="font-medium">Détail des tailles:</p>
											{color.sizes.map((size, sizeIndex) => (
												<span
													key={sizeIndex}
													className="inline-block mr-2 text-xs"
												>
													{size.size}({size.quantity})
												</span>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{product.slug?.current && (
						<div className="mt-4">
							<a
								href={`/products/${product.slug.current}`}
								className="text-blue-600 hover:text-blue-800 underline"
								target="_blank"
							>
								Voir la page produit →
							</a>
						</div>
					)}
				</div>
			))}

			{allProductDetails.length === 0 && (
				<div className="text-center py-8">
					<h3 className="text-xl text-red-600">
						Aucune fiche produit détaillée trouvée !
					</h3>
					<p className="text-gray-600 mt-2">
						Vérifiez dans Sanity Studio que vous avez bien créé des fiches de
						type "productDetail"
					</p>
				</div>
			)}
		</div>
	);
}
