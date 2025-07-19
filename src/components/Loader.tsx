import React from "react";

const Loader: React.FC<{ size?: number; fullPage?: boolean }> = ({
	size = 48,
	fullPage = true,
}) => {
	// Taille SVG fixe, responsive via CSS
	const svgSize = 72;
	const bars = 12;
	const barWidth = svgSize * 0.08;
	const barHeight = svgSize * 0.28;
	const center = svgSize / 2;
	const radius = center - barHeight / 2;
	const color = "#e89cae";

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: fullPage ? "100vh" : svgSize * 2,
				minHeight: fullPage ? "100vh" : svgSize * 2,
				background: "#f8ede4", 
				position: fullPage ? "fixed" : "static",
				top: 0,
				left: 0,
				zIndex: 1000,
			}}
		>
			<svg
				className="w-12 h-12 lg:w-20 lg:h-20"
				width={svgSize}
				height={svgSize}
				viewBox={`0 0 ${svgSize} ${svgSize}`}
				style={{
					display: "block",
					opacity: 0.85,
					animation: "spinLoader 1s linear infinite",
				}}
				xmlns="http://www.w3.org/2000/svg"
				aria-label="Chargement..."
			>
				{Array.from({ length: bars }).map((_, i) => {
					const angle = (360 / bars) * i;
					return (
						<rect
							key={i}
							x={center - barWidth / 2}
							y={center - radius - barHeight / 2}
							width={barWidth}
							height={barHeight}
							rx={barWidth / 2}
							fill={color}
							opacity={0.2 + 0.8 * (i / bars)}
							transform={`rotate(${angle} ${center} ${center})`}
						/>
					);
				})}
			</svg>
			<style>{`
				@keyframes spinLoader {
					100% { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
};

export default Loader;
