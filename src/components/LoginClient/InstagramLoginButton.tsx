"use client";

import { useState } from "react";

export default function InstagramLoginButton() {
	const [isLoading, setIsLoading] = useState(false);

	const handleInstagramLogin = async () => {
		setIsLoading(true);
		try {
			// Rediriger vers notre route d'authentification Facebook avec permission Instagram
			window.location.href = "/api/auth/facebook";
		} catch (error) {
			console.error("Erreur lors de la connexion Instagram:", error);
			setIsLoading(false);
		}
	};

	return (
		<button
			type="button"
			onClick={handleInstagramLogin}
			disabled={isLoading}
			className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-light-2 hover:text-logo hover:border-rose-light-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
		>
			{isLoading ? (
				<div className="w-5 h-5 border-2 border-rose-medium border-t-transparent rounded-full animate-spin"></div>
			) : (
				<svg
					className="w-5 h-5"
					fill="url(#instagram-gradient)"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<defs>
						<linearGradient
							id="instagram-gradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#405DE6" />
							<stop offset="25%" stopColor="#5851DB" />
							<stop offset="50%" stopColor="#833AB4" />
							<stop offset="75%" stopColor="#C13584" />
							<stop offset="100%" stopColor="#E1306C" />
						</linearGradient>
					</defs>
					<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
				</svg>
			)}
		</button>
	);
}
