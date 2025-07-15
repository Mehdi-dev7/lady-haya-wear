"use client";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

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

	// Charger les favoris depuis localStorage au démarrage
	useEffect(() => {
		const savedFavorites = localStorage.getItem("favorites");
		if (savedFavorites) {
			try {
				const parsedFavorites = JSON.parse(savedFavorites);
				setFavorites(parsedFavorites);
			} catch (error) {
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
		const handleFavoritesSynced = (event: CustomEvent) => {
			const { favorites: syncedFavorites } = event.detail;
			if (
				localStorage.getItem("migrationDone") === "true" ||
				syncedFavorites.length > 0
			) {
				setFavorites(syncedFavorites);
				if (localStorage.getItem("migrationDone") === "true") {
					localStorage.removeItem("favorites");
					localStorage.removeItem("migrationDone");
				}
			}
		};

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

	// La sauvegarde en BDD est maintenant gérée par AuthProvider via les événements

	const addToFavorites = (product: Product) => {
		setFavorites((prev) => {
			const updatedFavorites = prev.find(
				(fav) => fav.productId === product.productId
			)
				? prev
				: [...prev, product];

			return updatedFavorites;
		});
	};

	const removeFromFavorites = (productId: string) => {
		setFavorites((prev) => {
			const updatedFavorites = prev.filter(
				(fav) => fav.productId !== productId
			);

			return updatedFavorites;
		});
	};

	const toggleFavorite = (product: Product) => {
		setFavorites((prev) => {
			const exists = prev.find((fav) => fav.productId === product.productId);
			const updatedFavorites = exists
				? prev.filter((fav) => fav.productId !== product.productId)
				: [...prev, product];

			return updatedFavorites;
		});
	};

	const clearAllFavorites = () => {
		setFavorites([]);
		localStorage.removeItem("favorites");
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
