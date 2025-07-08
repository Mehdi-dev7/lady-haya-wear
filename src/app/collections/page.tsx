import { urlFor } from "@/lib/sanity";
import { getAllCategories } from "@/lib/sanity-queries";
import Image from "next/image";
import Link from "next/link";

export default async function CollectionsPage() {
	const categories = await getAllCategories();

	return (
		<div>
			{/* Header */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-beige-light py-16">
				<div className="text-center mb-12">
					<h1 className="text-5xl lg:text-6xl font-alex-brush text-logo mt-8 mb-4">
						Nos Collections
					</h1>
					<p className="text-lg text-nude-dark max-w-2xl mx-auto">
						Découvrez notre gamme complète de vêtements élégants et tendance,
						organisés par collections pour faciliter votre shopping.
					</p>
				</div>

				{/* Collections Grid */}
				<div className="flex gap-x-8 gap-y-16 justify-between flex-wrap">
					{categories.map((category) => (
						<Link
							key={category._id}
							href={`/collections/${category.slug.current}`}
							className="w-full sm:w-[45%] lg:w-[30%] group"
						>
							<div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl">
								{category.image ? (
									<Image
										src={
											urlFor(category.image)?.url() || "/assets/placeholder.jpg"
										}
										alt={category.image.alt || category.name}
										fill
										sizes="30vw"
										className="object-cover transition-all duration-500 group-hover:scale-105"
									/>
								) : (
									<div className="w-full h-full bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center rounded-2xl">
										<span className="text-4xl">👗</span>
									</div>
								)}

								{/* Overlay gradient */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

								{/* Contenu de la carte */}
								<div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
									<h3 className="text-xl font-balqis font-semibold mb-2">
										{category.name}
									</h3>
									{/* {category.description && (
										<p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 mb-3">
											{category.description}
										</p>
									)} */}
									<div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<span className="text-sm font-medium">
											Découvrir la collection
										</span>
										<svg
											className="w-5 h-5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
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
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Message si aucune collection */}
				{categories.length === 0 && (
					<div className="text-center py-16">
						<div className="text-6xl mb-4">👗</div>
						<h3 className="text-2xl font-alex-brush text-logo mb-2">
							Aucune collection disponible
						</h3>
						<p className="text-nude-dark">
							Nos collections seront bientôt disponibles. Revenez plus tard !
						</p>
					</div>
				)}
			</section>

			{/* Section CTA */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<div className="text-center">
					<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
						Besoin d&apos;aide pour choisir ?
					</h2>
					<p className="text-lg text-nude-dark mb-8 max-w-2xl mx-auto">
						Notre équipe est là pour vous conseiller et vous aider à trouver les
						pièces parfaites pour votre style.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/contact"
							className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
						>
							Nous contacter
						</Link>
						<Link
							href="/"
							className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
						>
							Retour à l&apos;accueil
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
