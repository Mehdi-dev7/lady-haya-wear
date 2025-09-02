import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import type { Image } from "sanity";

export const config = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	apiVersion: "2024-12-19",
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

// Type pour les tailles
export interface ProductSize {
	size: string;
	available: boolean;
	quantity: number;
}

// Type pour les badges (version étendue)
export interface ProductBadges {
	isNew?: boolean;
	isPromo?: boolean;
	promoType?: "percentage" | "originalPrice";
	promoPercentage?: number;
	originalPrice?: number;
}

// Type pour les couleurs (nouvelle structure)
export interface ProductColor {
	name: string;
	hexCode: string;
	mainImage: SanityImage;
	additionalImages?: SanityImage[];
	sizes: ProductSize[];
	available: boolean;
}

// Type pour les produits (cartes)
export interface Product {
	_id: string;
	_type: "product";
	name: string;
	slug: SanitySlug;
	shortDescription: string;
	mainImage: SanityImage;
	hoverImage?: SanityImage;
	category: SanityReference;
	featured: boolean;
	isNew: boolean;
	badges?: ProductBadges;
	_createdAt: string;
	_updatedAt: string;
}

// Type pour les fiches produits détaillées (nouvelle structure)
export interface ProductDetail {
	_id: string;
	_type: "productDetail";
	name: string;
	slug: SanitySlug;
	product: {
		_id: string;
		name: string;
		slug: SanitySlug;
		shortDescription: string;
		mainImage: SanityImage;
		hoverImage?: SanityImage;
		category: {
			_id: string;
			name: string;
			slug: SanitySlug;
		};
	};
	description: string;
	price: number;
	originalPrice?: number;
	colors: ProductColor[];
	galleryImages?: SanityImage[];
	badges?: ProductBadges;
	category?: {
		_id: string;
		name: string;
		slug: SanitySlug;
	};
	featured: boolean;
	tags?: string[];
	_createdAt: string;
	_updatedAt: string;
}

export interface Category {
	_id: string;
	_type: "category";
	name: string;
	slug: SanitySlug;
	description?: string;
	image?: SanityImage;
}
