"use client";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "react-toastify";
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
		// Vérifier si le favori existe déjà avant la mise à jour
		const existingFavorite = favorites.find(
			(fav) => fav.productId === product.productId
		);

		if (existingFavorite) {
			// Le favori existe déjà
			toast.info(
				<div>
					<div className="font-semibold">Favori déjà ajouté</div>
					<div className="text-sm opacity-90">
						{product.name} est déjà dans vos favoris
					</div>
				</div>,
				{
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
			return; // Ne pas modifier la liste
		}

		setFavorites((prev) => {
			const updatedFavorites = [...prev, product];
			return updatedFavorites;
		});

		// Synchroniser avec la base de données si l'utilisateur est connecté
		if (user) {
			fetch("/api/favorites/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ localFavorites: [...favorites, product] }),
			}).catch((error) => {
				console.error("Erreur lors de la synchronisation des favoris:", error);
			});
		}

		// Toast de confirmation d'ajout (en dehors du setState)
		toast.success(
			<div>
				<div className="font-semibold">Favori ajouté</div>
				<div className="text-sm opacity-90">
					{product.name} a été ajouté à vos favoris
				</div>
			</div>,
			{
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			}
		);
	};

	const removeFromFavorites = (productId: string) => {
		// Trouver l'élément à supprimer avant la mise à jour
		const itemToRemove = favorites.find((fav) => fav.productId === productId);

		setFavorites((prev) => {
			const updatedFavorites = prev.filter(
				(fav) => fav.productId !== productId
			);
			return updatedFavorites;
		});

		// Synchroniser avec la base de données si l'utilisateur est connecté
		if (user) {
			fetch("/api/favorites/remove", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ productId }),
			}).catch((error) => {
				console.error("Erreur lors de la suppression des favoris:", error);
			});
		}

		// Toast de confirmation de suppression (en dehors du setState)
		if (itemToRemove) {
			toast.info(
				<div>
					<div className="font-semibold">Favori supprimé</div>
					<div className="text-sm opacity-90">
						{itemToRemove.name} a été retiré de vos favoris
					</div>
				</div>,
				{
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
		}
	};

	const toggleFavorite = (product: Product) => {
		setFavorites((prev) => {
			const exists = prev.find((fav) => fav.productId === product.productId);
			const updatedFavorites = exists
				? prev.filter((fav) => fav.productId !== product.productId)
				: [...prev, product];

			// Synchroniser avec la base de données si l'utilisateur est connecté
			if (user) {
				if (exists) {
					// Supprimer
					fetch("/api/favorites/remove", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ productId: product.productId }),
					}).catch((error) => {
						console.error("Erreur lors de la suppression des favoris:", error);
					});
				} else {
					// Ajouter
					fetch("/api/favorites/sync", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ localFavorites: updatedFavorites }),
					}).catch((error) => {
						console.error(
							"Erreur lors de la synchronisation des favoris:",
							error
						);
					});
				}
			}

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
