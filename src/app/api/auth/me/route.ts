import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		// Vérifier le token JWT
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
				name: user.name,
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
