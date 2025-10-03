/**
 * Script de migration : Product + ProductDetail → ProductUnified
 *
 * Ce script fusionne vos documents "product" et "productDetail" existants
 * en un seul document "productUnified" simplifié.
 */

const { createClient } = require("@sanity/client");

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2024-01-01",
	token: process.env.SANITY_API_TOKEN,
	useCdn: false,
});

async function migrateProducts() {
	console.log("🚀 Début de la migration vers le système unifié...\n");

	try {
		// 1. Récupérer tous les ProductDetails
		console.log("📥 Récupération des fiches produits détaillées...");
		const productDetails = await client.fetch(`
      *[_type == "productDetail"] {
        _id,
        name,
        slug,
        product->,
        description,
        price,
        originalPrice,
        colors,
        badges,
        category->,
        featured,
        tags,
        _createdAt,
        _updatedAt
      }
    `);

		console.log(`✅ ${productDetails.length} fiches produits trouvées\n`);

		if (productDetails.length === 0) {
			console.log("❌ Aucune fiche produit à migrer");
			return;
		}

		let migrated = 0;
		let errors = 0;

		// 2. Pour chaque ProductDetail, créer un ProductUnified
		for (const detail of productDetails) {
			try {
				// Récupérer les infos du product associé
				const product = detail.product;

				if (!product) {
					console.log(
						`⚠️  Fiche "${detail.name}" sans produit associé, ignorée`
					);
					errors++;
					continue;
				}

				console.log(`🔄 Migration de "${detail.name}"...`);

				// Créer le document unifié
				const unifiedProduct = {
					_type: "productUnified",
					name: detail.name,
					slug: detail.slug,
					shortDescription:
						product.shortDescription ||
						detail.description?.substring(0, 150) ||
						"",
					description: detail.description,
					category: {
						_type: "reference",
						_ref: detail.category?._id || product.category?._id,
					},
					price: detail.price,
					originalPrice: detail.originalPrice,
					mainImage: product.mainImage,
					hoverImage: product.hoverImage,
					colors: detail.colors,
					featured: detail.featured || product.featured || false,
					isNew: product.isNew || detail.badges?.isNew || false,
					isPromo: product.badges?.isPromo || detail.badges?.isPromo || false,
					promoPercentage:
						product.badges?.promoPercentage || detail.badges?.promoPercentage,
					tags: detail.tags || [],
				};

				// Créer le nouveau document
				await client.create(unifiedProduct);

				migrated++;
				console.log(`   ✅ "${detail.name}" migré avec succès`);
			} catch (error) {
				console.error(`   ❌ Erreur pour "${detail.name}":`, error.message);
				errors++;
			}
		}

		console.log("\n" + "=".repeat(50));
		console.log("📊 RÉSUMÉ DE LA MIGRATION");
		console.log("=".repeat(50));
		console.log(`✅ Produits migrés avec succès : ${migrated}`);
		console.log(`❌ Erreurs : ${errors}`);
		console.log(`📦 Total traité : ${productDetails.length}`);
		console.log("\n🎉 Migration terminée !");
		console.log("\n⚠️  IMPORTANT :");
		console.log("   1. Vérifiez vos produits dans Sanity Studio");
		console.log(
			"   2. Une fois validé, vous pourrez supprimer les anciens documents"
		);
		console.log(
			"   3. Les anciens documents 'product' et 'productDetail' sont toujours là"
		);
		console.log(
			"   4. Pour basculer complètement, il faudra mettre à jour les queries"
		);
	} catch (error) {
		console.error("❌ Erreur lors de la migration:", error);
		process.exit(1);
	}
}

// Lancer la migration
migrateProducts();
