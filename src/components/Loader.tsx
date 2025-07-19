import React from "react";

const Loader: React.FC<{ size?: number; fullPage?: boolean }> = ({
	size = 48,
	fullPage = true,
}) => {
	const bars = 12;
	const barWidth = size * 0.08;
	const barHeight = size * 0.28;
	const center = size / 2;
	const radius = center - barHeight / 2;
	const color = "#f9c5d1"; // rose clair

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: fullPage ? "100vh" : size * 2,
				minHeight: fullPage ? "100vh" : size * 2,
				background: "rgba(141, 103, 72, 0.95)", // nude foncé opaque
				position: fullPage ? "fixed" : "static",
				top: 0,
				left: 0,
				zIndex: 1000,
			}}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				style={{
					display: "block",
					opacity: 0.85,
					animation: "fadeLoader 1.2s ease-in-out infinite alternate",
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
				<animateTransform
					attributeName="transform"
					type="rotate"
					from={`0 ${center} ${center}`}
					to={`360 ${center} ${center}`}
					dur="1s"
					repeatCount="indefinite"
				/>
			</svg>
			<style>{`
				@keyframes fadeLoader {
					0% { opacity: 0.6; }
					100% { opacity: 1; }
				}
			`}</style>
		</div>
	);
};

export default Loader;
