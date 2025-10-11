import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// PUT - Modifier un admin
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { email, password, name, role, isActive } = await request.json();

		// Validation des champs
		if (!email || !name || !role) {
			return NextResponse.json(
				{ error: "Email, nom et rôle sont requis" },
				{ status: 400 }
			);
		}

		// Vérifier si l'admin existe
		const existingAdmin = await prisma.admin.findUnique({
			where: { id },
		});

		if (!existingAdmin) {
			return NextResponse.json(
				{ error: "Administrateur non trouvé" },
				{ status: 404 }
			);
		}

		// Vérifier si l'email existe déjà (sauf pour cet admin)
		const emailExists = await prisma.admin.findFirst({
			where: {
				email: email.toLowerCase(),
				id: { not: id },
			},
		});

		if (emailExists) {
			return NextResponse.json(
				{ error: "Un administrateur avec cet email existe déjà" },
				{ status: 400 }
			);
		}

		// Préparer les données de mise à jour
		const updateData: any = {
			email: email.toLowerCase(),
			name,
			role,
			isActive: isActive !== undefined ? isActive : existingAdmin.isActive,
		};

		// Si un nouveau mot de passe est fourni, le hasher
		if (password) {
			updateData.password = await bcrypt.hash(password, 12);
		}

		// Mettre à jour l'admin
		const admin = await prisma.admin.update({
			where: { id },
			data: updateData,
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				isActive: true,
				lastLoginAt: true,
				createdAt: true,
			},
		});

		return NextResponse.json({
			message: "Administrateur modifié avec succès",
			admin,
		});
	} catch (error) {
		console.error("Erreur lors de la modification de l'admin:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la modification de l'administrateur" },
			{ status: 500 }
		);
	}
}

// DELETE - Supprimer un admin
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		// Vérifier si l'admin existe
		const existingAdmin = await prisma.admin.findUnique({
			where: { id },
		});

		if (!existingAdmin) {
			return NextResponse.json(
				{ error: "Administrateur non trouvé" },
				{ status: 404 }
			);
		}

		// Empêcher la suppression du dernier admin
		const adminCount = await prisma.admin.count();
		if (adminCount <= 1) {
			return NextResponse.json(
				{ error: "Impossible de supprimer le dernier administrateur" },
				{ status: 400 }
			);
		}

		// Supprimer l'admin
		await prisma.admin.delete({
			where: { id },
		});

		return NextResponse.json({
			message: "Administrateur supprimé avec succès",
		});
	} catch (error) {
		console.error("Erreur lors de la suppression de l'admin:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la suppression de l'administrateur" },
			{ status: 500 }
		);
	}
}
