import React from "react";

const Loader: React.FC<{ size?: number; fullPage?: boolean }> = ({
	size = 48,
	fullPage = true,
}) => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
			height: fullPage ? "100vh" : size * 2,
			minHeight: fullPage ? "100vh" : size * 2,
			background: "#fff",
			position: fullPage ? "fixed" : "static",
			top: 0,
			left: 0,
			zIndex: 1000,
		}}
	>
		<svg
			width={size}
			height={size}
			viewBox="0 0 50 50"
			style={{ display: "block" }}
			xmlns="http://www.w3.org/2000/svg"
			aria-label="Chargement..."
		>
			<circle
				cx="25"
				cy="25"
				r="20"
				fill="none"
				stroke="#bfa16a"
				strokeWidth="5"
				strokeDasharray="90 150"
				strokeLinecap="round"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					from="0 25 25"
					to="360 25 25"
					dur="1s"
					repeatCount="indefinite"
				/>
			</circle>
		</svg>
	</div>
);

export default Loader;
