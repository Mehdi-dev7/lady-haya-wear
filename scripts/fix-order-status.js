const { prisma } = require("./prisma-client");

async function fixOrderStatus() {
	try {
		console.log("🔧 Correction des statuts de commandes...");

		// Mettre à jour les commandes avec le statut PROCESSING vers PENDING
		const result = await prisma.order.updateMany({
			where: {
				status: "PROCESSING",
			},
			data: {
				status: "PENDING",
			},
		});

		console.log(
			`✅ ${result.count} commande(s) mise(s) à jour de PROCESSING vers PENDING`
		);

		// Afficher les statistiques des statuts
		const stats = await prisma.order.groupBy({
			by: ["status"],
			_count: {
				status: true,
			},
		});

		console.log("\n📊 Statistiques des statuts de commandes :");
		stats.forEach((stat) => {
			console.log(`  - ${stat.status}: ${stat._count.status} commande(s)`);
		});
	} catch (error) {
		console.error("❌ Erreur lors de la correction des statuts:", error);
	} finally {
		await prisma.$disconnect();
	}
}

fixOrderStatus();
