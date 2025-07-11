"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface Product {
	productId: string;
	name: string;
	price: number;
	originalPrice?: number;
	image: string;
	imageAlt?: string;
	slug?: string;
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

	const addToFavorites = (product: Product) => {
		setFavorites((prev) => {
			if (!prev.find((fav) => fav.productId === product.productId)) {
				return [...prev, product];
			}
			return prev;
		});
	};

	const removeFromFavorites = (productId: string) => {
		setFavorites((prev) => prev.filter((fav) => fav.productId !== productId));
	};

	const toggleFavorite = (product: Product) => {
		setFavorites((prev) => {
			const isInFavorites = prev.find(
				(fav) => fav.productId === product.productId
			);
			if (isInFavorites) {
				return prev.filter((fav) => fav.productId !== product.productId);
			} else {
				return [...prev, product];
			}
		});
	};

	const clearAllFavorites = () => {
		setFavorites([]);
	};

	return (
		<FavoritesContext.Provider
			value={{ favorites, addToFavorites, removeFromFavorites, toggleFavorite, clearAllFavorites }}
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
