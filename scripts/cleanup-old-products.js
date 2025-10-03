/**
 * Script de nettoyage : Supprimer les anciens documents product et productDetail
 *
 * Ce script supprime les anciens documents qui ne sont plus utilisés
 * après la migration vers le système unifié.
 */

// Charger les variables d'environnement
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@sanity/client");
const readline = require("readline");

// Vérifier les variables d'environnement
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
	console.error("❌ Erreur : NEXT_PUBLIC_SANITY_PROJECT_ID manquant dans .env");
	process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
	console.error("❌ Erreur : NEXT_PUBLIC_SANITY_DATASET manquant dans .env");
	process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
	console.error("❌ Erreur : SANITY_API_TOKEN manquant dans .env");
	console.error("💡 Créez un token sur https://www.sanity.io/manage");
	process.exit(1);
}

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2024-01-01",
	token: process.env.SANITY_API_TOKEN,
	useCdn: false,
});

// Fonction pour demander confirmation
function askConfirmation(question) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.toLowerCase() === "oui" || answer.toLowerCase() === "o");
		});
	});
}

async function cleanupOldProducts() {
	console.log("🧹 Nettoyage des anciens documents...\n");

	try {
		// 1. Récupérer tous les anciens documents "product"
		console.log("📥 Récupération des anciens documents 'product'...");
		const oldProducts = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        _createdAt
      }
    `);

		// 2. Récupérer tous les anciens documents "productDetail"
		console.log("📥 Récupération des anciens documents 'productDetail'...");
		const oldProductDetails = await client.fetch(`
      *[_type == "productDetail"] {
        _id,
        name,
        _createdAt
      }
    `);

		console.log(`\n📊 Résumé :`);
		console.log(`   - ${oldProducts.length} documents "product" trouvés`);
		console.log(
			`   - ${oldProductDetails.length} documents "productDetail" trouvés`
		);
		console.log(
			`   - TOTAL : ${oldProducts.length + oldProductDetails.length} documents à supprimer\n`
		);

		if (oldProducts.length === 0 && oldProductDetails.length === 0) {
			console.log("✅ Aucun ancien document à supprimer !");
			return;
		}

		// Afficher la liste
		if (oldProducts.length > 0) {
			console.log("📋 Documents 'product' :");
			oldProducts.forEach((doc, index) => {
				console.log(`   ${index + 1}. "${doc.name}" (${doc._id})`);
			});
			console.log("");
		}

		if (oldProductDetails.length > 0) {
			console.log("📋 Documents 'productDetail' :");
			oldProductDetails.forEach((doc, index) => {
				console.log(`   ${index + 1}. "${doc.name}" (${doc._id})`);
			});
			console.log("");
		}

		// Demander confirmation
		console.log("⚠️  ATTENTION : Cette action est IRRÉVERSIBLE !");
		console.log("   Les documents suivants seront DÉFINITIVEMENT supprimés.\n");

		const confirmed = await askConfirmation(
			"Voulez-vous vraiment supprimer ces documents ? (oui/non) : "
		);

		if (!confirmed) {
			console.log("\n❌ Suppression annulée par l'utilisateur.");
			return;
		}

		console.log("\n🗑️  Suppression en cours...\n");

		let deleted = 0;
		let errors = 0;

		// Supprimer les documents "product"
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

		// Supprimer les documents "productDetail"
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
