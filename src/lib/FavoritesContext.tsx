"use client";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useAuth } from "./AuthContext";

interface Product {
	productId: string;
	name: string;
	price: number;
	originalPrice?: number;
	image: string;
	imageAlt?: string;
	slug?: string;
	category?: {
		_id: string;
		name: string;
		slug: {
			current: string;
		};
	};
}

interface FavoritesContextType {
	favorites: Product[];
	addToFavorites: (product: Product) => void;
	removeFromFavorites: (productId: string) => void;
	toggleFavorite: (product: Product) => void;
	clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
	undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const [favorites, setFavorites] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();

	// Charger les favoris depuis localStorage au démarrage (connecté ou non)
	useEffect(() => {
		const savedFavorites = localStorage.getItem("favorites");
		if (savedFavorites) {
			try {
				const parsedFavorites = JSON.parse(savedFavorites);
				setFavorites(parsedFavorites);
			} catch (error) {
				console.error("Erreur lors du parsing des favoris:", error);
				localStorage.removeItem("favorites");
			}
		}
	}, []);

	// Sauvegarder automatiquement dans localStorage à chaque changement
	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	// Écouter les événements de synchronisation depuis AuthContext
	useEffect(() => {
		// Événement déclenché après connexion avec les favoris de la BDD
		const handleFavoritesSynced = (event: CustomEvent) => {
			const { favorites: syncedFavorites } = event.detail;
			console.log("Favoris enrichis reçus:", syncedFavorites);
			setFavorites(syncedFavorites);
		};

		// Événement déclenché lors de la déconnexion pour vider
		const handleFavoritesCleared = () => {
			setFavorites([]);
			localStorage.removeItem("favorites");
		};

		window.addEventListener(
			"favoritesSynced",
			handleFavoritesSynced as EventListener
		);

		window.addEventListener(
			"favoritesCleared",
			handleFavoritesCleared as EventListener
		);

		return () => {
			window.removeEventListener(
				"favoritesSynced",
				handleFavoritesSynced as EventListener
			);
			window.removeEventListener(
				"favoritesCleared",
				handleFavoritesCleared as EventListener
			);
		};
	}, []);

	// Fonction pour sauvegarder en base de données (seulement si connecté)
	const saveToDatabase = async (favoritesList: Product[]) => {
		if (!user) {
			console.log("🔒 Utilisateur non connecté, pas de sauvegarde en BDD");
			return;
		}
		console.log(
			"💾 Sauvegarde des favoris en BDD pour l'utilisateur:",
			user.id
		);
		try {
			const response = await fetch("/api/favorites/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ localFavorites: favoritesList }),
				credentials: "include",
			});
			if (!response.ok) {
				console.error(
					"❌ Erreur lors de la sauvegarde des favoris en BDD:",
					response.status
				);
			} else {
				console.log("✅ Favoris sauvegardés en BDD avec succès");
			}
		} catch (error) {
			console.error(
				"❌ Erreur lors de la sauvegarde des favoris en base:",
				error
			);
		}
	};

	const addToFavorites = (product: Product) => {
		setFavorites((prev) => {
			const updatedFavorites = prev.find(
				(fav) => fav.productId === product.productId
			)
				? prev
				: [...prev, product];

			// Sauvegarder en BDD si connecté
			if (user) {
				saveToDatabase(updatedFavorites);
			}

			return updatedFavorites;
		});
	};

	const removeFromFavorites = (productId: string) => {
		setFavorites((prev) => {
			const updatedFavorites = prev.filter(
				(fav) => fav.productId !== productId
			);

			// Sauvegarder en BDD si connecté
			if (user) {
				saveToDatabase(updatedFavorites);
			}

			return updatedFavorites;
		});
	};

	const toggleFavorite = (product: Product) => {
		setFavorites((prev) => {
			const exists = prev.find((fav) => fav.productId === product.productId);
			const updatedFavorites = exists
				? prev.filter((fav) => fav.productId !== product.productId)
				: [...prev, product];

			// Sauvegarder en BDD si connecté
			if (user) {
				saveToDatabase(updatedFavorites);
			}

			return updatedFavorites;
		});
	};

	const clearAllFavorites = () => {
		setFavorites([]);
		localStorage.removeItem("favorites");

		// Sauvegarder en BDD si connecté
		if (user) {
			saveToDatabase([]);
		}
	};

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				addToFavorites,
				removeFromFavorites,
				toggleFavorite,
				clearAllFavorites,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites() {
	const context = useContext(FavoritesContext);
	if (context === undefined) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
}
