import ProductGrid from "@/components/ProductGrid/ProductGrid";
import SafeImage from "@/components/ui/SafeImage";
import { urlFor } from "@/lib/sanity";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/sanity-queries";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CollectionPage({ params, searchParams }: Props) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const category = await getCategoryBySlug(resolvedParams.slug);

	if (!category) {
		notFound();
	}

	const products = await getProductsByCategory(resolvedParams.slug);

	return (
		<div>
			{/* Header de la collection */}
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-nude-light py-16">
				<div className="flex flex-col md:flex-row items-center gap-8">
					{/* Image de la collection */}
					<div className="relative w-full md:w-1/3 h-80 mt-8 lg:mt-14 rounded-2xl overflow-hidden shadow-lg">
						{category.image ? (
							<SafeImage
								src={urlFor(category.image)?.url()}
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
				<ProductGrid
					products={products}
					title={`${products.length} produit${products.length > 1 ? "s" : ""} dans cette collection`}
					showFilters={true}
				/>
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
						className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
					>
						Découvrir toutes nos collections
					</Link>
				</div>
			</section>
		</div>
	);
}
