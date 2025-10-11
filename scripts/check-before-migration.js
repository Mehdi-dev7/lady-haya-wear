const { prisma } = require("./prisma-client");

async function checkBeforeMigration() {
	try {
		console.log("🔍 Vérification de la base avant migration...\n");

		// Compter les utilisateurs
		const userCount = await prisma.user.count();
		console.log(`👥 Utilisateurs: ${userCount}`);

		// Compter les commandes par statut
		const orderStats = await prisma.order.groupBy({
			by: ["status"],
			_count: { status: true },
		});

		console.log("📦 Commandes par statut:");
		orderStats.forEach((stat) => {
			console.log(`  - ${stat.status}: ${stat._count.status}`);
		});

		// Compter les autres données importantes
		const cartItems = await prisma.cartItem.count();
		const favorites = await prisma.favorite.count();
		const addresses = await prisma.address.count();
		const promoCodes = await prisma.promoCode.count();

		console.log(`🛒 Articles panier: ${cartItems}`);
		console.log(`❤️  Favoris: ${favorites}`);
		console.log(`📍 Adresses: ${addresses}`);
		console.log(`🎫 Codes promo: ${promoCodes}`);

		console.log(
			"\n✅ Vérification terminée. Sauvegardez si nécessaire avant de continuer."
		);
	} catch (error) {
		console.error("❌ Erreur lors de la vérification:", error);
	} finally {
		await prisma.$disconnect();
	}
}

checkBeforeMigration();
