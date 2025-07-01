import { Category, Product, sanityClient } from "./sanity";

// Requête pour récupérer tous les produits
export async function getAllProducts(): Promise<Product[]> {
	const query = `
    *[_type == "product"] {
      _id,
      _type,
      name,
      slug,
      description,
      price,
      images[] {
        _type,
        asset->,
        alt,
        caption
      },
      category-> {
        _id,
        name,
        slug
      },
      sizes,
      colors,
      inStock,
      featured,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query);
}

// Requête pour récupérer un produit par slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
	const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      description,
      price,
      images[] {
        _type,
        asset->,
        alt,
        caption
      },
      category-> {
        _id,
        name,
        slug
      },
      sizes,
      colors,
      inStock,
      featured,
      _createdAt,
      _updatedAt
    }
  `;

	return sanityClient.fetch(query, { slug });
}

// Requête pour récupérer les produits mis en avant
export async function getFeaturedProducts(): Promise<Product[]> {
	const query = `
    *[_type == "product" && featured == true] {
      _id,
      _type,
      name,
      slug,
      description,
      price,
      images[] {
        _type,
        asset->,
        alt,
        caption
      },
      category-> {
        _id,
        name,
        slug
      },
      sizes,
      colors,
      inStock,
      featured,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc) [0...6]
  `;

	return sanityClient.fetch(query);
}

// Requête pour récupérer tous les produits d'une catégorie
export async function getProductsByCategory(
	categorySlug: string
): Promise<Product[]> {
	const query = `
    *[_type == "product" && category->slug.current == $categorySlug] {
      _id,
      _type,
      name,
      slug,
      description,
      price,
      images[] {
        _type,
        asset->,
        alt,
        caption
      },
      category-> {
        _id,
        name,
        slug
      },
      sizes,
      colors,
      inStock,
      featured,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query, { categorySlug });
}

// Requête pour récupérer toutes les catégories
export async function getAllCategories(): Promise<Category[]> {
	const query = `
    *[_type == "category"] {
      _id,
      _type,
      name,
      slug,
      description,
      image {
        _type,
        asset->,
        alt,
        caption
      }
    } | order(name asc)
  `;

	return sanityClient.fetch(query);
}

// Requête pour récupérer une catégorie par slug
export async function getCategoryBySlug(
	slug: string
): Promise<Category | null> {
	const query = `
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      description,
      image {
        _type,
        asset->,
        alt,
        caption
      }
    }
  `;

	return sanityClient.fetch(query, { slug });
}

// Requête pour rechercher des produits
export async function searchProducts(searchTerm: string): Promise<Product[]> {
	const query = `
    *[_type == "product" && (
      name match $searchTerm + "*" ||
      description match $searchTerm + "*" ||
      category->name match $searchTerm + "*"
    )] {
      _id,
      _type,
      name,
      slug,
      description,
      price,
      images[] {
        _type,
        asset->,
        alt,
        caption
      },
      category-> {
        _id,
        name,
        slug
      },
      sizes,
      colors,
      inStock,
      featured,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query, { searchTerm });
}
