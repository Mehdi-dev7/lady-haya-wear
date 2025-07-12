export default function ProductLoading() {
	return (
		<div className="min-h-screen bg-beige-light">
			{/* Navigation breadcrumb Loading */}
			<nav className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-4 bg-white/50">
				<div className="animate-pulse">
					<div className="flex items-center gap-2">
						<div className="h-4 bg-nude-medium rounded w-16"></div>
						<div className="h-4 bg-nude-medium rounded w-4"></div>
						<div className="h-4 bg-nude-medium rounded w-20"></div>
						<div className="h-4 bg-nude-medium rounded w-4"></div>
						<div className="h-4 bg-nude-medium rounded w-24"></div>
					</div>
				</div>
			</nav>

			{/* Product Content Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Images Loading */}
					<div className="animate-pulse">
						{/* Image principale */}
						<div className="w-full h-96 lg:h-[600px] bg-nude-medium rounded-2xl mb-4"></div>

						{/* Miniatures */}
						<div className="flex gap-4">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="w-20 h-20 bg-nude-medium rounded-lg"
								></div>
							))}
						</div>
					</div>

					{/* Product Info Loading */}
					<div className="animate-pulse">
						{/* Titre */}
						<div className="h-8 bg-nude-medium rounded-lg mb-4 w-3/4"></div>

						{/* Prix */}
						<div className="flex items-center gap-4 mb-6">
							<div className="h-6 bg-nude-medium rounded w-20"></div>
							<div className="h-6 bg-nude-medium rounded w-16"></div>
						</div>

						{/* Description */}
						<div className="space-y-3 mb-8">
							<div className="h-4 bg-nude-medium rounded w-full"></div>
							<div className="h-4 bg-nude-medium rounded w-5/6"></div>
							<div className="h-4 bg-nude-medium rounded w-4/6"></div>
						</div>

						{/* Couleurs */}
						<div className="mb-8">
							<div className="h-6 bg-nude-medium rounded w-24 mb-4"></div>
							<div className="flex gap-3">
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="w-12 h-12 bg-nude-medium rounded-full"
									></div>
								))}
							</div>
						</div>

						{/* Tailles */}
						<div className="mb-8">
							<div className="h-6 bg-nude-medium rounded w-20 mb-4"></div>
							<div className="flex gap-3">
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className="w-16 h-12 bg-nude-medium rounded-lg"
									></div>
								))}
							</div>
						</div>

						{/* Quantité */}
						<div className="mb-8">
							<div className="h-6 bg-nude-medium rounded w-24 mb-4"></div>
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 bg-nude-medium rounded-full"></div>
								<div className="w-12 h-8 bg-nude-medium rounded-lg"></div>
								<div className="w-8 h-8 bg-nude-medium rounded-full"></div>
							</div>
						</div>

						{/* Boutons */}
						<div className="flex gap-4 mb-8">
							<div className="w-48 h-12 bg-nude-medium rounded-2xl"></div>
							<div className="w-12 h-12 bg-nude-medium rounded-2xl"></div>
						</div>

						{/* Services */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="flex items-center gap-3 p-3 bg-nude-light rounded-lg"
								>
									<div className="w-6 h-6 bg-white rounded"></div>
									<div className="space-y-1">
										<div className="h-3 bg-white rounded w-20"></div>
										<div className="h-2 bg-white rounded w-16"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Similar Products Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16 bg-white/50">
				<div className="animate-pulse">
					<div className="h-8 bg-nude-medium rounded-lg mb-8 max-w-md mx-auto"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="bg-white rounded-2xl shadow-lg overflow-hidden"
							>
								<div className="w-full h-64 bg-nude-medium"></div>
								<div className="p-4 space-y-3">
									<div className="h-5 bg-nude-medium rounded-lg"></div>
									<div className="h-4 bg-nude-medium rounded-lg w-3/4"></div>
									<div className="h-6 bg-nude-medium rounded-lg w-16"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
