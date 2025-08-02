// Script de test pour vérifier la configuration Instagram
const fs = require("fs");
const path = require("path");

console.log("🔍 Vérification de la configuration Instagram...\n");

// Vérifier les variables d'environnement
const envPath = path.join(process.cwd(), ".env.local");
let envContent = "";

try {
	if (fs.existsSync(envPath)) {
		envContent = fs.readFileSync(envPath, "utf8");
	}
} catch (error) {
	console.log("⚠️  Impossible de lire le fichier .env.local");
}

const hasInstagramAppId = envContent.includes("INSTAGRAM_APP_ID=");
const hasInstagramAppSecret = envContent.includes("INSTAGRAM_APP_SECRET=");

console.log("📋 Variables d'environnement :");
console.log(
	`   INSTAGRAM_APP_ID: ${hasInstagramAppId ? "✅ Configuré" : "❌ Manquant"}`
);
console.log(
	`   INSTAGRAM_APP_SECRET: ${hasInstagramAppSecret ? "✅ Configuré" : "❌ Manquant"}`
);

// Vérifier les fichiers de l'API
const apiFiles = [
	"src/app/api/auth/instagram/route.ts",
	"src/app/api/auth/instagram/callback/route.ts",
];

console.log("\n📁 Fichiers API :");
apiFiles.forEach((file) => {
	const filePath = path.join(process.cwd(), file);
	const exists = fs.existsSync(filePath);
	console.log(`   ${file}: ${exists ? "✅ Existe" : "❌ Manquant"}`);
});

// Vérifier le composant
const componentPath = path.join(
	process.cwd(),
	"src/components/LoginClient/InstagramLoginButton.tsx"
);
const componentExists = fs.existsSync(componentPath);
console.log(
	`   src/components/LoginClient/InstagramLoginButton.tsx: ${componentExists ? "✅ Existe" : "❌ Manquant"}`
);

// Vérifier l'intégration dans LoginClient
const loginClientPath = path.join(
	process.cwd(),
	"src/components/LoginClient/LoginClient.tsx"
);
let loginClientContent = "";
try {
	if (fs.existsSync(loginClientPath)) {
		loginClientContent = fs.readFileSync(loginClientPath, "utf8");
	}
} catch (error) {
	console.log("⚠️  Impossible de lire le fichier LoginClient.tsx");
}

const hasInstagramImport = loginClientContent.includes("InstagramLoginButton");
const hasInstagramButton = loginClientContent.includes(
	"<InstagramLoginButton />"
);
const hasInstagramErrors = loginClientContent.includes("instagram_auth_failed");

console.log("\n🔧 Intégration dans LoginClient :");
console.log(
	`   Import InstagramLoginButton: ${hasInstagramImport ? "✅ Présent" : "❌ Manquant"}`
);
console.log(
	`   Bouton Instagram: ${hasInstagramButton ? "✅ Présent" : "❌ Manquant"}`
);
console.log(
	`   Gestion des erreurs Instagram: ${hasInstagramErrors ? "✅ Présente" : "❌ Manquante"}`
);

// Résumé
console.log("\n📊 Résumé :");
const totalChecks = 6;
const passedChecks = [
	hasInstagramAppId,
	hasInstagramAppSecret,
	...apiFiles.map((f) => fs.existsSync(path.join(process.cwd(), f))),
	componentExists,
	hasInstagramImport,
	hasInstagramButton,
	hasInstagramErrors,
].filter(Boolean).length;

console.log(`   ${passedChecks}/${totalChecks} vérifications réussies`);

if (passedChecks === totalChecks) {
	console.log("\n🎉 Configuration Instagram complète !");
	console.log("   Vous pouvez maintenant tester l'authentification Instagram.");
} else {
	console.log("\n⚠️  Configuration incomplète.");
	console.log(
		"   Consultez le fichier INSTAGRAM_SETUP.md pour les instructions de configuration."
	);
}

console.log("\n📖 Documentation : INSTAGRAM_SETUP.md");
