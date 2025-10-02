"use client";

import SafeImage from "./SafeImage";

// Interface identique à SafeImageProps mais héritée
interface ProtectedImageSimpleProps {
	src: string | null | undefined;
	alt: string;
	fill?: boolean;
	width?: number;
	height?: number;
	sizes?: string;
	className?: string;
	priority?: boolean;
	placeholder?: "blur" | "empty";
	blurDataURL?: string;
	fallback?: string;
}

export default function ProtectedImageSimple(props: ProtectedImageSimpleProps) {
	// Utiliser SafeImage avec protection activée
	return <SafeImage {...props} protected={true} />;
}
