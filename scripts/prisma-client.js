const { PrismaClient } = require("@prisma/client");

// Singleton pour PrismaClient
// Évite les multiples connexions lors de l'exécution de scripts
const prisma =
	global.prisma ||
	new PrismaClient({
		log: process.env.DEBUG_PRISMA
			? ["query", "info", "warn", "error"]
			: ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}

module.exports = { prisma };
