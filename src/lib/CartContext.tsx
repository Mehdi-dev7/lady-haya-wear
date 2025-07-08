"use client";
import { createContext, ReactNode, useContext, useState } from "react";

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

	const addToCart = (newItem: Omit<CartItem, "id">) => {
		setCartItems((prevItems) => {
			// Vérifier si le produit existe déjà avec la même couleur et taille
			const existingItemIndex = prevItems.findIndex(
				(item) =>
					item.productId === newItem.productId &&
					item.color === newItem.color &&
					item.size === newItem.size
			);

			if (existingItemIndex !== -1) {
				// Mettre à jour la quantité en respectant le stock maximum
				const updatedItems = [...prevItems];
				const currentQuantity = updatedItems[existingItemIndex].quantity;
				const newTotalQuantity = currentQuantity + newItem.quantity;
				const maxAllowed = Math.min(newTotalQuantity, newItem.maxQuantity);

				updatedItems[existingItemIndex].quantity = maxAllowed;
				return updatedItems;
			} else {
				// Ajouter un nouvel item
				const id = `${newItem.productId}-${newItem.color}-${newItem.size}`;
				return [...prevItems, { ...newItem, id }];
			}
		});
	};

	const removeFromCart = (id: string) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	const updateQuantity = (id: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(id);
			return;
		}

		setCartItems((prevItems) =>
			prevItems.map((item) => {
				if (item.id === id) {
					// Respecter la limite de stock maximum
					const maxAllowed = Math.min(quantity, item.maxQuantity);
					return { ...item, quantity: maxAllowed };
				}
				return item;
			})
		);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const getCartTotal = () => {
		return cartItems.reduce((total, item) => {
			const price =
				item.originalPrice && item.originalPrice < item.price
					? item.originalPrice
					: item.price;
			return total + price * item.quantity;
		}, 0);
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
