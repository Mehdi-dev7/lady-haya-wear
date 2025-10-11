const { prisma } = require("./prisma-client");

async function markMigrationAsApplied() {
	try {
		console.log("🔧 Marquage de la migration comme appliquée...\n");

		// Vérifier si la table _prisma_migrations existe
		const migrations = await prisma.$queryRaw`
			SELECT migration_name, finished_at 
			FROM _prisma_migrations 
			ORDER BY finished_at DESC 
			LIMIT 5
		`;

		console.log("📋 Dernières migrations:");
		migrations.forEach((migration, index) => {
			console.log(
				`${index + 1}. ${migration.migration_name} - ${migration.finished_at}`
			);
		});

		// Marquer la migration newsletter comme appliquée
		const migrationName = "20250910000000_add_newsletter";

		// Vérifier si la migration existe déjà
		const existingMigration = await prisma.$queryRaw`
			SELECT migration_name FROM _prisma_migrations 
			WHERE migration_name = ${migrationName}
		`;

		if (existingMigration.length === 0) {
			await prisma.$queryRaw`
				INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
				VALUES (
					${migrationName},
					'',
					NOW(),
					${migrationName},
					'',
					NULL,
					NOW(),
					1
				)
			`;
			console.log(`✅ Migration ${migrationName} ajoutée`);
		} else {
			console.log(`ℹ️  Migration ${migrationName} existe déjà`);
		}

		console.log(`✅ Migration ${migrationName} marquée comme appliquée`);

		// Vérifier que le champ newsletterSubscribed existe
		const testUser = await prisma.user.findFirst({
			select: {
				id: true,
				email: true,
				newsletterSubscribed: true,
			},
		});

		if (testUser) {
			console.log("✅ Le champ newsletterSubscribed est accessible");
		} else {
			console.log("⚠️  Aucun utilisateur trouvé pour tester le champ");
		}
	} catch (error) {
		console.error("❌ Erreur:", error.message);

		if (error.message.includes("newsletterSubscribed")) {
			console.log(
				"\n💡 Le champ newsletterSubscribed n'existe pas encore dans la base."
			);
			console.log(
				"   Vous devez l'ajouter manuellement dans Supabase ou attendre que Prisma se connecte."
			);
		}
	} finally {
		await prisma.$disconnect();
	}
}

markMigrationAsApplied();
