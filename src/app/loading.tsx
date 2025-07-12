export default function Loading() {
	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header Loading */}
			<div className="bg-gradient-to-r from-rose-light-2 to-rose-light py-16">
				<div className="container mx-auto px-4">
					<div className="animate-pulse">
						<div className="h-16 bg-nude-medium rounded-lg mb-4 max-w-2xl mx-auto"></div>
						<div className="h-6 bg-nude-medium rounded-lg max-w-xl mx-auto"></div>
					</div>
				</div>
			</div>

			{/* Slider Loading */}
			<div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16">
				<div className="animate-pulse">
					<div className="h-96 bg-nude-medium rounded-2xl mb-8"></div>
					<div className="flex gap-4 justify-center">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="w-3 h-3 bg-nude-medium rounded-full"
							></div>
						))}
					</div>
				</div>
			</div>

			{/* Categories Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<div className="animate-pulse">
					<div className="h-12 bg-nude-medium rounded-lg mb-8 max-w-md mx-auto"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="text-center">
								<div className="w-32 h-32 bg-nude-medium rounded-full mx-auto mb-4"></div>
								<div className="h-6 bg-nude-medium rounded-lg mb-2"></div>
								<div className="h-4 bg-nude-medium rounded-lg w-2/3 mx-auto"></div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Products Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-beige-light py-16">
				<div className="animate-pulse">
					<div className="h-16 bg-nude-medium rounded-lg mb-12 max-w-lg mx-auto"></div>
					<div className="flex gap-x-8 gap-y-16 justify-start flex-wrap">
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[28%] p-4 rounded-2xl bg-rose-light-2"
							>
								<div className="w-full h-[28rem] bg-nude-medium rounded-2xl mb-4"></div>
								<div className="space-y-3">
									<div className="h-6 bg-nude-medium rounded-lg"></div>
									<div className="h-4 bg-nude-medium rounded-lg w-3/4"></div>
									<div className="h-4 bg-nude-medium rounded-lg w-1/2"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Services Loading */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<div className="animate-pulse">
					<div className="h-12 bg-nude-medium rounded-lg mb-8 max-w-md mx-auto"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="text-center p-6 bg-white rounded-2xl">
								<div className="w-12 h-12 bg-nude-medium rounded-full mx-auto mb-4"></div>
								<div className="h-5 bg-nude-medium rounded-lg mb-2"></div>
								<div className="h-4 bg-nude-medium rounded-lg w-3/4 mx-auto"></div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
