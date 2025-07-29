import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { 
	secureNameSchema, 
	secureEmailSchema, 
	securePhoneSchema,
	sanitizeObject,
	logSecurityEvent
} from "@/lib/security";

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

export async function PATCH(request: NextRequest) {
	try {
		// ===== VÉRIFICATION AUTHENTIFICATION =====
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}
		
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const userId = decoded.userId;
		if (!userId) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
		}

		// ===== VALIDATION ET SANITISATION =====
		const rawBody = await request.json();
		const sanitizedBody = sanitizeObject(rawBody);
		
		const updateSchema = z.object({
			nom: secureNameSchema.optional(),
			prenom: secureNameSchema.optional(),
			civility: z.enum(["M.", "Mme"]).optional(),
			email: secureEmailSchema.optional(),
			telephone: securePhoneSchema.optional(),
		});

		const parsed = updateSchema.safeParse(sanitizedBody);
		if (!parsed.success) {
			logSecurityEvent('ACCOUNT_UPDATE_VALIDATION_ERROR', { 
				userId,
				errors: parsed.error.flatten()
			});
			
			return NextResponse.json(
				{ error: "Données invalides" },
				{ status: 400 }
			);
		}

		const { nom, prenom, civility, email, telephone } = parsed.data;

		// ===== VÉRIFICATION EMAIL UNIQUE =====
		if (email) {
			const existingUser = await prisma.user.findFirst({
				where: { 
					email,
					id: { not: userId }
				}
			});
			
			if (existingUser) {
				logSecurityEvent('ACCOUNT_UPDATE_EMAIL_CONFLICT', { 
					userId,
					attemptedEmail: email
				});
				
				return NextResponse.json(
					{ error: "Cet email est déjà utilisé" },
					{ status: 400 }
				);
			}
		}

		// ===== MISE À JOUR SÉCURISÉE =====
		if (email) {
			await prisma.user.update({ 
				where: { id: userId }, 
				data: { email } 
			});
		}

		// Mise à jour UserProfile
		let profileData: any = {};
		if (prenom) {
			profileData.firstName = prenom;
		}
		if (nom) {
			profileData.lastName = nom;
		}
		if (civility) {
			profileData.civility = civility === "M." ? "MR" : "MME";
		}
		if (telephone !== undefined) {
			profileData.phone = telephone;
		}

		if (Object.keys(profileData).length > 0) {
			await prisma.userProfile.upsert({
				where: { userId },
				update: profileData,
				create: { ...profileData, userId },
			});
		}

		// ===== LOG SUCCÈS =====
		logSecurityEvent('ACCOUNT_UPDATE_SUCCESS', { 
			userId,
			updatedFields: Object.keys(profileData)
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur update account:", error);
		logSecurityEvent('ACCOUNT_UPDATE_ERROR', { 
			error: error instanceof Error ? error.message : 'Unknown error'
		});
		
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
