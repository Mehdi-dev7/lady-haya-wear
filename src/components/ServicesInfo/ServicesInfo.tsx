"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
	TbCreditCard,
	TbHeadset,
	TbPackage,
	TbPackageExport,
	TbTruckDelivery,
} from "react-icons/tb";

export default function ServicesInfo() {
	return (
		<section className="bg-rose-light-2 border-t border-nude-light py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
			<div className="max-w-7xl mx-auto">
				{/* Grille des services en colonnes sur mobile, grille sur desktop */}
				<motion.div
					className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative"
					initial={{ y: 30, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					viewport={{ once: true, amount: 0.1 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
				>
					{/* Livraison gratuite */}
					<div className="flex items-center gap-3 p-3 relative border-r border-nude-dark lg:border-r-0">
						<TbTruckDelivery className="w-5 h-5 text-green-500 flex-shrink-0" />
						<div>
							<div className="font-medium text-sm text-nude-dark">
								Livraison gratuite
							</div>
							<div className="text-xs text-gray-500">Dès 69€</div>
						</div>
						{/* Trait de séparation à droite - visible à partir de md */}
						<div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-nude-dark hidden md:block"></div>
					</div>

					<Link
						href="/services/paiement-securise"
						className="flex items-center gap-3 p-3 relative hover:bg-rose-light/50 transition-colors"
					>
						<TbCreditCard className="w-5 h-5 text-blue-500 flex-shrink-0" />
						<div>
							<div className="font-medium text-sm text-nude-dark">
								Paiement sécurisé
							</div>
							<div className="text-xs text-gray-500">CB, PayPal</div>
						</div>
						{/* Trait de séparation à droite - visible à partir de md */}
						<div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-nude-dark hidden md:block"></div>
					</Link>

					{/* Satisfait ou remboursé */}
					<Link
						href="/services/retours"
						className="flex items-center gap-3 p-3 relative border-r border-nude-dark lg:border-r-0 hover:bg-rose-light/50 transition-colors"
					>
						<TbPackage className="w-5 h-5 text-orange-500 flex-shrink-0" />
						<div>
							<div className="font-medium text-sm text-nude-dark">
								Retours possibles
							</div>
							<div className="text-xs text-gray-500">sous 15 jours</div>
						</div>
						{/* Trait de séparation à droite - visible à partir de md */}
						<div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-nude-dark hidden md:block"></div>
					</Link>

					<Link
						href="/services/service-client"
						className="flex items-center gap-3 p-3 relative hover:bg-rose-light/50 transition-colors"
					>
						<TbHeadset className="w-5 h-5 text-purple-500 flex-shrink-0" />
						<div>
							<div className="font-medium text-sm text-nude-dark">
								Service client
							</div>
							<div className="text-xs text-gray-500">Support 7j/7</div>
						</div>
						{/* Trait de séparation à droite - visible à partir de md */}
						<div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-nude-dark hidden md:block"></div>
					</Link>

					<Link
						href="/services/envoi-rapide"
						className="flex items-center gap-3 p-3 hover:bg-rose-light/50 transition-colors"
					>
						<TbPackageExport className="w-5 h-5 text-red-500 flex-shrink-0" />
						<div>
							<div className="font-medium text-sm text-nude-dark">
								Envoi rapide
							</div>
							<div className="text-xs text-gray-500">24-48h</div>
						</div>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
