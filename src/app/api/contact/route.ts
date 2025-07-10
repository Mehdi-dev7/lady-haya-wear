import { sendContactEmail } from "@/lib/brevo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	message: z.string().min(10),
});

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const parsed = contactSchema.safeParse(data);
		if (!parsed.success) {
			return NextResponse.json(
				{ success: false, errors: parsed.error.flatten() },
				{ status: 400 }
			);
		}
		await sendContactEmail(parsed.data);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, error: error.message || "Erreur serveur" },
			{ status: 500 }
		);
	}
}
