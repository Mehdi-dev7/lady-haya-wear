"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ProtectedImageProps {
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

export default function ProtectedImage({
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
}: ProtectedImageProps) {
	const [imageError, setImageError] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Fonctions de protection
	const preventContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	const preventDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	const preventCopy = (e: React.ClipboardEvent) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	const preventKeyboard = (e: React.KeyboardEvent) => {
		// Bloquer F12, Ctrl+S, Ctrl+A, Ctrl+C, etc.
		if (
			e.key === "F12" ||
			(e.ctrlKey && (e.key === "s" || e.key === "S")) ||
			(e.ctrlKey && (e.key === "a" || e.key === "A")) ||
			(e.ctrlKey && (e.key === "c" || e.key === "C")) ||
			(e.ctrlKey && (e.key === "u" || e.key === "U"))
		) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	};

	// Si pas de source, afficher le fallback
	if (!src) {
		return (
			<div
				className={`relative bg-gradient-to-br from-nude-light to-rose-light-2 flex items-center justify-center ${className}`}
				onContextMenu={preventContextMenu}
				onDragStart={preventDrag}
				onCopy={preventCopy}
				tabIndex={-1}
				unselectable="on"
				style={{
					userSelect: "none",
					MozUserSelect: "none",
					WebkitUserSelect: "none",
				}}
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
				onContextMenu={preventContextMenu}
				onDragStart={preventDrag}
				onCopy={preventCopy}
				tabIndex={-1}
				unselectable="on"
				style={{
					userSelect: "none",
					MozUserSelect: "none",
					WebkitUserSelect: "none",
				}}
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
				onContextMenu={preventContextMenu}
				onDragStart={preventDrag}
				onCopy={preventCopy}
				tabIndex={-1}
				unselectable="on"
				style={{
					userSelect: "none",
					MozUserSelect: "none",
					WebkitUserSelect: "none",
				}}
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
			onContextMenu={preventContextMenu}
			onDragStart={preventDrag}
			onCopy={preventCopy}
			onKeyDown={preventKeyboard}
			tabIndex={-1}
			unselectable="on"
			style={{
				userSelect: "none",
				MozUserSelect: "none",
				WebkitUserSelect: "none",
				WebkitTouchCallout: "none",
			}}
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
				// Propriétés de protection supplémentaires
				draggable={false}
				unselectable="on"
				style={{
					userSelect: "none",
					MozUserSelect: "none",
					WebkitUserSelect: "none",
					WebkitTouchCallout: "none",
					pointerEvents: "auto",
				}}
				data-protected="true"
			/>

			{/* Overlay invisible pour bloquer les interactions malveillantes */}
			<div
				className="absolute inset-0 z-10"
				onContextMenu={preventContextMenu}
				onDragStart={preventDrag}
				onCopy={preventCopy}
				onKeyDown={preventKeyboard}
				style={{
					background: "transparent",
					pointerEvents: "none", // Permettre les liens et boutons
				}}
				unselectable="on"
			/>
		</div>
	);
}
