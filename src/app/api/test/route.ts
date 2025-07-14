import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	return NextResponse.json({ message: "API route fonctionne", method: "GET" });
}

export async function POST(request: NextRequest) {
	return NextResponse.json({ message: "API route fonctionne", method: "POST" });
}
