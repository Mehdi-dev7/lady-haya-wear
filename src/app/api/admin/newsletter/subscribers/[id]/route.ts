import { getAdminFromRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE - Supprimer un abonné
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const admin = await getAdminFromRequest(request);

		if (!admin) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		const resolvedParams = await params;
		const subscriberId = resolvedParams.id;

		// Supprimer l'abonné (ou marquer comme désabonné)
		await prisma.user.delete({
			where: { id: subscriberId },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'abonné:", error);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 }
		);
	}
}
