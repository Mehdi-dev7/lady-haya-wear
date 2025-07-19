import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ providers: [], user: null }, { status: 401 });
		}
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		if (!userId) {
			return NextResponse.json({ providers: [], user: null }, { status: 401 });
		}
		const accounts = await prisma.account.findMany({
			where: { userId },
			select: { provider: true },
		});
		const providers = accounts.map((a) => a.provider);
		// Si l'utilisateur a un mot de passe, on ajoute 'credentials' comme provider
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { profile: true },
		});
		if (user?.password) {
			providers.push("credentials");
		}
		// Construction de l'objet user pour le front
		const userObj = user
			? {
					nom: user.profile?.lastName || "",
					prenom: user.profile?.firstName || "",
					civility:
						user.profile?.civility === "MR"
							? "M."
							: user.profile?.civility === "MME"
								? "Mme"
								: "",
					email: user.email,
					telephone: user.profile?.phone || "",
				}
			: null;
		return NextResponse.json({ providers, user: userObj });
	} catch (error) {
		console.error("Erreur récupération providers:", error);
		return NextResponse.json({ providers: [], user: null }, { status: 500 });
	}
}

export async function GET_address(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ address: null }, { status: 401 });
		}
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		if (!userId) {
			return NextResponse.json({ address: null }, { status: 401 });
		}
		const address = await prisma.address.findFirst({
			where: { userId, type: "SHIPPING", isDefault: true },
		});
		return NextResponse.json({ address });
	} catch (error) {
		console.error("Erreur get address:", error);
		return NextResponse.json({ address: null }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		if (!userId) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}
		const body = await request.json();
		const { nom, prenom, civility, email, telephone } = body;
		// Mettre à jour User
		if (email) {
			await prisma.user.update({ where: { id: userId }, data: { email } });
		}
		// Mettre à jour UserProfile
		let profileData: any = {};
		if (prenom) {
			profileData.firstName = prenom;
		}
		if (nom) {
			profileData.lastName = nom;
		}
		if (civility) {
			profileData.civility = civility; // "MR" ou "MME"
		}
		if (telephone !== undefined) {
			profileData.phone = telephone;
		}
		if (Object.keys(profileData).length > 0) {
			// Crée le profil s'il n'existe pas
			await prisma.userProfile.upsert({
				where: { userId },
				update: profileData,
				create: { ...profileData, userId },
			});
		}
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur update account:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

export async function PATCH_address(request: NextRequest) {
	try {
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		if (!userId) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}
		const body = await request.json();
		const { nom, ligne1, ligne2, codePostal, ville } = body;
		if (!nom || !ligne1 || !codePostal || !ville) {
			return NextResponse.json(
				{ error: "Champs requis manquants" },
				{ status: 400 }
			);
		}
		// On cherche une adresse principale existante
		const existing = await prisma.address.findFirst({
			where: { userId, type: "SHIPPING", isDefault: true },
		});
		let address;
		if (existing) {
			address = await prisma.address.update({
				where: { id: existing.id },
				data: {
					firstName: nom,
					lastName: "",
					street: ligne1,
					city: ville,
					zipCode: codePostal,
					company: ligne2 || null,
					type: "SHIPPING",
					isDefault: true,
					country: "France",
				},
			});
		} else {
			address = await prisma.address.create({
				data: {
					userId,
					firstName: nom,
					lastName: "",
					street: ligne1,
					city: ville,
					zipCode: codePostal,
					company: ligne2 || null,
					type: "SHIPPING",
					isDefault: true,
					country: "France",
				},
			});
		}
		return NextResponse.json({ success: true, address });
	} catch (error) {
		console.error("Erreur update address:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
