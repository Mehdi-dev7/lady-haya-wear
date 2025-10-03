/**
 * Script de nettoyage : Supprimer les anciens documents product et productDetail
 * Version corrigée avec suppression dans le bon ordre
 */

// Charger les variables d'environnement
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@sanity/client");

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2024-01-01",
	token: process.env.SANITY_API_TOKEN,
	useCdn: false,
});

async function cleanupOldProducts() {
	console.log("🧹 Nettoyage des anciens documents (v2 - ordre corrigé)...\n");

	try {
		// 1. Récupérer tous les anciens documents
		console.log("📥 Récupération des anciens documents...");
		const oldProducts = await client.fetch(`
      *[_type == "product"] {
        _id,
        name
      }
    `);

		const oldProductDetails = await client.fetch(`
      *[_type == "productDetail"] {
        _id,
        name
      }
    `);

		console.log(`\n📊 Résumé :`);
		console.log(`   - ${oldProducts.length} documents "product"`);
		console.log(`   - ${oldProductDetails.length} documents "productDetail"`);
		console.log(
			`   - TOTAL : ${oldProducts.length + oldProductDetails.length} documents\n`
		);

		if (oldProducts.length === 0 && oldProductDetails.length === 0) {
			console.log("✅ Aucun ancien document à supprimer !");
			return;
		}

		console.log(
			"🗑️  Suppression en cours (productDetail d'abord, puis product)...\n"
		);

		let deleted = 0;
		let errors = 0;

		// ÉTAPE 1 : Supprimer d'abord les "productDetail" (qui référencent les "product")
		console.log("📋 Étape 1/2 : Suppression des productDetail...");
		for (const doc of oldProductDetails) {
			try {
				await client.delete(doc._id);
				console.log(`   ✅ Supprimé : "productDetail" - ${doc.name}`);
				deleted++;
			} catch (error) {
				console.error(`   ❌ Erreur pour "${doc.name}":`, error.message);
				errors++;
			}
		}

		console.log("");

		// ÉTAPE 2 : Supprimer ensuite les "product"
		console.log("📋 Étape 2/2 : Suppression des product...");
		for (const doc of oldProducts) {
			try {
				await client.delete(doc._id);
				console.log(`   ✅ Supprimé : "product" - ${doc.name}`);
				deleted++;
			} catch (error) {
				console.error(`   ❌ Erreur pour "${doc.name}":`, error.message);
				errors++;
			}
		}

		console.log("\n" + "=".repeat(50));
		console.log("📊 RÉSUMÉ DU NETTOYAGE");
		console.log("=".repeat(50));
		console.log(`✅ Documents supprimés avec succès : ${deleted}`);
		console.log(`❌ Erreurs : ${errors}`);
		console.log(
			`📦 Total traité : ${oldProducts.length + oldProductDetails.length}`
		);
		console.log("\n🎉 Nettoyage terminé !");
		console.log(
			"\n💡 Vos nouveaux produits unifiés restent intacts et fonctionnels."
		);
	} catch (error) {
		console.error("❌ Erreur lors du nettoyage:", error);
		process.exit(1);
	}
}

// Lancer le nettoyage
cleanupOldProducts();
