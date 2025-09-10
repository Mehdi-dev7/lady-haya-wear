const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function backupCriticalData() {
	try {
		console.log("💾 Sauvegarde des données critiques...\n");

		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const backupDir = path.join(__dirname, `../backups/${timestamp}`);

		// Créer le dossier de sauvegarde
		if (!fs.existsSync(path.dirname(backupDir))) {
			fs.mkdirSync(path.dirname(backupDir), { recursive: true });
		}
		fs.mkdirSync(backupDir, { recursive: true });

		// Sauvegarder les utilisateurs avec leurs profils
		const users = await prisma.user.findMany({
			include: {
				profile: true,
				addresses: true,
			},
		});
		fs.writeFileSync(
			path.join(backupDir, "users.json"),
			JSON.stringify(users, null, 2)
		);
		console.log(`✅ ${users.length} utilisateurs sauvegardés`);

		// Sauvegarder les commandes avec leurs articles
		const orders = await prisma.order.findMany({
			include: {
				items: true,
			},
		});
		fs.writeFileSync(
			path.join(backupDir, "orders.json"),
			JSON.stringify(orders, null, 2)
		);
		console.log(`✅ ${orders.length} commandes sauvegardées`);

		// Sauvegarder les paniers
		const cartItems = await prisma.cartItem.findMany();
		fs.writeFileSync(
			path.join(backupDir, "cart-items.json"),
			JSON.stringify(cartItems, null, 2)
		);
		console.log(`✅ ${cartItems.length} articles panier sauvegardés`);

		// Sauvegarder les favoris
		const favorites = await prisma.favorite.findMany();
		fs.writeFileSync(
			path.join(backupDir, "favorites.json"),
			JSON.stringify(favorites, null, 2)
		);
		console.log(`✅ ${favorites.length} favoris sauvegardés`);

		// Sauvegarder les codes promo
		const promoCodes = await prisma.promoCode.findMany();
		fs.writeFileSync(
			path.join(backupDir, "promo-codes.json"),
			JSON.stringify(promoCodes, null, 2)
		);
		console.log(`✅ ${promoCodes.length} codes promo sauvegardés`);

		// Sauvegarder les admins
		const admins = await prisma.admin.findMany();
		fs.writeFileSync(
			path.join(backupDir, "admins.json"),
			JSON.stringify(admins, null, 2)
		);
		console.log(`✅ ${admins.length} admins sauvegardés`);

		console.log(`\n💾 Sauvegarde complète dans: ${backupDir}`);

		// Créer un fichier de métadonnées
		const metadata = {
			timestamp: new Date().toISOString(),
			counts: {
				users: users.length,
				orders: orders.length,
				cartItems: cartItems.length,
				favorites: favorites.length,
				promoCodes: promoCodes.length,
				admins: admins.length,
			},
		};
		fs.writeFileSync(
			path.join(backupDir, "metadata.json"),
			JSON.stringify(metadata, null, 2)
		);
	} catch (error) {
		console.error("❌ Erreur lors de la sauvegarde:", error);
	} finally {
		await prisma.$disconnect();
	}
}

backupCriticalData();

