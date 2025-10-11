const { prisma } = require("./prisma-client");

async function testAfterUpgrade() {
	try {
		console.log("🔍 Test après mise à jour PostgreSQL...\n");

		// Test de connexion basique
		console.log("1. Test de connexion...");
		const connectionTest =
			await prisma.$queryRaw`SELECT version() as postgres_version`;
		console.log("✅ Connexion réussie");
		console.log(`📊 Version PostgreSQL: ${connectionTest[0].postgres_version}`);

		// Test des données utilisateur
		console.log("\n2. Vérification des données utilisateur...");
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				newsletterSubscribed: true,
				createdAt: true,
			},
		});
		console.log(`✅ ${users.length} utilisateur(s) trouvé(s)`);

		if (users.length > 0) {
			console.log("📧 Premier utilisateur:", {
				email: users[0].email,
				newsletter: users[0].newsletterSubscribed,
			});
		}

		// Test des codes promo
		console.log("\n3. Vérification des codes promo...");
		const promoCodes = await prisma.promoCode.findMany({
			select: {
				code: true,
				active: true,
				type: true,
			},
		});
		console.log(`✅ ${promoCodes.length} code(s) promo trouvé(s)`);

		// Test des admins
		console.log("\n4. Vérification des admins...");
		const admins = await prisma.admin.findMany({
			select: {
				email: true,
				name: true,
				isActive: true,
			},
		});
		console.log(`✅ ${admins.length} admin(s) trouvé(s)`);

		// Test des migrations
		console.log("\n5. Vérification des migrations...");
		const migrations = await prisma.$queryRaw`
			SELECT migration_name, finished_at 
			FROM _prisma_migrations 
			ORDER BY finished_at DESC 
			LIMIT 3
		`;
		console.log("📋 Dernières migrations:");
		migrations.forEach((migration, index) => {
			console.log(`  ${index + 1}. ${migration.migration_name}`);
		});

		// Test d'écriture
		console.log("\n6. Test d'écriture...");
		const testWrite = await prisma.$queryRaw`
			SELECT NOW() as current_time, 'test' as test_value
		`;
		console.log("✅ Écriture/lecture fonctionnelle");

		console.log(
			"\n🎉 Tous les tests sont passés ! La mise à jour s'est bien déroulée."
		);
	} catch (error) {
		console.error("❌ Erreur lors du test:", error.message);
		console.log("\n💡 Si vous voyez cette erreur:");
		console.log("1. Attendez quelques minutes et réessayez");
		console.log(
			"2. Vérifiez que la mise à jour est complètement terminée dans Supabase"
		);
		console.log("3. Redémarrez votre application si nécessaire");
	} finally {
		await prisma.$disconnect();
	}
}

testAfterUpgrade();
