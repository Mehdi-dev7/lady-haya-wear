"use client";

// Note: useCart et useFavorites sont maintenant gérés séparément
// pour éviter les dépendances circulaires
import { createContext, useContext, useEffect, useState } from "react";

interface User {
	id: string;
	email: string;
	name: string;
	profile?: {
		firstName?: string;
		lastName?: string;
	};
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
	// Note: useCart et useFavorites sont maintenant gérés séparément
	// pour éviter les dépendances circulaires

	const hydrateContextsFromDB = async () => {
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
			// Silently handle favorites sync error
		}

		try {
			const cartRes = await fetch("/api/cart/sync", { credentials: "include" });
			if (cartRes.ok) {
				const { cartItems } = await cartRes.json();
				window.dispatchEvent(
					new CustomEvent("cartSynced", { detail: { cartItems } })
				);
			}
		} catch (e) {
			// Silently handle cart sync error
		}
	};

	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/me");
			if (response.ok) {
				const data = await response.json();
				setAuthState({ user: data.user, loading: false });
				setTimeout(() => syncCartAndFavorites(), 200);
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

				setTimeout(() => {
					syncCartAndFavorites();
				}, 200);
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
			await fetch("/api/auth/logout", {
				method: "POST",
			});
		} catch (error) {
			// Silently handle logout error
		}

		document.cookie = "auth-token=; Max-Age=0; path=/";
		setAuthState({ user: null, loading: false });

		window.dispatchEvent(new CustomEvent("cartCleared"));
		window.dispatchEvent(new CustomEvent("favoritesCleared"));
	};

	const syncCartAndFavorites = async () => {
		try {
			if (!authState.user) return;

			const localCart = localStorage.getItem("cart");
			const localFavorites = localStorage.getItem("favorites");

			const localCartItems = localCart ? JSON.parse(localCart) : [];
			const localFavoritesItems = localFavorites
				? JSON.parse(localFavorites)
				: [];

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
					window.dispatchEvent(
						new CustomEvent("cartSynced", { detail: { cartItems } })
					);
				}
			} catch (error) {
				// Silently handle cart sync error
			}

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
					window.dispatchEvent(
						new CustomEvent("favoritesSynced", { detail: { favorites } })
					);
				}
			} catch (error) {
				// Silently handle favorites sync error
			}

			localStorage.removeItem("cart");
			localStorage.removeItem("favorites");
		} catch (error) {
			// Silently handle general sync error
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	// Migration automatique à la connexion
	useEffect(() => {
		if (authState.user) {
			const localCart = localStorage.getItem("cart");
			const localFavorites = localStorage.getItem("favorites");

			if (localCart || localFavorites) {
				const hasLocalData =
					(localCart && JSON.parse(localCart).length > 0) ||
					(localFavorites && JSON.parse(localFavorites).length > 0);

				if (hasLocalData) {
					setTimeout(() => {
						syncCartAndFavorites();
					}, 500);
				}
			}
		}
	}, [authState.user]);

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
