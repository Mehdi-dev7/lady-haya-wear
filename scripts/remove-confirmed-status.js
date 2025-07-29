const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function removeConfirmedStatus() {
	try {
		console.log("🔧 Suppression du statut CONFIRMED...");

		// Vérifier s'il y a des commandes avec le statut CONFIRMED
		const confirmedOrders = await prisma.order.findMany({
			where: {
				status: "CONFIRMED",
			},
		});

		if (confirmedOrders.length > 0) {
			console.log(
				`⚠️  ${confirmedOrders.length} commande(s) trouvée(s) avec le statut CONFIRMED`
			);

			// Mettre à jour ces commandes vers PROCESSING
			const result = await prisma.order.updateMany({
				where: {
					status: "CONFIRMED",
				},
				data: {
					status: "PROCESSING",
				},
			});

			console.log(
				`✅ ${result.count} commande(s) mise(s) à jour de CONFIRMED vers PROCESSING`
			);
		} else {
			console.log("✅ Aucune commande avec le statut CONFIRMED trouvée");
		}

		// Afficher les statistiques finales
		const stats = await prisma.order.groupBy({
			by: ["status"],
			_count: {
				status: true,
			},
		});

		console.log("\n📊 Statistiques finales des statuts de commandes :");
		stats.forEach((stat) => {
			console.log(`  - ${stat.status}: ${stat._count.status} commande(s)`);
		});
	} catch (error) {
		console.error("❌ Erreur lors de la suppression du statut CONFIRMED:", error);
	} finally {
		await prisma.$disconnect();
	}
}

removeConfirmedStatus(); 