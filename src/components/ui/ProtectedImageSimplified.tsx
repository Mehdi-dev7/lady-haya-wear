"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ProtectedImageSimplifiedProps {
	src: string | null | undefined;
	alt: string;
	fill?: boolean;
	width?: number;
	height?: number;
	sizes?: string;
	className?: string;
	priority?: boolean;
	placeholder?: string;
	blurDataURL?: string;
	fallback?: string;
	onError?: () => void;
}

export default function ProtectedImageSimplified({
	src,
	alt,
	fill = false,
	width,
	height,
	sizes,
	className = "",
	priority = false,
	placeholder = "empty",
	blurDataURL,
	fallback = "/assets/placeholder.jpg",
	onError,
}: ProtectedImageSimplifiedProps) {
	const [imageError, setImageError] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Si pas de source, afficher le fallback
	if (!src) {
		return (
			<div
				className={`relative bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center ${className}`}
			>
				{fill ? (
					<>
						<span className="text-4xl">🛍️</span>
						<div className="absolute inset-0 bg-black/10 rounded-2xl" />
					</>
				) : (
					<span className="text-2xl">🛍️</span>
				)}
			</div>
		);
	}

	// Pendant l'hydratation, afficher le fallback
	if (!isMounted) {
		return (
			<div
				className={`relative bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center ${className}`}
			>
				{fill ? (
					<>
						<span className="text-4xl">🛍️</span>
						<div className="absolute inset-0 bg-black/10 rounded-2xl" />
					</>
				) : (
					<span className="text-2xl">🛍️</span>
				)}
			</div>
		);
	}

	// Si erreur après le montage, afficher le fallback
	if (imageError) {
		return (
			<div
				className={`relative bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center ${className}`}
			>
				{fill ? (
					<>
						<span className="text-4xl">🛍️</span>
						<div className="absolute inset-0 bg-black/10 rounded-2xl" />
					</>
				) : (
					<span className="text-2xl">🛍️</span>
				)}
			</div>
		);
	}

	return (
		<div
			className={fill ? `relative ${className}` : className}
			onContextMenu={(e) => e.preventDefault()}
			onDragStart={(e) => e.preventDefault()}
			style={{
				userSelect: "none",
				MozUserSelect: "none",
				WebkitUserSelect: "none",
			}}
			data-protected="true"
		>
			<Image
				src={src}
				alt={alt}
				fill={fill}
				width={!fill ? width : undefined}
				height={!fill ? height : undefined}
				sizes={sizes}
				className={className}
				priority={priority}
				placeholder={placeholder}
				blurDataURL={blurDataURL}
				onError={() => {
					setImageError(true);
					onError?.();
				}}
				unoptimized={false}
				quality={90}
				draggable={false}
				unselectable="on"
				style={{
					userSelect: "none",
					MozUserSelect: "none",
					WebkitUserSelect: "none",
				}}
			/>
		</div>
	);
}
