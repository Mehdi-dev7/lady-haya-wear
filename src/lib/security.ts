import { NextRequest } from "next/server";
import { z } from "zod";

// ===== PROTECTION XSS =====
export function sanitizeInput(input: string): string {
	if (typeof input !== "string") return "";

	return input
		.replace(/[<>]/g, "") // Supprimer < et >
		.replace(/javascript:/gi, "") // Supprimer javascript:
		.replace(/on\w+=/gi, "") // Supprimer les event handlers
		.replace(/data:/gi, "") // Supprimer data: URLs
		.trim();
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
	const sanitized: any = {};

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "string") {
			sanitized[key] = sanitizeInput(value);
		} else if (typeof value === "object" && value !== null) {
			sanitized[key] = sanitizeObject(value);
		} else {
			sanitized[key] = value;
		}
	}

	return sanitized as T;
}

// ===== PROTECTION CSRF =====
export function generateCSRFToken(): string {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}

export function validateCSRFToken(
	request: NextRequest,
	token: string
): boolean {
	const csrfToken = request.headers.get("x-csrf-token");
	return csrfToken === token;
}

// ===== RATE LIMITING =====
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
	identifier: string,
	limit: number,
	windowMs: number
): boolean {
	const now = Date.now();
	const record = rateLimitStore.get(identifier);

	if (!record || now > record.resetTime) {
		rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
		return true;
	}

	if (record.count >= limit) {
		return false;
	}

	record.count++;
	return true;
}

// ===== VALIDATION SÉCURISÉE =====
export const secureStringSchema = z
	.string()
	.min(1, "Champ requis")
	.max(1000, "Trop long")
	.transform(sanitizeInput);

export const secureEmailSchema = z
	.string()
	.email("Email invalide")
	.max(254, "Email trop long")
	.transform(sanitizeInput);

export const secureNameSchema = z
	.string()
	.min(2, "Minimum 2 caractères")
	.max(50, "Maximum 50 caractères")
	.regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères non autorisés")
	.transform(sanitizeInput);

export const securePhoneSchema = z
	.string()
	.regex(/^[\d\s+\-\(\)]+$/, "Format téléphone invalide")
	.max(20, "Numéro trop long")
	.transform(sanitizeInput);

export const secureAddressSchema = z
	.string()
	.min(5, "Adresse trop courte")
	.max(200, "Adresse trop longue")
	.transform(sanitizeInput);

export const secureMessageSchema = z
	.string()
	.min(10, "Message trop court")
	.max(2000, "Message trop long")
	.transform(sanitizeInput);

// ===== HEADERS DE SÉCURITÉ =====
export const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
	"Content-Security-Policy":
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
};

// ===== VALIDATION DE MOT DE PASSE =====
export function validatePasswordStrength(password: string): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push("Minimum 8 caractères");
	}

	if (!/[A-Z]/.test(password)) {
		errors.push("Au moins une majuscule");
	}

	if (!/[a-z]/.test(password)) {
		errors.push("Au moins une minuscule");
	}

	if (!/[0-9]/.test(password)) {
		errors.push("Au moins un chiffre");
	}

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		errors.push("Au moins un caractère spécial");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

// ===== LOGGING SÉCURISÉ =====
export function logSecurityEvent(event: string, details: any, ip?: string) {
	const logEntry = {
		timestamp: new Date().toISOString(),
		event,
		ip: ip || "unknown",
		details: typeof details === "string" ? details : JSON.stringify(details),
		userAgent: "hidden", // Ne pas logger les user agents sensibles
	};

	console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);
}

// ===== VALIDATION D'URL =====
export function isValidURL(url: string): boolean {
	try {
		const parsed = new URL(url);
		return ["http:", "https:"].includes(parsed.protocol);
	} catch {
		return false;
	}
}

// ===== PROTECTION CONTRE L'INJECTION =====
export function escapeSQL(input: string): string {
	return input
		.replace(/'/g, "''")
		.replace(/--/g, "")
		.replace(/;/, "")
		.replace(/\/\*/, "")
		.replace(/\*\//, "");
}

// ===== VALIDATION DE FICHIER =====
export const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];
export const maxFileSize = 5 * 1024 * 1024; // 5MB

export function validateFile(file: File): { valid: boolean; error?: string } {
	if (!allowedFileTypes.includes(file.type)) {
		return { valid: false, error: "Type de fichier non autorisé" };
	}

	if (file.size > maxFileSize) {
		return { valid: false, error: "Fichier trop volumineux (max 5MB)" };
	}

	return { valid: true };
}
