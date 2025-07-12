export default function AllProductsLoading() {
	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 mt-18">
				<div className="text-center">
					<div className="animate-pulse">
						<div className="h-16 bg-nude-medium rounded-lg mb-4 max-w-lg mx-auto"></div>
						<div className="h-6 bg-nude-medium rounded-lg mb-6 max-w-2xl mx-auto"></div>
						<div className="h-8 bg-nude-medium rounded-full w-48 mx-auto"></div>
					</div>
				</div>
			</section>

			{/* Filters Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-2 mb-16">
				<div className="animate-pulse">
					<div className="flex flex-col lg:flex-row gap-4 mb-8">
						{/* Barre de recherche */}
						<div className="flex-1">
							<div className="h-12 bg-nude-medium rounded-2xl"></div>
						</div>
						{/* Bouton filtres */}
						<div className="w-32 h-12 bg-nude-medium rounded-2xl"></div>
					</div>

					{/* Grille de produits */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{[...Array(12)].map((_, i) => (
							<div
								key={i}
								className="bg-white rounded-2xl shadow-lg overflow-hidden"
							>
								<div className="animate-pulse">
									<div className="w-full h-80 bg-nude-medium"></div>
									<div className="p-4 space-y-3">
										<div className="h-5 bg-nude-medium rounded-lg"></div>
										<div className="h-4 bg-nude-medium rounded-lg w-3/4"></div>
										<div className="h-4 bg-nude-medium rounded-lg w-1/2"></div>
										<div className="flex justify-between items-center pt-2">
											<div className="h-6 bg-nude-medium rounded-lg w-16"></div>
											<div className="h-8 bg-nude-medium rounded-lg w-24"></div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Pagination Loading */}
					<div className="flex justify-center items-center gap-2 mt-12">
						<div className="h-10 w-24 bg-nude-medium rounded-lg"></div>
						<div className="flex gap-2">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="h-10 w-10 bg-nude-medium rounded-lg"
								></div>
							))}
						</div>
						<div className="h-10 w-24 bg-nude-medium rounded-lg"></div>
					</div>
				</div>
			</section>

			{/* CTA Section Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<div className="text-center">
					<div className="animate-pulse">
						<div className="h-12 bg-nude-medium rounded-lg mb-4 max-w-lg mx-auto"></div>
						<div className="h-6 bg-nude-medium rounded-lg mb-8 max-w-2xl mx-auto"></div>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<div className="h-12 w-32 bg-nude-medium rounded-2xl"></div>
							<div className="h-12 w-32 bg-nude-medium rounded-2xl"></div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
