"use client";

import { ProductBadges as ProductBadgesType } from "@/lib/sanity";

interface ProductBadgesProps {
	badges?: ProductBadgesType;
	isNew?: boolean;
	className?: string;
}

export default function ProductBadges({
	badges,
	isNew,
	className = "",
}: ProductBadgesProps) {
	return (
		<div
			className={`absolute top-2 left-2 flex flex-col gap-1 z-20 ${className}`}
		>
			{/* Badge Nouveau - style fiche détaillée */}
			{isNew && (
				<span className="bg-red-400 text-white px-3 py-1 rounded-full text-xs font-medium">
					Nouveau
				</span>
			)}

			{/* Badge Promo - style fiche détaillée */}
			{badges?.isPromo && (
				<span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
					{badges.promoType === "percentage" && badges.promoPercentage ? (
						<>Promo -{badges.promoPercentage}%</>
					) : (
						<>Promo</>
					)}
				</span>
			)}
		</div>
	);
}
