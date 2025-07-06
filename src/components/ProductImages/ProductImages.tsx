"use client";

import { SanityImage, urlFor } from "@/lib/sanity";
import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
	images?: SanityImage[];
	productName?: string;
}

export default function ProductImages({
	images,
	productName,
}: ProductImagesProps) {
	const [index, setIndex] = useState(0);

	// Si pas d'images, afficher un placeholder
	if (!images || images.length === 0) {
		return (
			<div className="">
				<div className="h-[500px] relative bg-gradient-to-br from-nude-light to-rose-light-2 rounded-2xl flex items-center justify-center">
					<span className="text-6xl">🛍️</span>
				</div>
				<div className="flex justify-start gap-4 mt-8">
					<div className="w-1/4 h-32 relative bg-gradient-to-br from-nude-light to-rose-light-2 rounded-2xl flex items-center justify-center">
						<span className="text-2xl">📷</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="">
			{/* Image principale */}
			<div className="h-[500px] relative rounded-2xl overflow-hidden shadow-lg">
				<Image
					src={urlFor(images[index])?.url() || "/assets/placeholder.jpg"}
					alt={
						images[index]?.alt ||
						`${productName} - Image ${index + 1}` ||
						"Produit"
					}
					fill
					sizes="50vw"
					className="object-cover rounded-2xl transition-all duration-300"
				/>
			</div>

			{/* Miniatures */}
			<div className="flex justify-start gap-4 mt-8">
				{images.map((img, i) => (
					<div
						key={i}
						className={`w-1/4 h-32 relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
							i === index ? "ring-2 ring-logo shadow-lg" : "hover:shadow-md"
						}`}
						onClick={() => setIndex(i)}
					>
						<Image
							src={urlFor(img)?.url() || "/assets/placeholder.jpg"}
							alt={
								img?.alt ||
								`${productName} - Miniature ${i + 1}` ||
								"Miniature produit"
							}
							fill
							sizes="30vw"
							className="object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
