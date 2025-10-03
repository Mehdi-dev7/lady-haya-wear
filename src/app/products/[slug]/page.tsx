import {
	getAllUnifiedProducts,
	getUnifiedProductBySlug,
} from "@/lib/sanity-queries";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";

interface ProductPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ProductPage({ params }: ProductPageProps) {
	const resolvedParams = await params;
	const product = await getUnifiedProductBySlug(resolvedParams.slug);

	if (!product) {
		notFound();
	}

	const allProducts = await getAllUnifiedProducts();
	const currentIndex = allProducts.findIndex(
		(p) => p.slug?.current === resolvedParams.slug
	);
	const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
	const nextProduct =
		currentIndex < allProducts.length - 1
			? allProducts[currentIndex + 1]
			: null;

	// Produits similaires (même catégorie)
	const similarProducts = allProducts
		.filter(
			(p) => p.category?._id === product.category?._id && p._id !== product._id
		)
		.slice(0, 4);

	// Combiner toutes les images pour la galerie (images de toutes les couleurs)
	const allImages = [
		...product.colors.flatMap((color: any) => [
			color.mainImage,
			...(color.additionalImages || []),
		]),
	];

	return (
		<ProductPageClient
			product={product}
			allImages={allImages}
			prevProduct={prevProduct}
			nextProduct={nextProduct}
			similarProducts={similarProducts}
		/>
	);
}
