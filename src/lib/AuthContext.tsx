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

	const hydrateContextsFromDB = async () => {
		// Favoris
		try {
			const favRes = await fetch("/api/favorites/sync", {
				credentials: "include",
			});
			if (favRes.ok) {
				const { favorites } = await favRes.json();
				window.dispatchEvent(
					new CustomEvent("favoritesSynced", { detail: { favorites } })
				);
			}
		} catch (e) {
			// Erreur lors du fetch favoris BDD:
		}
		// Panier
		try {
			const cartRes = await fetch("/api/cart/sync", { credentials: "include" });
			if (cartRes.ok) {
				const { cartItems } = await cartRes.json();
				window.dispatchEvent(
					new CustomEvent("cartSynced", { detail: { cartItems } })
				);
			}
		} catch (e) {
			// Erreur lors du fetch panier BDD:
		}
	};

	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/me");
			if (response.ok) {
				const data = await response.json();
				setAuthState({ user: data.user, loading: false });
				// Synchroniser immédiatement après reconnexion
				setTimeout(() => syncCartAndFavorites(), 200);
				// Hydrater les contextes depuis la BDD
				setTimeout(() => hydrateContextsFromDB(), 400);
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
				}, 200);
				// Hydrater les contextes depuis la BDD
				setTimeout(() => hydrateContextsFromDB(), 400);

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
			// Supprimer le token d'authentification
			await fetch("/api/auth/logout", {
				method: "POST",
			});
		} catch (error) {
			// Erreur lors de la déconnexion:
		}

		// Supprimer le cookie d'authentification
		document.cookie = "auth-token=; Max-Age=0; path=/";

		// Réinitialiser l'état utilisateur
		setAuthState({ user: null, loading: false });

		// Déclencher les événements pour vider les contextes et localStorage
		window.dispatchEvent(new CustomEvent("cartCleared"));
		window.dispatchEvent(new CustomEvent("favoritesCleared"));
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
			try {
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
				} else {
					// Erreur lors de la synchronisation du panier:
				}
			} catch (error) {
				// Erreur lors de la synchronisation du panier:
			}

			// Synchroniser les favoris
			try {
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
				} else {
					// Erreur lors de la synchronisation des favoris:
				}
			} catch (error) {
				// Erreur lors de la synchronisation des favoris:
			}

			// Après synchronisation réussie, vider le localStorage
			// (les données sont maintenant en BDD et dans les contextes)
			localStorage.removeItem("cart");
			localStorage.removeItem("favorites");
		} catch (error) {
			// Erreur générale lors de la synchronisation:
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
