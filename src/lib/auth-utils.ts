import { verify } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
const JWT_SECRET =
	process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AdminUser {
	id: string;
	email: string;
	name: string;
	role: string;
}

export async function getAdminFromRequest(
	request: NextRequest
): Promise<AdminUser | null> {
	try {
		const token = request.cookies.get("admin-token")?.value;

		if (!token) {
			return null;
		}

		// Vérifier le token
		const decoded = verify(token, JWT_SECRET) as any;

		if (!decoded || !decoded.id) {
			return null;
		}

		// Vérifier que l'admin existe toujours et est actif
		const admin = await prisma.admin.findUnique({
			where: { id: decoded.id },
		});

		if (!admin || !admin.isActive) {
			return null;
		}

		return {
			id: admin.id,
			email: admin.email,
			name: admin.name,
			role: admin.role,
		};
	} catch (error) {
		console.error("Erreur lors de la vérification d'authentification:", error);
		return null;
	}
}
