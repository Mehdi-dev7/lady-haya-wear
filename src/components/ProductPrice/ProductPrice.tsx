"use client";

import { ProductBadges } from "@/lib/sanity";

interface ProductPriceProps {
	price?: number;
	originalPrice?: number;
	badges?: ProductBadges;
	className?: string;
	size?: "small" | "large"; // Taille pour cartes ou fiches détaillées
}

export default function ProductPrice({
	price,
	originalPrice,
	badges,
	className = "",
	size = "small",
}: ProductPriceProps) {
	// Calculer le prix à afficher selon le type de promotion
	const getDisplayPrices = () => {
		if (!badges?.isPromo) {
			// Pas de promo : afficher prix normal et original s'il existe
			return {
				currentPrice: price,
				crossedPrice:
					originalPrice && originalPrice > (price || 0)
						? originalPrice
						: undefined,
			};
		}

		if (badges.promoType === "percentage" && badges.promoPercentage && price) {
			// Promo pourcentage : calculer le prix réduit
			const discountedPrice = price * (1 - badges.promoPercentage / 100);
			return {
				currentPrice: discountedPrice,
				crossedPrice: price,
			};
		}

		if (badges.promoType === "originalPrice" && badges.originalPrice) {
			// Promo prix barré : afficher prix actuel et prix original barré
			return {
				currentPrice: price,
				crossedPrice: badges.originalPrice,
			};
		}

		// Fallback
		return {
			currentPrice: price,
			crossedPrice: originalPrice,
		};
	};

	const { currentPrice, crossedPrice } = getDisplayPrices();

	// Classes CSS selon la taille
	const crossedPriceClass =
		size === "large"
			? "text-xl text-gray-400 line-through"
			: "text-sm text-gray-400 line-through";
	const currentPriceClass =
		size === "large"
			? "text-2xl font-semibold text-logo"
			: "text-lg font-semibold text-logo";
	const gapClass = size === "large" ? "gap-4" : "gap-2";

	return (
		<div className={`flex items-center ${gapClass} ${className}`}>
			{/* Prix barré (prix original) */}
			{crossedPrice && (
				<span className={crossedPriceClass}>{crossedPrice.toFixed(2)} €</span>
			)}

			{/* Prix actuel */}
			<div className={currentPriceClass}>
				{currentPrice ? `${currentPrice.toFixed(2)} €` : "Prix sur demande"}
			</div>
		</div>
	);
}
