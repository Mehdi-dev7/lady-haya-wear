export default function CollectionLoading() {
	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header de la collection Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-nude-light py-16">
				<div className="flex flex-col md:flex-row items-center gap-8">
					{/* Image de la collection Loading */}
					<div className="relative w-full md:w-1/3 h-80 mt-8 lg:mt-14 rounded-2xl overflow-hidden shadow-lg animate-pulse">
						<div className="w-full h-full bg-nude-light"></div>
					</div>

					{/* Informations de la collection Loading */}
					<div className="flex-1 text-center md:text-left animate-pulse">
						<div className="h-12 bg-nude-light rounded-lg mb-4 max-w-md"></div>
						<div className="h-6 bg-nude-light rounded-lg mb-6 max-w-2xl"></div>
						<div className="h-8 bg-nude-light rounded-full w-32 mx-auto md:mx-0"></div>
					</div>
				</div>
			</section>

			{/* Grille des produits Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16">
				<div className="animate-pulse">
					{/* Filtres Loading */}
					<div className="flex flex-col lg:flex-row gap-4 mb-8">
						<div className="flex-1">
							<div className="h-12 bg-nude-light rounded-2xl"></div>
						</div>
						<div className="w-32 h-12 bg-nude-light rounded-2xl"></div>
					</div>

					{/* Grille de produits */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{[...Array(12)].map((_, i) => (
							<div
								key={i}
								className="bg-white rounded-2xl shadow-lg overflow-hidden"
							>
								<div className="animate-pulse">
									<div className="w-full h-80 bg-nude-light"></div>
									<div className="p-4 space-y-3">
										<div className="h-5 bg-nude-light rounded-lg"></div>
										<div className="h-4 bg-nude-light rounded-lg w-3/4"></div>
										<div className="h-4 bg-nude-light rounded-lg w-1/2"></div>
										<div className="flex justify-between items-center pt-2">
											<div className="h-6 bg-nude-light rounded-lg w-16"></div>
											<div className="h-8 bg-nude-light rounded-lg w-24"></div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
