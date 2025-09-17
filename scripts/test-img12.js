#!/usr/bin/env node

/**
 * Script pour tester l'accès à img12.jpeg
 */

const fs = require("fs");
const path = require("path");

async function testImg12() {
	console.log("🔍 Test d'accès à img12.jpeg...\n");

	const imgPath = path.join(__dirname, "../public/assets/grid/img12.jpeg");

	// Test 1: Vérifier que le fichier existe localement
	console.log("1️⃣ Test local:");
	if (fs.existsSync(imgPath)) {
		const stats = fs.statSync(imgPath);
		console.log(`   ✅ Fichier existe localement`);
		console.log(`   📏 Taille: ${(stats.size / 1024).toFixed(2)} KB`);
		console.log(`   📅 Modifié: ${stats.mtime.toLocaleString()}`);
	} else {
		console.log(`   ❌ Fichier n'existe pas localement`);
		return;
	}

	// Test 2: Vérifier que le fichier est lisible
	console.log("\n2️⃣ Test de lecture:");
	try {
		const buffer = fs.readFileSync(imgPath);
		console.log(`   ✅ Fichier lisible`);
		console.log(`   📊 Taille du buffer: ${buffer.length} bytes`);

		// Vérifier que c'est bien une image JPEG
		if (buffer[0] === 0xff && buffer[1] === 0xd8) {
			console.log(`   ✅ Format JPEG valide`);
		} else {
			console.log(
				`   ⚠️  Format JPEG suspect (magic bytes: ${buffer[0].toString(16)}, ${buffer[1].toString(16)})`
			);
		}
	} catch (error) {
		console.log(`   ❌ Erreur de lecture: ${error.message}`);
	}

	// Test 3: Vérifier les permissions
	console.log("\n3️⃣ Test des permissions:");
	try {
		fs.accessSync(imgPath, fs.constants.R_OK);
		console.log(`   ✅ Lecture autorisée`);
	} catch (error) {
		console.log(`   ❌ Lecture non autorisée: ${error.message}`);
	}

	// Test 4: Vérifier l'intégrité du fichier
	console.log("\n4️⃣ Test d'intégrité:");
	try {
		const buffer = fs.readFileSync(imgPath);
		const hash = require("crypto")
			.createHash("md5")
			.update(buffer)
			.digest("hex");
		console.log(`   🔐 Hash MD5: ${hash}`);

		// Vérifier que le fichier n'est pas corrompu
		if (buffer.length > 1000) {
			// Au moins 1KB
			console.log(`   ✅ Fichier semble intact`);
		} else {
			console.log(`   ⚠️  Fichier très petit, possiblement corrompu`);
		}
	} catch (error) {
		console.log(`   ❌ Erreur d'intégrité: ${error.message}`);
	}

	console.log("\n" + "=".repeat(50));
	console.log("📋 RÉSUMÉ:");
	console.log("=".repeat(50));
	console.log("Si tous les tests passent, le problème vient probablement de :");
	console.log("1. L'image n'est pas uploadée dans Sanity");
	console.log("2. L'image n'est pas assignée à un produit");
	console.log("3. Problème de permissions Sanity");
	console.log("4. Problème de CDN Sanity");
	console.log("\n💡 Solutions :");
	console.log("1. Re-uploader l'image dans Sanity");
	console.log("2. Vérifier l'assignation de l'image au produit");
	console.log("3. Vérifier les permissions Sanity");
	console.log("4. Contacter le support Sanity si nécessaire");
}

// Exécuter les tests
testImg12();
