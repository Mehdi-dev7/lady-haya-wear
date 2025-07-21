import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Récupérer une commande spécifique
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const order = await prisma.order.findUnique({
			where: { id },
			include: {
				items: true,
				user: {
					select: {
						id: true,
						email: true,
					},
				},
				shippingAddress: true,
				billingAddress: true,
				promoCode: {
					select: {
						id: true,
						code: true,
						type: true,
						value: true,
					},
				},
			},
		});

		if (!order) {
			return NextResponse.json(
				{ error: "Commande non trouvée" },
				{ status: 404 }
			);
		}

		return NextResponse.json(order);
	} catch (error) {
		console.error("Erreur lors de la récupération de la commande:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération de la commande" },
			{ status: 500 }
		);
	}
}

// PUT - Mettre à jour le statut d'une commande
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { status, notes } = await request.json();

		// Vérifier si la commande existe
		const existingOrder = await prisma.order.findUnique({
			where: { id },
		});

		if (!existingOrder) {
			return NextResponse.json(
				{ error: "Commande non trouvée" },
				{ status: 404 }
			);
		}

		// Préparer les données de mise à jour
		const updateData: any = {};

		if (status) {
			updateData.status = status;

			// Mettre à jour les dates selon le statut
			if (status === "CONFIRMED" && !existingOrder.confirmedAt) {
				updateData.confirmedAt = new Date();
			} else if (status === "SHIPPED" && !existingOrder.shippedAt) {
				updateData.shippedAt = new Date();
			} else if (status === "DELIVERED" && !existingOrder.deliveredAt) {
				updateData.deliveredAt = new Date();
			}

			// Si on revient à un statut antérieur, on peut réinitialiser les dates
			if (status === "PENDING") {
				updateData.confirmedAt = null;
				updateData.shippedAt = null;
				updateData.deliveredAt = null;
			} else if (status === "CONFIRMED") {
				updateData.shippedAt = null;
				updateData.deliveredAt = null;
			} else if (status === "SHIPPED") {
				updateData.deliveredAt = null;
			}
		}

		if (notes !== undefined) {
			updateData.notes = notes;
		}

		// Mettre à jour la commande
		const order = await prisma.order.update({
			where: { id },
			data: updateData,
			include: {
				items: true,
				user: {
					select: {
						id: true,
						email: true,
					},
				},
				shippingAddress: true,
				billingAddress: true,
				promoCode: {
					select: {
						id: true,
						code: true,
					},
				},
			},
		});

		return NextResponse.json({
			message: "Statut de la commande mis à jour avec succès",
			order,
		});
	} catch (error) {
		console.error("Erreur lors de la mise à jour de la commande:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la mise à jour de la commande" },
			{ status: 500 }
		);
	}
}
