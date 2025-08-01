"use client";

import { useState } from "react";

export default function FacebookLoginButton() {
	const [isLoading, setIsLoading] = useState(false);

	const handleFacebookLogin = async () => {
		setIsLoading(true);
		try {
			// Rediriger vers notre route d'authentification Facebook
			window.location.href = "/api/auth/facebook";
		} catch (error) {
			console.error("Erreur lors de la connexion Facebook:", error);
			setIsLoading(false);
		}
	};

	return (
		<button
			type="button"
			onClick={handleFacebookLogin}
			disabled={isLoading}
			className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-light-2 hover:text-logo hover:border-rose-light-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
		>
			{isLoading ? (
				<div className="w-5 h-5 border-2 border-rose-medium border-t-transparent rounded-full animate-spin"></div>
			) : (
				<svg
					className="w-5 h-5"
					fill="#1877F2"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
						clipRule="evenodd"
					/>
				</svg>
			)}
		</button>
	);
}
