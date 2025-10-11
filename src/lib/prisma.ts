import { PrismaClient } from "@prisma/client";

// Singleton pour PrismaClient
// En développement, Next.js recharge les modules fréquemment
// ce qui peut créer plusieurs instances de PrismaClient
// Cette approche évite ce problème

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}
