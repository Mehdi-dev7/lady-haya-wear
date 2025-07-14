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

interface AuthContextType extends AuthState {
	login: (
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		loading: true,
	});

	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/me");
			if (response.ok) {
				const data = await response.json();
				setAuthState({ user: data.user, loading: false });
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

			if (response.ok) {
				const data = await response.json();
				setAuthState({ user: data.user, loading: false });
				return { success: true };
			} else {
				const error = await response.json();
				return { success: false, error: error.error };
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
			setAuthState({ user: null, loading: false });
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
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
