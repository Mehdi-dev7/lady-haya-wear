"use client";

import { useEffect, useState } from "react";

interface CSRFProtectionProps {
	children: React.ReactNode;
}

export function CSRFProtection({ children }: CSRFProtectionProps) {
	const [csrfToken, setCsrfToken] = useState<string>("");

	useEffect(() => {
		// Générer un token CSRF côté client
		const generateToken = () => {
			const token =
				Math.random().toString(36).substring(2, 15) +
				Math.random().toString(36).substring(2, 15);
			setCsrfToken(token);

			// Stocker le token dans sessionStorage
			sessionStorage.setItem("csrf-token", token);
		};

		generateToken();
	}, []);

	// Ajouter le token aux headers de toutes les requêtes fetch
	useEffect(() => {
		if (!csrfToken) return;

		const originalFetch = window.fetch;

		window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
			const newInit = { ...init };

			// Ajouter le header CSRF pour les requêtes POST/PUT/DELETE
			if (
				init?.method &&
				["POST", "PUT", "DELETE", "PATCH"].includes(init.method.toUpperCase())
			) {
				newInit.headers = {
					...init.headers,
					"x-csrf-token": csrfToken,
				};
			}

			return originalFetch(input, newInit);
		};

		// Cleanup
		return () => {
			window.fetch = originalFetch;
		};
	}, [csrfToken]);

	return <>{children}</>;
}

// Hook pour utiliser le token CSRF
export function useCSRFToken() {
	const [token, setToken] = useState<string>("");

	useEffect(() => {
		const storedToken = sessionStorage.getItem("csrf-token");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	return token;
}

// Fonction utilitaire pour ajouter le token CSRF aux headers
export function addCSRFHeader(headers: HeadersInit = {}): HeadersInit {
	const token = sessionStorage.getItem("csrf-token");

	return {
		...headers,
		"x-csrf-token": token || "",
	};
}
