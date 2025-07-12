export default function CollectionsLoading() {
	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-beige-light py-16">
				<div className="text-center mb-12">
					<div className="animate-pulse">
						<div className="h-16 bg-nude-light rounded-lg mb-4 max-w-lg mx-auto"></div>
						<div className="h-6 bg-nude-light rounded-lg max-w-2xl mx-auto"></div>
					</div>
				</div>

				{/* Collections Grid Loading */}
				<div className="flex gap-x-8 gap-y-16 justify-between flex-wrap">
					{[...Array(8)].map((_, i) => (
						<div key={i} className="w-full sm:w-[45%] lg:w-[28%] animate-pulse">
							<div className="relative h-80 rounded-2xl overflow-hidden shadow-lg mb-4">
								<div className="w-full h-full bg-nude-light"></div>
								{/* Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
								{/* Content */}
								<div className="absolute bottom-4 left-4 right-4 text-white">
									<div className="h-6 bg-white/20 rounded-lg mb-2 w-3/4"></div>
									<div className="h-4 bg-white/20 rounded-lg w-1/2"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
