const { PrismaClient } = require("@prisma/client");

// Test avec différentes configurations
async function testConnection() {
	console.log("🔍 Test de connexion à la base de données...\n");

	try {
		const prisma = new PrismaClient({
			log: ["query", "info", "warn", "error"],
		});

		console.log("✅ Client Prisma créé");

		// Test simple de connexion
		const result = await prisma.$queryRaw`SELECT 1 as test`;
		console.log("✅ Connexion réussie:", result);

		// Test de comptage des utilisateurs
		const userCount = await prisma.user.count();
		console.log(`✅ Nombre d'utilisateurs: ${userCount}`);

		// Test de lecture des colonnes de la table User
		const users = await prisma.user.findMany({
			take: 1,
			select: {
				id: true,
				email: true,
				newsletterSubscribed: true,
				createdAt: true,
			},
		});
		console.log("✅ Structure utilisateur:", users[0] || "Aucun utilisateur");

		await prisma.$disconnect();
		console.log("\n✅ Test de connexion terminé avec succès");
	} catch (error) {
		console.error("❌ Erreur de connexion:", error.message);

		// Suggestions de résolution
		console.log("\n💡 Suggestions:");
		console.log(
			"1. Vérifiez que le champ 'newsletterSubscribed' existe dans Supabase"
		);
		console.log(
			"2. Essayez d'utiliser l'URL de connexion directe au lieu du pooler"
		);
		console.log("3. Vérifiez les permissions de votre utilisateur Supabase");
	}
}

testConnection();

