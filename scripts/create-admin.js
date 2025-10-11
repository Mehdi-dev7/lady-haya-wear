const { prisma } = require("./prisma-client");
const bcrypt = require("bcryptjs");

async function createAdmin() {
	try {
		// Vérifier s'il y a déjà des admins
		const existingAdmins = await prisma.admin.findMany();

		if (existingAdmins.length > 0) {
			console.log("Admins existants trouvés:");
			existingAdmins.forEach((admin) => {
				console.log(`- ${admin.email} (${admin.name}) - ${admin.role}`);
			});
			return;
		}

		// Créer un admin par défaut
		const hashedPassword = await bcrypt.hash("admin123", 12);

		const admin = await prisma.admin.create({
			data: {
				email: "admin@ladyhaya-wear.fr",
				password: hashedPassword,
				name: "Administrateur",
				role: "SUPER_ADMIN",
				isActive: true,
			},
		});

		console.log("✅ Admin créé avec succès !");
		console.log("Email:", admin.email);
		console.log("Mot de passe: admin123");
		console.log("Rôle:", admin.role);
		console.log("");
		console.log("🔐 Vous pouvez maintenant vous connecter sur:");
		console.log("https://lady-haya-wear.vercel.app/admin-login");
		console.log("");
		console.log(
			"⚠️  IMPORTANT: Changez le mot de passe après la première connexion !"
		);
	} catch (error) {
		console.error("❌ Erreur lors de la création de l'admin:", error);
	} finally {
		await prisma.$disconnect();
	}
}

createAdmin();
