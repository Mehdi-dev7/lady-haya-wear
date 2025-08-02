// Script de test pour vérifier la configuration Facebook et Instagram
const fs = require("fs");
const path = require("path");

console.log("🔍 Vérification de la configuration Facebook et Instagram...\n");

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

const hasFacebookAppId = envContent.includes("FACEBOOK_APP_ID=");
const hasFacebookAppSecret = envContent.includes("FACEBOOK_APP_SECRET=");
const hasInstagramAppId = envContent.includes("INSTAGRAM_APP_ID=");
const hasInstagramAppSecret = envContent.includes("INSTAGRAM_APP_SECRET=");

console.log("📋 Variables d'environnement :");
console.log(
	`   FACEBOOK_APP_ID: ${hasFacebookAppId ? "✅ Configuré" : "❌ Manquant"}`
);
console.log(
	`   FACEBOOK_APP_SECRET: ${hasFacebookAppSecret ? "✅ Configuré" : "❌ Manquant"}`
);
console.log(
	`   INSTAGRAM_APP_ID: ${hasInstagramAppId ? "✅ Configuré" : "❌ Manquant"}`
);
console.log(
	`   INSTAGRAM_APP_SECRET: ${hasInstagramAppSecret ? "✅ Configuré" : "❌ Manquant"}`
);

// Vérifier les fichiers de l'API
const apiFiles = [
	"src/app/api/auth/facebook/route.ts",
	"src/app/api/auth/facebook/callback/route.ts",
	"src/app/api/auth/instagram/route.ts",
	"src/app/api/auth/instagram/callback/route.ts",
];

console.log("\n📁 Fichiers API :");
apiFiles.forEach((file) => {
	const filePath = path.join(process.cwd(), file);
	const exists = fs.existsSync(filePath);
	console.log(`   ${file}: ${exists ? "✅ Existe" : "❌ Manquant"}`);
});

// Vérifier les composants
const componentFiles = [
	"src/components/LoginClient/FacebookLoginButton.tsx",
	"src/components/LoginClient/InstagramLoginButton.tsx",
];

console.log("\n🎨 Composants UI :");
componentFiles.forEach((file) => {
	const filePath = path.join(process.cwd(), file);
	const exists = fs.existsSync(filePath);
	console.log(`   ${file}: ${exists ? "✅ Existe" : "❌ Manquant"}`);
});

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

const hasFacebookImport = loginClientContent.includes("FacebookLoginButton");
const hasInstagramImport = loginClientContent.includes("InstagramLoginButton");
const hasFacebookButton = loginClientContent.includes(
	"<FacebookLoginButton />"
);
const hasInstagramButton = loginClientContent.includes(
	"<InstagramLoginButton />"
);
const hasFacebookErrors = loginClientContent.includes("facebook_auth_failed");
const hasInstagramErrors = loginClientContent.includes("instagram_auth_failed");

console.log("\n🔧 Intégration dans LoginClient :");
console.log(
	`   Import FacebookLoginButton: ${hasFacebookImport ? "✅ Présent" : "❌ Manquant"}`
);
console.log(
	`   Import InstagramLoginButton: ${hasInstagramImport ? "✅ Présent" : "❌ Manquant"}`
);
console.log(
	`   Bouton Facebook: ${hasFacebookButton ? "✅ Présent" : "❌ Manquant"}`
);
console.log(
	`   Bouton Instagram: ${hasInstagramButton ? "✅ Présent" : "❌ Manquant"}`
);
console.log(
	`   Gestion des erreurs Facebook: ${hasFacebookErrors ? "✅ Présente" : "❌ Manquante"}`
);
console.log(
	`   Gestion des erreurs Instagram: ${hasInstagramErrors ? "✅ Présente" : "❌ Manquante"}`
);

// Résumé
console.log("\n📊 Résumé :");
const totalChecks = 12;
const passedChecks = [
	hasFacebookAppId,
	hasFacebookAppSecret,
	hasInstagramAppId,
	hasInstagramAppSecret,
	...apiFiles.map((f) => fs.existsSync(path.join(process.cwd(), f))),
	...componentFiles.map((f) => fs.existsSync(path.join(process.cwd(), f))),
	hasFacebookImport,
	hasInstagramImport,
	hasFacebookButton,
	hasInstagramButton,
	hasFacebookErrors,
	hasInstagramErrors,
].filter(Boolean).length;

console.log(`   ${passedChecks}/${totalChecks} vérifications réussies`);

if (passedChecks === totalChecks) {
	console.log("\n🎉 Configuration Facebook et Instagram complète !");
	console.log("   Vous pouvez maintenant tester l'authentification sociale.");
} else {
	console.log("\n⚠️  Configuration incomplète.");
	console.log(
		"   Consultez la documentation pour les instructions de configuration."
	);
}

console.log("\n📖 Documentation :");
console.log("   - INSTAGRAM_SETUP.md");
console.log("   - FACEBOOK_SETUP.md (à créer)");

console.log("\n🚀 Pour tester :");
console.log("   1. Configurez les variables d'environnement");
console.log("   2. Lancez : npm run dev");
console.log("   3. Allez sur : /login");
console.log("   4. Testez les boutons Facebook et Instagram");
