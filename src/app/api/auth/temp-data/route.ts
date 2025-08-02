import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const tempToken = cookieStore.get("temp-auth-token")?.value;

		if (!tempToken) {
			return NextResponse.json(
				{ error: "Token temporaire manquant" },
				{ status: 401 }
			);
		}

		// Vérifier le token temporaire
		const decoded = jwt.verify(tempToken, process.env.NEXTAUTH_SECRET!) as any;

		if (!decoded.temporary) {
			return NextResponse.json({ error: "Token invalide" }, { status: 401 });
		}

		// Retourner les données temporaires
		return NextResponse.json({
			instagramId: decoded.instagramId,
			instagramUsername: decoded.instagramUsername,
			accountType: decoded.accountType,
			provider: decoded.provider,
		});
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des données temporaires:",
			error
		);
		return NextResponse.json(
			{ error: "Token expiré ou invalide" },
			{ status: 401 }
		);
	}
}
