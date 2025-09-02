#!/usr/bin/env node

/**
 * Script de test pour vérifier l'accès aux données Sanity
 * Usage: node scripts/test-sanity-access.js
 */

// Charger les variables d'environnement depuis .env
require("dotenv").config();

const { createClient } = require("next-sanity");

// Configuration Sanity
const config = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	apiVersion: "2024-12-19",
	useCdn: false,
	perspective: "published",
};

async function testSanityAccess() {
	console.log("🧪 Test d'accès aux données Sanity...\n");

	if (!config.projectId) {
		console.error("❌ ERREUR: NEXT_PUBLIC_SANITY_PROJECT_ID non défini");
		process.exit(1);
	}

	console.log(`📋 Configuration:
  - Project ID: ${config.projectId}
  - Dataset: ${config.dataset}
  - API Version: ${config.apiVersion}
  - CDN: ${config.useCdn}
\n`);

	const client = createClient(config);

	try {
		// Test 1: Récupérer les produits
		console.log("1️⃣ Test récupération des produits...");
		const products = await client.fetch(`
			*[_type == "product"][0...3] {
				_id,
				name,
				slug
			}
		`);
		console.log(`✅ ${products.length} produits récupérés`);
		if (products.length > 0) {
			console.log(`   Premier produit: ${products[0].name}`);
		}

		// Test 2: Récupérer les catégories
		console.log("\n2️⃣ Test récupération des catégories...");
		const categories = await client.fetch(`
			*[_type == "category"][0...3] {
				_id,
				name,
				slug
			}
		`);
		console.log(`✅ ${categories.length} catégories récupérées`);
		if (categories.length > 0) {
			console.log(`   Première catégorie: ${categories[0].name}`);
		}

		// Test 3: Récupérer les détails produits
		console.log("\n3️⃣ Test récupération des détails produits...");
		const productDetails = await client.fetch(`
			*[_type == "productDetail"][0...3] {
				_id,
				name,
				price
			}
		`);
		console.log(`✅ ${productDetails.length} détails produits récupérés`);
		if (productDetails.length > 0) {
			console.log(`   Premier prix: ${productDetails[0].price}€`);
		}

		console.log(
			"\n🎉 Tous les tests sont passés ! Sanity fonctionne correctement."
		);
		console.log(
			"\n💡 Votre site devrait continuer à fonctionner normalement avec le plan gratuit."
		);
	} catch (error) {
		console.error("\n❌ ERREUR lors de l'accès à Sanity:");
		console.error(error.message);

		if (
			error.message.includes("unauthorized") ||
			error.message.includes("403")
		) {
			console.log(
				'\n🔐 Solution: Vérifiez que votre dataset "production" est public'
			);
			console.log("   1. Allez sur https://sanity.io/manage");
			console.log("   2. Sélectionnez votre projet");
			console.log("   3. Allez dans Settings > API");
			console.log('   4. Vérifiez que le dataset "production" est en "Public"');
		}

		process.exit(1);
	}
}

// Lancer le test
testSanityAccess();
