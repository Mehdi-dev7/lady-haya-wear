import { Category, Product, ProductDetail, sanityClient } from "./sanity";

// Requête pour récupérer tous les produits (cartes)
export async function getAllProducts(): Promise<Product[]> {
	const query = `
    *[_type == "product"] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
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
      featured,
      isNew,
      badges {
        isPromo,
        promoType,
        promoPercentage,
        originalPrice
      },
      _createdAt,
      _updatedAt,
      "price": *[_type == "productDetail" && product._ref == ^._id][0].price,
      "originalPrice": *[_type == "productDetail" && product._ref == ^._id][0].originalPrice,
      "colors": *[_type == "productDetail" && product._ref == ^._id][0].colors[] {
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
          alt,
          caption
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      }
    } | order(_createdAt desc)
  `;

	try {
		console.log("🔍 Exécution de la requête getAllProducts...");
		const result = await sanityClient.fetch(query);
		console.log(
			"✅ Requête getAllProducts réussie, nombre de produits:",
			result.length
		);
		return result;
	} catch (error) {
		console.error("❌ Erreur dans getAllProducts:", error);
		throw error;
	}
}

// Requête pour récupérer un produit par slug (cartes)
export async function getProductBySlug(slug: string): Promise<Product | null> {
	const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
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
      featured,
      isNew,
      badges {
        isPromo,
        promoType,
        promoPercentage,
        originalPrice
      },
      _createdAt,
      _updatedAt
    }
  `;

	return sanityClient.fetch(query, { slug });
}

// Requête pour récupérer tous les produits d'une catégorie (cartes)
export async function getProductsByCategory(
	categorySlug: string
): Promise<Product[]> {
	const query = `
    *[_type == "product" && category->slug.current == $categorySlug] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
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
      featured,
      isNew,
      badges {
        isPromo,
        promoType,
        promoPercentage,
        originalPrice
      },
      _createdAt,
      _updatedAt,
      "price": *[_type == "productDetail" && product._ref == ^._id][0].price,
      "originalPrice": *[_type == "productDetail" && product._ref == ^._id][0].originalPrice,
      "colors": *[_type == "productDetail" && product._ref == ^._id][0].colors[] {
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
          alt,
          caption
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      }
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query, { categorySlug });
}

// Requête pour récupérer tous les produits détaillés
export async function getAllProductDetails(): Promise<ProductDetail[]> {
	const query = `
    *[_type == "productDetail"] {
      _id,
      _type,
      name,
      slug,
      product-> {
        _id,
        name,
        slug,
        shortDescription,
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
        }
      },
      description,
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
          alt,
          caption
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      },
      galleryImages[] {
        _type,
        asset->,
        alt,
        caption
      },
      badges {
        isNew,
        isPromo,
        promoPercentage
      },
      category-> {
        _id,
        name,
        slug
      },
      featured,
      tags,
      _createdAt,
      _updatedAt
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query);
}

// Requête pour récupérer une fiche produit détaillée par slug
export async function getProductDetailBySlug(
	slug: string
): Promise<ProductDetail | null> {
	const query = `
    *[_type == "productDetail" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      product-> {
        _id,
        name,
        slug,
        shortDescription,
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
        }
      },
      description,
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
          alt,
          caption
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      },
      galleryImages[] {
        _type,
        asset->,
        alt,
        caption
      },
      badges {
        isNew,
        isPromo,
        promoPercentage
      },
      category-> {
        _id,
        name,
        slug
      },
      featured,
      tags,
      _createdAt,
      _updatedAt
    }
  `;

	return sanityClient.fetch(query, { slug });
}

// Requête pour récupérer les produits mis en avant (cartes)
export async function getFeaturedProducts(): Promise<Product[]> {
	const query = `
    *[_type == "product" && featured == true] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
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
      featured,
      isNew,
      badges {
        isPromo,
        promoType,
        promoPercentage,
        originalPrice
      },
      _createdAt,
      _updatedAt,
      "price": *[_type == "productDetail" && product._ref == ^._id][0].price,
      "originalPrice": *[_type == "productDetail" && product._ref == ^._id][0].originalPrice,
      "colors": *[_type == "productDetail" && product._ref == ^._id][0].colors[] {
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
          alt,
          caption
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      }
    } | order(_createdAt desc) [0...6]
  `;

	return sanityClient.fetch(query);
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
      shortDescription match $searchTerm + "*" ||
      category->name match $searchTerm + "*"
    )] {
      _id,
      _type,
      name,
      slug,
      shortDescription,
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
      featured,
      isNew,
      _createdAt,
      _updatedAt,
      "price": *[_type == "productDetail" && product._ref == ^._id][0].price,
      "originalPrice": *[_type == "productDetail" && product._ref == ^._id][0].originalPrice,
      "colors": *[_type == "productDetail" && product._ref == ^._id][0].colors[] {
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
          alt,
          caption
        },
        sizes[] {
          size,
          available,
          quantity
        },
        available
      }
    } | order(_createdAt desc)
  `;

	return sanityClient.fetch(query, { searchTerm });
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
