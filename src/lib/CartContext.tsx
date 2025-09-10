"use client";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "react-toastify";

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
	maxQuantity: number;
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

	// Charger le panier depuis localStorage au démarrage
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
		const handleCartSynced = (event: CustomEvent) => {
			const { cartItems: syncedItems } = event.detail;
			if (
				localStorage.getItem("migrationDone") === "true" ||
				syncedItems.length > 0
			) {
				setCartItems(syncedItems);
				if (localStorage.getItem("migrationDone") === "true") {
					localStorage.removeItem("cart");
					localStorage.removeItem("migrationDone");
				}
			}
		};

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

	// La sauvegarde en BDD est maintenant gérée par AuthProvider via les événements

	const addToCart = (newItem: Omit<CartItem, "id">) => {
		setCartItems((prevItems) => {
			const existingItemIndex = prevItems.findIndex(
				(item) =>
					item.productId === newItem.productId &&
					item.color === newItem.color &&
					item.size === newItem.size
			);

			let updatedItems;
			if (existingItemIndex !== -1) {
				updatedItems = [...prevItems];
				const currentQuantity = updatedItems[existingItemIndex].quantity;
				const newTotalQuantity = currentQuantity + newItem.quantity;
				const maxAllowed = Math.min(newTotalQuantity, newItem.maxQuantity);

				updatedItems[existingItemIndex].quantity = maxAllowed;
			} else {
				const id = `${newItem.productId}-${newItem.color}-${newItem.size}`;
				updatedItems = [...prevItems, { ...newItem, id }];
			}

			return updatedItems;
		});
	};

	const removeFromCart = (id: string) => {
		setCartItems((prevItems) => {
			const itemToRemove = prevItems.find((item) => item.id === id);
			const updatedItems = prevItems.filter((item) => item.id !== id);

			// Afficher le toast de suppression
			if (itemToRemove) {
				toast.info(
					<div>
						<div className="font-semibold">Produit supprimé du panier</div>
						<div className="text-sm opacity-90">
							{itemToRemove.name} - {itemToRemove.color} - Taille{" "}
							{itemToRemove.size}
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
					const maxAllowed = Math.min(quantity, item.maxQuantity);
					return { ...item, quantity: maxAllowed };
				}
				return item;
			});

			return updatedItems;
		});
	};

	const clearCart = () => {
		setCartItems([]);
		localStorage.removeItem("cart");
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
