import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Début du seeding...");

	// Vérifier si un admin existe déjà
	const existingAdmin = await prisma.admin.findFirst();

	if (existingAdmin) {
		console.log("✅ Un administrateur existe déjà, skip du seeding admin");
		return;
	}

	// Créer le premier admin
	const hashedPassword = await bcrypt.hash("admin123", 12);

	const admin = await prisma.admin.create({
		data: {
			email: "lady.haya.75@gmail.com",
			password: hashedPassword,
			name: "Administrateur Principal",
			role: "SUPER_ADMIN",
			isActive: true,
		},
	});

	console.log("✅ Premier administrateur créé:", admin.email);
	console.log("🔑 Mot de passe temporaire: admin123");
	console.log(
		"⚠️  N'oubliez pas de changer le mot de passe après la première connexion !"
	);
}

main()
	.catch((e) => {
		console.error("❌ Erreur lors du seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
