import { sendContactEmail } from "@/lib/brevo";
import { NextRequest, NextResponse } from "next/server";
import { 
	secureNameSchema, 
	secureEmailSchema, 
	secureMessageSchema, 
	sanitizeObject,
	logSecurityEvent,
	checkRateLimit
} from "@/lib/security";
import { z } from "zod";

const contactSchema = z.object({
	name: secureNameSchema,
	email: secureEmailSchema,
	message: secureMessageSchema,
	commande: z.string().optional().transform(val => val ? val.replace(/[<>]/g, '') : ''),
});

export async function POST(req: NextRequest) {
	try {
		// ===== RATE LIMITING =====
		const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
		const identifier = `contact-${ip}`;
		
		if (!checkRateLimit(identifier, 3, 60 * 1000)) { // 3 tentatives par minute
			logSecurityEvent('CONTACT_RATE_LIMIT', { ip }, ip);
			return NextResponse.json(
				{ success: false, error: "Trop de tentatives. Réessayez dans 1 minute." },
				{ status: 429 }
			);
		}

		// ===== VALIDATION ET SANITISATION =====
		const rawData = await req.json();
		const sanitizedData = sanitizeObject(rawData);
		
		const parsed = contactSchema.safeParse(sanitizedData);
		if (!parsed.success) {
			logSecurityEvent('CONTACT_VALIDATION_ERROR', { 
				errors: parsed.error.flatten(),
				ip 
			}, ip);
			
			return NextResponse.json(
				{ success: false, errors: parsed.error.flatten() },
				{ status: 400 }
			);
		}

		// ===== ENVOI SÉCURISÉ =====
		await sendContactEmail(parsed.data);
		
		logSecurityEvent('CONTACT_SUCCESS', { 
			email: parsed.data.email,
			hasCommande: !!parsed.data.commande 
		}, ip);
		
		return NextResponse.json({ success: true });
	} catch (error: any) {
		logSecurityEvent('CONTACT_ERROR', { 
			error: error.message,
			ip 
		}, ip);
		
		return NextResponse.json(
			{ success: false, error: "Erreur serveur" },
			{ status: 500 }
		);
	}
}
