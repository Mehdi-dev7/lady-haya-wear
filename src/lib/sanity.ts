import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import type { Image } from "sanity";

export const config = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	apiVersion: "2024-01-01", // Utilisez la date d'aujourd'hui ou la version API que vous préférez
	useCdn: process.env.NODE_ENV === "production",
};

// Client Sanity pour les requêtes
export const sanityClient = createClient(config);

// Builder pour les images Sanity
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImage | null | undefined) {
	if (!source) return null;
	return builder.image(source);
}

// Types utilitaires pour Sanity
export interface SanityReference {
	_ref: string;
	_type: "reference";
}

export interface SanitySlug {
	current: string;
	_type: "slug";
}

// Types pour les données Sanity
export interface SanityImage extends Image {
	_type: "image";
	asset: {
		_ref: string;
		_type: "reference";
	};
	alt?: string;
	caption?: string;
}

export interface Product {
	_id: string;
	_type: "product";
	name: string;
	slug: SanitySlug;
	description: string;
	price: number;
	images: SanityImage[];
	category: SanityReference;
	sizes: string[];
	colors: string[];
	inStock: boolean;
	featured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	_id: string;
	_type: "category";
	name: string;
	slug: SanitySlug;
	description?: string;
	image?: SanityImage;
}
