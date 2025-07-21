import { NextResponse } from "next/server";

// POST - Déconnexion admin
export async function POST() {
	try {
		// Créer la réponse
		const response = NextResponse.json(
			{ message: "Déconnexion réussie" },
			{ status: 200 }
		);

		// Supprimer le cookie
		response.cookies.set("admin-token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 0, // Expire immédiatement
		});

		return response;
	} catch (error) {
		console.error("Erreur lors de la déconnexion:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la déconnexion" },
			{ status: 500 }
		);
	}
}
