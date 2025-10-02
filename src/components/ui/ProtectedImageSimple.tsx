"use client";

import SafeImage from "./SafeImage";

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
	onError?: () => void;
}

export default function ProtectedImageSimple(props: ProtectedImageSimpleProps) {
	return (
		<div
			className="relative"
			onContextMenu={(e) => {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}}
			onDragStart={(e) => {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}}
			onSelectStart={(e) => {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}}
			style={{
				userSelect: "none",
				MozUserSelect: "none",
				WebkitUserSelect: "none",
				WebkitTouchCallout: "none",
			}}
			data-protected="true"
		>
			<SafeImage {...props} />
		</div>
	);
}
