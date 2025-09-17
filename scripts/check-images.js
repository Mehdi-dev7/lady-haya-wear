#!/usr/bin/env node

/**
 * Script de diagnostic des images Sanity
 * Vérifie que toutes les images sont accessibles et valides
 */

const { createClient } = require("next-sanity");

const config = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	apiVersion: "2024-12-19",
	useCdn: false, // Désactiver le CDN pour le diagnostic
};

const client = createClient(config);

async function checkImages() {
	console.log("🔍 Vérification des images Sanity...\n");

	try {
		// Récupérer tous les produits
		const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        mainImage,
        hoverImage,
        "productDetails": *[_type == "productDetail" && product._ref == ^._id][0] {
          colors[] {
            mainImage,
            additionalImages[]
          },
          galleryImages[]
        }
      }
    `);

		console.log(`📦 ${products.length} produits trouvés\n`);

		let totalImages = 0;
		let problematicImages = 0;
		const issues = [];

		for (const product of products) {
			console.log(`\n🛍️  Produit: ${product.name} (${product._id})`);

			// Vérifier l'image principale
			if (product.mainImage) {
				totalImages++;
				const imageUrl = `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${product.mainImage.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`;
				console.log(`  📸 Image principale: ${imageUrl}`);

				try {
					const response = await fetch(imageUrl, { method: "HEAD" });
					if (!response.ok) {
						problematicImages++;
						issues.push({
							product: product.name,
							type: "mainImage",
							url: imageUrl,
							status: response.status,
						});
						console.log(`    ❌ Erreur: ${response.status}`);
					} else {
						console.log(`    ✅ OK`);
					}
				} catch (error) {
					problematicImages++;
					issues.push({
						product: product.name,
						type: "mainImage",
						url: imageUrl,
						error: error.message,
					});
					console.log(`    ❌ Erreur: ${error.message}`);
				}
			}

			// Vérifier l'image de hover
			if (product.hoverImage) {
				totalImages++;
				const imageUrl = `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${product.hoverImage.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`;
				console.log(`  🖼️  Image hover: ${imageUrl}`);

				try {
					const response = await fetch(imageUrl, { method: "HEAD" });
					if (!response.ok) {
						problematicImages++;
						issues.push({
							product: product.name,
							type: "hoverImage",
							url: imageUrl,
							status: response.status,
						});
						console.log(`    ❌ Erreur: ${response.status}`);
					} else {
						console.log(`    ✅ OK`);
					}
				} catch (error) {
					problematicImages++;
					issues.push({
						product: product.name,
						type: "hoverImage",
						url: imageUrl,
						error: error.message,
					});
					console.log(`    ❌ Erreur: ${error.message}`);
				}
			}

			// Vérifier les images des couleurs
			if (product.productDetails?.colors) {
				for (const color of product.productDetails.colors) {
					if (color.mainImage) {
						totalImages++;
						const imageUrl = `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${color.mainImage.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`;
						console.log(`  🎨 Couleur ${color.name}: ${imageUrl}`);

						try {
							const response = await fetch(imageUrl, { method: "HEAD" });
							if (!response.ok) {
								problematicImages++;
								issues.push({
									product: product.name,
									type: "colorImage",
									color: color.name,
									url: imageUrl,
									status: response.status,
								});
								console.log(`    ❌ Erreur: ${response.status}`);
							} else {
								console.log(`    ✅ OK`);
							}
						} catch (error) {
							problematicImages++;
							issues.push({
								product: product.name,
								type: "colorImage",
								color: color.name,
								url: imageUrl,
								error: error.message,
							});
							console.log(`    ❌ Erreur: ${error.message}`);
						}
					}
				}
			}
		}

		// Résumé
		console.log("\n" + "=".repeat(50));
		console.log("📊 RÉSUMÉ DU DIAGNOSTIC");
		console.log("=".repeat(50));
		console.log(`📦 Produits vérifiés: ${products.length}`);
		console.log(`🖼️  Images totales: ${totalImages}`);
		console.log(`❌ Images problématiques: ${problematicImages}`);
		console.log(`✅ Images OK: ${totalImages - problematicImages}`);

		if (issues.length > 0) {
			console.log("\n🚨 PROBLÈMES DÉTECTÉS:");
			issues.forEach((issue, index) => {
				console.log(`\n${index + 1}. ${issue.product} - ${issue.type}`);
				if (issue.color) console.log(`   Couleur: ${issue.color}`);
				console.log(`   URL: ${issue.url}`);
				if (issue.status) console.log(`   Status: ${issue.status}`);
				if (issue.error) console.log(`   Erreur: ${issue.error}`);
			});
		} else {
			console.log("\n🎉 Toutes les images sont accessibles !");
		}
	} catch (error) {
		console.error("❌ Erreur lors du diagnostic:", error);
	}
}

// Exécuter le diagnostic
checkImages();
