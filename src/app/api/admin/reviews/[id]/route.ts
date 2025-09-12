import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Récupérer un review spécifique
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const review = await prisma.review.findUnique({
			where: { id },
			include: {
				order: {
					select: {
						orderNumber: true,
						createdAt: true,
						customerName: true,
						customerEmail: true,
					},
				},
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		if (!review) {
			return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
		}

		return NextResponse.json({ review });
	} catch (error) {
		console.error("Erreur lors de la récupération du review:", error);
		return NextResponse.json(
			{
				error: "Erreur lors de la récupération de l'avis",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}

// PUT - Mettre à jour le statut d'un review (approuver/rejeter)
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { status, adminComment } = await request.json();

		// Validation du statut
		if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
			return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
		}

		// Vérifier si le review existe
		const existingReview = await prisma.review.findUnique({
			where: { id },
		});

		if (!existingReview) {
			return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
		}

		// Mettre à jour le review
		const updatedReview = await prisma.review.update({
			where: { id },
			data: {
				status,
				reviewedAt: new Date(),
				// TODO: Ajouter le champ reviewedBy avec l'ID de l'admin connecté
				// reviewedBy: adminId,
			},
			include: {
				order: {
					select: {
						orderNumber: true,
						customerName: true,
					},
				},
			},
		});

		console.log(
			`Review ${id} ${status === "APPROVED" ? "approuvé" : status === "REJECTED" ? "rejeté" : "mis en attente"} pour la commande #${updatedReview.order.orderNumber}`
		);

		return NextResponse.json({
			message: `Avis ${status === "APPROVED" ? "approuvé" : status === "REJECTED" ? "rejeté" : "mis en attente"} avec succès`,
			review: updatedReview,
		});
	} catch (error) {
		console.error("Erreur lors de la mise à jour du review:", error);
		return NextResponse.json(
			{
				error: "Erreur lors de la mise à jour de l'avis",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}

// DELETE - Supprimer un review
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		// Vérifier si le review existe
		const existingReview = await prisma.review.findUnique({
			where: { id },
			select: {
				id: true,
				order: {
					select: {
						orderNumber: true,
					},
				},
			},
		});

		if (!existingReview) {
			return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
		}

		// Supprimer le review
		await prisma.review.delete({
			where: { id },
		});

		console.log(
			`Review ${id} supprimé pour la commande #${existingReview.order.orderNumber}`
		);

		return NextResponse.json({
			message: "Avis supprimé avec succès",
		});
	} catch (error) {
		console.error("Erreur lors de la suppression du review:", error);
		return NextResponse.json(
			{
				error: "Erreur lors de la suppression de l'avis",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}
