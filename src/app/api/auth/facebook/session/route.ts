import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const userData = await request.json();

		// Créer un token de session simple
		const sessionToken = Buffer.from(JSON.stringify(userData)).toString("base64");

		// Créer la réponse avec le cookie de session
		const response = NextResponse.json({ 
			success: true, 
			user: {
				id: userData.id,
				email: userData.email,
				name: userData.name,
				profile: {
					firstName: userData.name.split(" ")[0],
					lastName: userData.name.split(" ").slice(1).join(" "),
				},
			}
		});

		// Définir le cookie de session
		response.cookies.set("auth-token", sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60, // 7 jours
		});

		return response;
	} catch (error) {
		console.error("Erreur lors de la création de session Facebook:", error);
		return NextResponse.json(
			{ success: false, error: "Erreur lors de la création de session" },
			{ status: 500 }
		);
	}
} 