import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Health check endpoint
 * Utilisé pour :
 * 1. Vérifier que l'API et la base de données fonctionnent
 * 2. Garder Supabase actif (évite la mise en pause automatique)
 *
 * À configurer avec UptimeRobot pour un ping automatique toutes les 30 minutes
 */
export async function GET() {
	try {
		// Simple requête pour vérifier la connexion à la base de données
		// et garder Supabase actif
		await prisma.$queryRaw`SELECT 1`;

		return NextResponse.json({
			status: "ok",
			timestamp: new Date().toISOString(),
			database: "connected",
		});
	} catch (error) {
		console.error("Health check failed:", error);
		return NextResponse.json(
			{
				status: "error",
				timestamp: new Date().toISOString(),
				database: "disconnected",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
