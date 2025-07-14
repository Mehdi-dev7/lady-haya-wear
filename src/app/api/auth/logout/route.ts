import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const response = NextResponse.json({ success: true });

		// Supprimer le cookie d'authentification
		response.cookies.delete("auth-token");

		return response;
	} catch (error) {
		console.error("Erreur lors de la déconnexion:", error);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 }
		);
	}
}
