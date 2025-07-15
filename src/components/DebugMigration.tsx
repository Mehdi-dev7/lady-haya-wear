"use client";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";

export default function DebugMigration() {
	const { syncCartAndFavorites } = useAuth();
	const { cartItems } = useCart();
	const { favorites } = useFavorites();

	const handleClick = () => {
		// Merge localStorage et state React
		const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
		const localFavorites = JSON.parse(
			localStorage.getItem("favorites") || "[]"
		);
		// On merge en évitant les doublons (par productId+color+size pour le panier, par productId pour les favs)
		const mergedCart = [...localCart];
		cartItems.forEach((item) => {
			if (
				!mergedCart.some(
					(lc) =>
						lc.productId === item.productId &&
						lc.color === item.color &&
						lc.size === item.size
				)
			) {
				mergedCart.push(item);
			}
		});
		const mergedFavorites = [...localFavorites];
		favorites.forEach((fav) => {
			if (!mergedFavorites.some((lf) => lf.productId === fav.productId)) {
				mergedFavorites.push(fav);
			}
		});
		localStorage.setItem("cart", JSON.stringify(mergedCart));
		localStorage.setItem("favorites", JSON.stringify(mergedFavorites));
		localStorage.setItem("migrationDone", "true");
		syncCartAndFavorites();
	};

	return (
		<button
			onClick={handleClick}
			style={{
				padding: 8,
				background: "#eab308",
				color: "#fff",
				border: "none",
				borderRadius: 4,
				margin: 8,
			}}
		>
			Forcer migration localStorage → BDD
		</button>
	);
}
