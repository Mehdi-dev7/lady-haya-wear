"use client";

import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { useState } from "react";

export default function ClearFavorites() {
	const { favorites, clearAllFavorites } = useFavorites();
	const { cartItems, clearCart, getCartCount } = useCart();
	const { user, syncCartAndFavorites } = useAuth();
	const [isClearing, setIsClearing] = useState(false);

	const handleClearFavorites = async () => {
		setIsClearing(true);
		clearAllFavorites();
		setTimeout(() => {
			setIsClearing(false);
		}, 1000);
	};

	const handleClearCart = async () => {
		setIsClearing(true);
		clearCart();
		setTimeout(() => {
			setIsClearing(false);
		}, 1000);
	};

	const handleClearAll = async () => {
		setIsClearing(true);
		clearAllFavorites();
		clearCart();
		setTimeout(() => {
			setIsClearing(false);
		}, 1000);
	};

	const handleForceSync = async () => {
		if (!user) {
			alert("Vous devez être connecté pour synchroniser");
			return;
		}

		setIsClearing(true);
		console.log("🔄 Synchronisation forcée démarrée...");

		try {
			await syncCartAndFavorites();
			console.log("✅ Synchronisation forcée terminée");
		} catch (error) {
			console.error("❌ Erreur lors de la synchronisation forcée:", error);
		}

		setTimeout(() => {
			setIsClearing(false);
		}, 2000);
	};

	return (
		<div className="border p-4 rounded-lg bg-blue-50">
			<h3 className="text-xl font-semibold mb-4 text-blue-800">
				Debug - Panier et Favoris
			</h3>

			<div className="space-y-2 text-sm mb-4">
				<p>
					<strong>Utilisateur connecté:</strong>{" "}
					{user ? `${user.name} (${user.email})` : "❌ Non connecté"}
				</p>
				<p>
					<strong>Nombre de favoris:</strong> {favorites.length}
				</p>
				<p>
					<strong>Nombre d'articles panier:</strong> {getCartCount()}
				</p>
				<p>
					<strong>Favoris dans localStorage:</strong>{" "}
					{typeof window !== "undefined" && localStorage.getItem("favorites")
						? "✅ Oui"
						: "❌ Non"}
				</p>
				<p>
					<strong>Panier dans localStorage:</strong>{" "}
					{typeof window !== "undefined" && localStorage.getItem("cart")
						? "✅ Oui"
						: "❌ Non"}
				</p>
			</div>

			<div className="bg-white p-3 rounded border mb-4">
				<h4 className="font-semibold mb-2 text-green-700">
					Comportement attendu:
				</h4>
				<ul className="text-sm space-y-1 text-gray-700">
					<li>
						• <strong>Non connecté:</strong> Données stockées en localStorage
					</li>
					<li>
						• <strong>Connexion:</strong> Migration localStorage → BDD + vidage
						localStorage
					</li>
					<li>
						• <strong>Connecté:</strong> Sauvegarde automatique en BDD
					</li>
					<li>
						• <strong>Déconnexion:</strong> Vidage des contextes et localStorage
					</li>
					<li>
						• <strong>Reconnexion:</strong> Récupération depuis BDD
					</li>
				</ul>
			</div>

			{favorites.length > 0 && (
				<div className="mb-4">
					<h4 className="font-semibold mb-2">Favoris actuels:</h4>
					<ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
						{favorites.map((fav, index) => (
							<li key={fav.productId} className="ml-4">
								{index + 1}. {fav.name} - {fav.price}€
							</li>
						))}
					</ul>
				</div>
			)}

			{cartItems.length > 0 && (
				<div className="mb-4">
					<h4 className="font-semibold mb-2">Panier actuel:</h4>
					<ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
						{cartItems.map((item, index) => (
							<li key={item.id} className="ml-4">
								{index + 1}. {item.name} - {item.color} - {item.size} - Qté:{" "}
								{item.quantity}
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="flex gap-2 flex-wrap">
				<button
					onClick={handleClearFavorites}
					disabled={isClearing}
					className={`px-4 py-2 rounded text-white font-medium ${
						isClearing
							? "bg-gray-400 cursor-not-allowed"
							: "bg-red-600 hover:bg-red-700"
					}`}
				>
					{isClearing ? "..." : "Vider favoris"}
				</button>

				<button
					onClick={handleClearCart}
					disabled={isClearing}
					className={`px-4 py-2 rounded text-white font-medium ${
						isClearing
							? "bg-gray-400 cursor-not-allowed"
							: "bg-orange-600 hover:bg-orange-700"
					}`}
				>
					{isClearing ? "..." : "Vider panier"}
				</button>

				<button
					onClick={handleClearAll}
					disabled={isClearing}
					className={`px-4 py-2 rounded text-white font-medium ${
						isClearing
							? "bg-gray-400 cursor-not-allowed"
							: "bg-purple-600 hover:bg-purple-700"
					}`}
				>
					{isClearing ? "..." : "Tout vider"}
				</button>

				{user && (
					<button
						onClick={handleForceSync}
						disabled={isClearing}
						className={`px-4 py-2 rounded text-white font-medium ${
							isClearing
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700"
						}`}
					>
						{isClearing ? "..." : "Forcer sync"}
					</button>
				)}
			</div>

			{favorites.length === 0 && cartItems.length === 0 && (
				<p className="text-green-600 mt-2">
					✅ Aucun favori ni article dans le panier
				</p>
			)}

			<div className="mt-4 p-3 bg-gray-100 rounded text-sm">
				<p className="font-semibold mb-1">Instructions de test:</p>
				<ol className="space-y-1 text-gray-700">
					<li>1. Déconnectez-vous et ajoutez des favoris/panier</li>
					<li>2. Connectez-vous (migration automatique)</li>
					<li>3. Vérifiez que les données sont en BDD</li>
					<li>4. Déconnectez-vous (vidage des contextes)</li>
					<li>5. Reconnectez-vous et cliquez "Forcer sync" si nécessaire</li>
				</ol>
			</div>
		</div>
	);
}
