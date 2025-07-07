"use client";

import { urlFor } from "@/lib/sanity";
import { getFeaturedProducts } from "@/lib/sanity-queries";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
	_id: string;
	name: string;
	slug: { current: string };
	shortDescription: string;
	mainImage: any;
	hoverImage?: any;
	category: {
		_id: string;
		name: string;
		slug: { current: string };
	};
	featured: boolean;
	isNew: boolean;
}

export default function FeaturedProducts() {
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			try {
				const products = await getFeaturedProducts();
				setFeaturedProducts(products);
			} catch (error) {
				console.error(
					"Erreur lors du chargement des produits vedettes:",
					error
				);
			} finally {
				setLoading(false);
			}
		};

		fetchFeaturedProducts();
	}, []);

	if (loading) {
		return (
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-white py-16">
				<div className="text-center mb-12">
					<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
						Produits Vedettes
					</h2>
					<p className="text-lg text-nude-dark">Nos coups de cœur pour vous</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="animate-pulse">
							<div className="h-80 bg-gray-200 rounded-2xl mb-4"></div>
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
					))}
				</div>
			</section>
		);
	}

	if (featuredProducts.length === 0) {
		return null; // Ne rien afficher s'il n'y a pas de produits vedettes
	}

	return (
		<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-white py-16">
			<div className="text-center mb-12">
				<h2 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
					Produits Vedettes
				</h2>
				<p className="text-lg text-nude-dark">Nos coups de cœur pour vous</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{featuredProducts.map((product) => (
					<Link
						key={product._id}
						href={`/products/${product.slug.current}`}
						className="group"
					>
						<div className="relative h-80 rounded-2xl overflow-hidden shadow-lg mb-4">
							{/* Image principale */}
							<Image
								src={
									urlFor(product.mainImage)?.url() || "/assets/placeholder.jpg"
								}
								alt={product.mainImage?.alt || product.name}
								fill
								sizes="33vw"
								className="object-cover rounded-2xl transition-opacity duration-500 group-hover:opacity-0"
							/>

							{/* Image de hover */}
							{product.hoverImage && (
								<Image
									src={
										urlFor(product.hoverImage)?.url() ||
										"/assets/placeholder.jpg"
									}
									alt={product.hoverImage?.alt || product.name}
									fill
									sizes="33vw"
									className="object-cover rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								/>
							)}

							{/* Badge "Nouveau" */}
							{product.isNew && (
								<div className="absolute top-2 left-2 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-medium z-20">
									Nouveau
								</div>
							)}

							{/* Badge "Vedette" */}
							<div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-medium z-20">
								⭐ Vedette
							</div>
						</div>

						<div className="space-y-2">
							<h3 className="font-medium text-nude-dark text-lg group-hover:text-red-400 transition-colors">
								{product.name}
							</h3>
							<p className="text-sm text-gray-500 line-clamp-2">
								{product.shortDescription}
							</p>
							<div className="flex items-center justify-between">
								<span className="text-sm text-nude-dark">
									{product.category.name}
								</span>
								<button className="text-red-400 text-sm font-medium group-hover:text-red-500 transition-colors">
									Voir le produit →
								</button>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Bouton "Voir tous les produits" */}
			<div className="text-center mt-12">
				<Link
					href="/collections"
					className="inline-block rounded-2xl ring-1 ring-nude-dark text-nude-dark py-3 px-8 text-lg hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
				>
					Voir tous nos produits
				</Link>
			</div>
		</section>
	);
}
