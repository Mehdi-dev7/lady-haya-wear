"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthState {
	user: User | null;
	loading: boolean;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	checkAuth: () => Promise<void>;
	syncCartAndFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		loading: true,
	});

	// Écouter l'événement de connexion utilisateur
	useEffect(() => {
		const handleUserConnected = () => {
			if (authState.user) {
				syncCartAndFavorites();
			}
		};

		window.addEventListener("user-connected", handleUserConnected);
		return () =>
			window.removeEventListener("user-connected", handleUserConnected);
	}, [authState.user]);

	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/me");
			if (response.ok) {
				const data = await response.json();
				setAuthState({ user: data.user, loading: false });
				// Synchroniser le panier et les favoris après reconnexion
				setTimeout(() => syncCartAndFavorites(), 100);
			} else {
				setAuthState({ user: null, loading: false });
			}
		} catch (error) {
			setAuthState({ user: null, loading: false });
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				setAuthState({ user: data.user, loading: false });

				// Déclencher la synchronisation après la connexion
				setTimeout(() => {
					syncCartAndFavorites();
				}, 100);

				return { success: true };
			} else {
				return { success: false, error: data.error };
			}
		} catch (error) {
			return { success: false, error: "Erreur de connexion" };
		}
	};

	const logout = async () => {
		try {
			// Sauvegarder en base avant de vider (si l'utilisateur est connecté)
			if (authState.user) {
				await syncCartAndFavorites();
			}
		} catch (error) {
			console.error("Erreur lors de la sauvegarde avant déconnexion:", error);
		}

		// Supprimer le token d'authentification
		document.cookie = "auth-token=; Max-Age=0; path=/";

		// Vider le localStorage (temporairement pour sécurité)
		localStorage.removeItem("cart");
		localStorage.removeItem("favorites");

		// Réinitialiser l'état utilisateur
		setAuthState({ user: null, loading: false });

		// Émettre des événements pour vider les contextes
		window.dispatchEvent(new CustomEvent("cart-sync", { detail: [] }));
		window.dispatchEvent(new CustomEvent("favorites-sync", { detail: [] }));
	};

	const syncCartAndFavorites = async () => {
		try {
			if (!authState.user) return;

			// Récupérer les données locales
			const localCart = localStorage.getItem("cart");
			const localFavorites = localStorage.getItem("favorites");

			const localCartItems = localCart ? JSON.parse(localCart) : [];
			const localFavoritesItems = localFavorites
				? JSON.parse(localFavorites)
				: [];

			// Synchroniser le panier
			const cartResponse = await fetch("/api/cart/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ localCartItems }),
			});

			if (cartResponse.ok) {
				const { cartItems } = await cartResponse.json();
				// Déclencher un événement pour mettre à jour le contexte du panier
				window.dispatchEvent(
					new CustomEvent("cartSynced", { detail: { cartItems } })
				);
			}

			// Synchroniser les favoris
			const favoritesResponse = await fetch("/api/favorites/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ localFavorites: localFavoritesItems }),
			});

			if (favoritesResponse.ok) {
				const { favorites } = await favoritesResponse.json();
				// Déclencher un événement pour mettre à jour le contexte des favoris
				window.dispatchEvent(
					new CustomEvent("favoritesSynced", { detail: { favorites } })
				);
			}
		} catch (error) {
			console.error("Erreur lors de la synchronisation:", error);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const value = {
		user: authState.user,
		loading: authState.loading,
		login,
		logout,
		isAuthenticated: !!authState.user,
		checkAuth,
		syncCartAndFavorites,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
