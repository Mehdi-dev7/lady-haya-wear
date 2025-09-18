const { PrismaClient } = require("@prisma/client");

async function testConnection() {
	const prisma = new PrismaClient();

	try {
		console.log("🔄 Test de connexion à la base de données...");

		// Test simple de connexion
		await prisma.$connect();
		console.log("✅ Connexion réussie !");

		// Test d'une requête simple avec Prisma (pas de raw query)
		const result = await prisma.$queryRaw`SELECT 1 as test`;
		console.log("✅ Requête test réussie :", result);

		console.log("✅ Test de connexion terminé avec succès !");
	} catch (error) {
		console.error("❌ Erreur de connexion :", error.message);
		console.error("❌ Détails :", error);
	} finally {
		await prisma.$disconnect();
		console.log("🔌 Connexion fermée");
	}
}

testConnection();
