#!/usr/bin/env node

/**
 * Script pour trouver quel produit utilise img12.jpeg
 */

const { createClient } = require("next-sanity");

// Configuration avec les variables d'environnement
const config = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	apiVersion: "2024-12-19",
	useCdn: false,
};

const client = createClient(config);

async function findImg12() {
	console.log("🔍 Recherche de img12.jpeg dans Sanity...\n");

	try {
		// Rechercher tous les produits qui pourraient utiliser img12
		const products = await client.fetch(`
			*[_type == "product"] {
				_id,
				name,
				mainImage,
				hoverImage,
				"productDetails": *[_type == "productDetail" && product._ref == ^._id][0] {
					colors[] {
						name,
						mainImage,
						additionalImages[]
					},
					galleryImages[]
				}
			}
		`);

		console.log(`📦 ${products.length} produits analysés\n`);

		let found = false;

		for (const product of products) {
			// Vérifier l'image principale
			if (product.mainImage?.asset?._ref?.includes("img12")) {
				console.log(`🎯 TROUVÉ ! Produit: ${product.name}`);
				console.log(`   Type: Image principale`);
				console.log(`   Référence: ${product.mainImage.asset._ref}`);
				console.log(
					`   URL Sanity: https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${product.mainImage.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`
				);
				found = true;
			}

			// Vérifier l'image de hover
			if (product.hoverImage?.asset?._ref?.includes("img12")) {
				console.log(`🎯 TROUVÉ ! Produit: ${product.name}`);
				console.log(`   Type: Image de hover`);
				console.log(`   Référence: ${product.hoverImage.asset._ref}`);
				console.log(
					`   URL Sanity: https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${product.hoverImage.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`
				);
				found = true;
			}

			// Vérifier les images des couleurs
			if (product.productDetails?.colors) {
				for (const color of product.productDetails.colors) {
					if (color.mainImage?.asset?._ref?.includes("img12")) {
						console.log(`🎯 TROUVÉ ! Produit: ${product.name}`);
						console.log(`   Type: Image de couleur (${color.name})`);
						console.log(`   Référence: ${color.mainImage.asset._ref}`);
						console.log(
							`   URL Sanity: https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${color.mainImage.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`
						);
						found = true;
					}

					// Vérifier les images supplémentaires
					if (color.additionalImages) {
						for (const img of color.additionalImages) {
							if (img?.asset?._ref?.includes("img12")) {
								console.log(`🎯 TROUVÉ ! Produit: ${product.name}`);
								console.log(`   Type: Image supplémentaire (${color.name})`);
								console.log(`   Référence: ${img.asset._ref}`);
								console.log(
									`   URL Sanity: https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${img.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`
								);
								found = true;
							}
						}
					}
				}
			}

			// Vérifier les images de galerie
			if (product.productDetails?.galleryImages) {
				for (const img of product.productDetails.galleryImages) {
					if (img?.asset?._ref?.includes("img12")) {
						console.log(`🎯 TROUVÉ ! Produit: ${product.name}`);
						console.log(`   Type: Image de galerie`);
						console.log(`   Référence: ${img.asset._ref}`);
						console.log(
							`   URL Sanity: https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${img.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`
						);
						found = true;
					}
				}
			}
		}

		if (!found) {
			console.log("❌ img12.jpeg n'a pas été trouvée dans les produits Sanity");
			console.log("\n💡 Suggestions :");
			console.log("1. Vérifiez que l'image est bien uploadée dans Sanity");
			console.log("2. Vérifiez que l'image est assignée à un produit");
			console.log("3. Vérifiez les permissions d'accès à l'image");
		}
	} catch (error) {
		console.error("❌ Erreur lors de la recherche:", error);
	}
}

// Exécuter la recherche
findImg12();
