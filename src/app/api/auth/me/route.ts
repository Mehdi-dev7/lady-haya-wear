import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		// Vérifier le token JWT
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;

		return NextResponse.json({
			user: {
				id: decoded.userId,
				email: decoded.email,
				name: decoded.name,
			},
		});
	} catch (error) {
		console.error("Erreur lors de la vérification du token:", error);
		return NextResponse.json({ user: null }, { status: 401 });
	}
}
