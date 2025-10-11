import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		// Essayer de décoder le token Facebook (base64)
		try {
			const decodedData = JSON.parse(Buffer.from(token, "base64").toString());

			// Si c'est un token Facebook avec userId, récupérer depuis la BDD
			if (decodedData.provider === "facebook" && decodedData.userId) {
				const dbUser = await prisma.user.findUnique({
					where: { id: decodedData.userId },
					include: { profile: true },
				});

				if (dbUser) {
					return NextResponse.json({
						user: {
							id: dbUser.id,
							email: dbUser.email,
							profile: {
								firstName: dbUser.profile?.firstName || "",
								lastName: dbUser.profile?.lastName || "",
							},
						},
					});
				}
			}
		} catch (facebookError) {
			// Si ce n'est pas un token Facebook, essayer JWT
		}

		// Vérifier le token JWT (pour les utilisateurs normaux)
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			include: { profile: true },
		});
		if (!user) {
			return NextResponse.json({ user: null }, { status: 401 });
		}
		return NextResponse.json({
			user: {
				id: user.id,
				email: user.email,
				profile: {
					firstName: user.profile?.firstName || "",
					lastName: user.profile?.lastName || "",
				},
			},
		});
	} catch (error) {
		console.error("Erreur lors de la vérification du token:", error);
		return NextResponse.json({ user: null }, { status: 401 });
	}
}
