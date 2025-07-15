"use client";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
	id: string;
	productId: string;
	name: string;
	price: number;
	originalPrice?: number;
	image: string;
	imageAlt?: string;
	color: string;
	colorHex: string;
	size: string;
	quantity: number;
	maxQuantity: number; // Stock maximum disponible
	slug: string;
}

interface CartContextType {
	cartItems: CartItem[];
	addToCart: (item: Omit<CartItem, "id">) => void;
	removeFromCart: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
	getCartTotal: () => number;
	getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();

	// Charger le panier depuis localStorage au démarrage (connecté ou non)
	useEffect(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			try {
				const parsedCart = JSON.parse(savedCart);
				setCartItems(parsedCart);
			} catch (error) {
				localStorage.removeItem("cart");
			}
		}
	}, []);

	// Sauvegarder automatiquement dans localStorage à chaque changement
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cartItems));
	}, [cartItems]);

	// Écouter les événements de synchronisation depuis AuthContext
	useEffect(() => {
		// Événement déclenché après connexion avec le panier de la BDD
		const handleCartSynced = (event: CustomEvent) => {
			const { cartItems: syncedItems } = event.detail;
			setCartItems(syncedItems);
		};

		// Événement déclenché lors de la déconnexion pour vider
		const handleCartCleared = () => {
			setCartItems([]);
			localStorage.removeItem("cart");
		};

		window.addEventListener("cartSynced", handleCartSynced as EventListener);
		window.addEventListener("cartCleared", handleCartCleared as EventListener);

		return () => {
			window.removeEventListener(
				"cartSynced",
				handleCartSynced as EventListener
			);
			window.removeEventListener(
				"cartCleared",
				handleCartCleared as EventListener
			);
		};
	}, []);

	// Fonction pour sauvegarder en base de données (seulement si connecté)
	const saveToDatabase = async (items: CartItem[]) => {
		if (!user) {
			return;
		}
		try {
			// Convertir au format base de données
			const dbItems = items.map((item) => ({
				productId: item.productId,
				color: item.color,
				size: item.size,
				quantity: item.quantity,
				price: item.price,
			}));
			const response = await fetch("/api/cart/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ localCartItems: dbItems }),
				credentials: "include",
			});
			if (!response.ok) {
				console.error(
					"❌ Erreur lors de la sauvegarde du panier en BDD:",
					response.status
				);
			}
		} catch (error) {
			console.error(
				"❌ Erreur lors de la sauvegarde du panier en base:",
				error
			);
		}
	};

	const addToCart = (newItem: Omit<CartItem, "id">) => {
		setCartItems((prevItems) => {
			// Vérifier si le produit existe déjà avec la même couleur et taille
			const existingItemIndex = prevItems.findIndex(
				(item) =>
					item.productId === newItem.productId &&
					item.color === newItem.color &&
					item.size === newItem.size
			);

			let updatedItems;
			if (existingItemIndex !== -1) {
				// Mettre à jour la quantité en respectant le stock maximum
				updatedItems = [...prevItems];
				const currentQuantity = updatedItems[existingItemIndex].quantity;
				const newTotalQuantity = currentQuantity + newItem.quantity;
				const maxAllowed = Math.min(newTotalQuantity, newItem.maxQuantity);

				updatedItems[existingItemIndex].quantity = maxAllowed;
			} else {
				// Ajouter un nouvel item
				const id = `${newItem.productId}-${newItem.color}-${newItem.size}`;
				updatedItems = [...prevItems, { ...newItem, id }];
			}

			// Sauvegarder en BDD si connecté
			if (user) {
				saveToDatabase(updatedItems);
			}

			return updatedItems;
		});
	};

	const removeFromCart = (id: string) => {
		setCartItems((prevItems) => {
			const updatedItems = prevItems.filter((item) => item.id !== id);

			// Sauvegarder en BDD si connecté
			if (user) {
				saveToDatabase(updatedItems);
			}

			return updatedItems;
		});
	};

	const updateQuantity = (id: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(id);
			return;
		}

		setCartItems((prevItems) => {
			const updatedItems = prevItems.map((item) => {
				if (item.id === id) {
					// Respecter la limite de stock maximum
					const maxAllowed = Math.min(quantity, item.maxQuantity);
					return { ...item, quantity: maxAllowed };
				}
				return item;
			});

			// Sauvegarder en BDD si connecté
			if (user) {
				saveToDatabase(updatedItems);
			}

			return updatedItems;
		});
	};

	const clearCart = () => {
		setCartItems([]);
		localStorage.removeItem("cart");

		// Sauvegarder en BDD si connecté
		if (user) {
			saveToDatabase([]);
		}
	};

	const getCartTotal = () => {
		return cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	};

	const getCartCount = () => {
		return cartItems.reduce((count, item) => count + item.quantity, 0);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getCartTotal,
				getCartCount,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
