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

	// Charger les favoris depuis localStorage au démarrage
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

	// Quand l'utilisateur se connecte, synchroniser avec la base
	useEffect(() => {
		if (user) {
			// Déclencher la synchronisation via l'AuthContext
			const syncData = async () => {
				try {
					// Attendre un peu pour laisser le temps à l'AuthContext de se synchroniser
					setTimeout(() => {
						window.dispatchEvent(new CustomEvent("user-connected"));
					}, 100);
				} catch (error) {
					console.error("Erreur lors de la synchronisation:", error);
				}
			};
			syncData();
		}
	}, [user]);

	// Sauvegarder automatiquement dans localStorage à chaque changement
	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	// Écouter l'événement de synchronisation depuis AuthContext
	useEffect(() => {
		const handleFavoritesSynced = (event: CustomEvent) => {
			const { favorites: syncedFavorites } = event.detail;

			// Les données sont déjà enrichies par l'API
			setFavorites(syncedFavorites);
		};

		window.addEventListener(
			"favoritesSynced",
			handleFavoritesSynced as EventListener
		);
		return () => {
			window.removeEventListener(
				"favoritesSynced",
				handleFavoritesSynced as EventListener
			);
		};
	}, []);

	// Fonction pour sauvegarder en base de données (si connecté)
	const saveToDatabase = async (favoritesList: Product[]) => {
		try {
			const response = await fetch("/api/favorites/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ localFavorites: favoritesList }),
			});

			if (!response.ok) {
				console.log("Utilisateur non connecté, sauvegarde locale uniquement");
			}
		} catch (error) {
			console.log("Erreur lors de la sauvegarde des favoris en base:", error);
		}
	};

	const addToFavorites = (product: Product) => {
		setFavorites((prev) => {
			const updatedFavorites = prev.find(
				(fav) => fav.productId === product.productId
			)
				? prev
				: [...prev, product];

			saveToDatabase(updatedFavorites);
			return updatedFavorites;
		});
	};

	const removeFromFavorites = (productId: string) => {
		setFavorites((prev) => {
			const updatedFavorites = prev.filter(
				(fav) => fav.productId !== productId
			);
			saveToDatabase(updatedFavorites);
			return updatedFavorites;
		});
	};

	const toggleFavorite = (product: Product) => {
		setFavorites((prev) => {
			const exists = prev.find((fav) => fav.productId === product.productId);
			const updatedFavorites = exists
				? prev.filter((fav) => fav.productId !== product.productId)
				: [...prev, product];

			saveToDatabase(updatedFavorites);
			return updatedFavorites;
		});
	};

	const clearAllFavorites = () => {
		setFavorites([]);
		saveToDatabase([]);
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
