import { Category, Product, ProductDetail, sanityClient } from "./sanity";

// ========== CATÉGORIES ==========

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
      },
      order
    } | order(order asc)
  `;

	try {
		console.log("🔍 Exécution de la requête getAllCategories...");
		const result = await sanityClient.fetch(query);
		console.log(
			"✅ Requête getAllCategories réussie, nombre de catégories:",
			result.length
		);
		return result;
	} catch (error) {
		console.error("❌ Erreur dans getAllCategories:", error);
		throw error;
	}
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

// Requête pour récupérer les catégories mises en avant pour le slider
export async function getFeaturedCategories(): Promise<Category[]> {
	const query = `
    *[_type == "category" && featured == true] {
      _id,
      _type,
      name,
      slug,
      description,
      image {
        _type,
        asset->,
        alt
      },
      featured,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query);
}

// ========== PRODUITS UNIFIÉS ==========

// Requête pour récupérer tous les produits unifiés
export async function getAllUnifiedProducts(): Promise<Product[]> {
	const query = `
    *[_type == "productUnified"] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
      description,
      mainImage {
        _type,
        asset->,
        alt
      },
      hoverImage {
        _type,
        asset->,
        alt
      },
      category-> {
        _id,
        name,
        slug
      },
      price,
      originalPrice,
      colors[] {
        name,
        hexCode,
        mainImage {
          _type,
          asset->,
          alt
        },
        additionalImages[] {
          _type,
          asset->,
          alt
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      },
      featured,
      isNew,
      isPromo,
      promoPercentage,
      "badges": {
        "isPromo": isPromo,
        "promoType": "percentage",
        "promoPercentage": promoPercentage
      },
      tags,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	try {
		console.log("🔍 Exécution de la requête getAllUnifiedProducts...");
		const result = await sanityClient.fetch(query);
		console.log(
			"✅ Requête getAllUnifiedProducts réussie, nombre de produits:",
			result.length
		);
		return result;
	} catch (error) {
		console.error("❌ Erreur dans getAllUnifiedProducts:", error);
		throw error;
	}
}

// Requête pour récupérer un produit unifié par slug
export async function getUnifiedProductBySlug(
	slug: string
): Promise<ProductDetail | null> {
	const query = `
    *[_type == "productUnified" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
      description,
      mainImage {
        _type,
        asset->,
        alt
      },
      hoverImage {
        _type,
        asset->,
        alt
      },
      category-> {
        _id,
        name,
        slug
      },
      price,
      originalPrice,
      colors[] {
        name,
        hexCode,
        mainImage {
          _type,
          asset->,
          alt
        },
        additionalImages[] {
          _type,
          asset->,
          alt
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      },
      featured,
      isNew,
      isPromo,
      promoPercentage,
      "badges": {
        "isPromo": isPromo,
        "promoType": "percentage",
        "promoPercentage": promoPercentage
      },
      tags,
      _createdAt,
      _updatedAt
    }
  `;

	return sanityClient.fetch(query, { slug });
}

// Requête pour récupérer les produits unifiés d'une catégorie
export async function getUnifiedProductsByCategory(
	categorySlug: string
): Promise<Product[]> {
	const query = `
    *[_type == "productUnified" && category->slug.current == $categorySlug] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
      description,
      mainImage {
        _type,
        asset->,
        alt
      },
      hoverImage {
        _type,
        asset->,
        alt
      },
      category-> {
        _id,
        name,
        slug
      },
      price,
      originalPrice,
      colors[] {
        name,
        hexCode,
        mainImage {
          _type,
          asset->,
          alt
        },
        additionalImages[] {
          _type,
          asset->,
          alt
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      },
      featured,
      isNew,
      isPromo,
      promoPercentage,
      "badges": {
        "isPromo": isPromo,
        "promoType": "percentage",
        "promoPercentage": promoPercentage
      },
      tags,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query, { categorySlug });
}

// Requête pour récupérer les produits unifiés mis en avant (Coups de cœur)
export async function getFeaturedUnifiedProducts(): Promise<Product[]> {
	const query = `
    *[_type == "productUnified" && featured == true] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
      description,
      mainImage {
        _type,
        asset->,
        alt
      },
      hoverImage {
        _type,
        asset->,
        alt
      },
      category-> {
        _id,
        name,
        slug
      },
      price,
      originalPrice,
      colors[] {
        name,
        hexCode,
        mainImage {
          _type,
          asset->,
          alt
        },
        additionalImages[] {
          _type,
          asset->,
          alt
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      },
      featured,
      isNew,
      isPromo,
      promoPercentage,
      "badges": {
        "isPromo": isPromo,
        "promoType": "percentage",
        "promoPercentage": promoPercentage
      },
      tags,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc) [0...6]
  `;

	return sanityClient.fetch(query);
}

// Requête pour rechercher des produits unifiés
export async function searchUnifiedProducts(
	searchTerm: string
): Promise<Product[]> {
	const query = `
    *[_type == "productUnified" && (
      name match $searchTerm + "*" ||
      shortDescription match $searchTerm + "*" ||
      description match $searchTerm + "*" ||
      category->name match $searchTerm + "*"
    )] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
      description,
      mainImage {
        _type,
        asset->,
        alt
      },
      hoverImage {
        _type,
        asset->,
        alt
      },
      category-> {
        _id,
        name,
        slug
      },
      price,
      originalPrice,
      colors[] {
        name,
        hexCode,
        mainImage {
          _type,
          asset->,
          alt
        },
        additionalImages[] {
          _type,
          asset->,
          alt
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      },
      featured,
      isNew,
      isPromo,
      promoPercentage,
      "badges": {
        "isPromo": isPromo,
        "promoType": "percentage",
        "promoPercentage": promoPercentage
      },
      tags,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query, { searchTerm });
}
