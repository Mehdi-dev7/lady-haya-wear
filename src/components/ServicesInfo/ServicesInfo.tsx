"use client";

import {
	TbCreditCard,
	TbHeadset,
	TbPackage,
	TbPackageExport,
	TbTruckDelivery,
} from "react-icons/tb";

export default function ServicesInfo() {
	return (
		<section className="bg-white py-16 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
			<div className="max-w-7xl mx-auto">
				{/* Titre de la section */}
				<div className="text-center mb-12">
					<h2 className="text-5xl md:text-6xl font-alex-brush text-logo mb-4">
						Nos Services
					</h2>
					<p className="text-lg text-nude-dark-2 max-w-2xl mx-auto">
						Nous nous engageons à vous offrir la meilleure expérience d'achat
						possible
					</p>
				</div>

				{/* Grille des services */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
					{/* Livraison gratuite */}
					<div className="flex flex-col items-center text-center p-6 bg-rose-light-2 rounded-2xl shadow-sm border border-nude-light hover:shadow-md transition-all duration-300 group">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
							<TbTruckDelivery className="w-8 h-8 text-green-600" />
						</div>
						<h3 className="font-semibold text-lg text-nude-dark mb-2">
							Livraison gratuite
						</h3>
						<p className="text-sm text-gray-600 mb-2">Dès 60€ d'achat</p>
						<p className="text-xs text-gray-500">Livraison standard offerte</p>
					</div>

					{/* Paiement sécurisé */}
					<div className="flex flex-col items-center text-center p-6 bg-rose-light-2 rounded-2xl shadow-sm border border-nude-light hover:shadow-md transition-all duration-300 group">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
							<TbCreditCard className="w-8 h-8 text-blue-600" />
						</div>
						<h3 className="font-semibold text-lg text-nude-dark mb-2">
							Paiement sécurisé
						</h3>
						<p className="text-sm text-gray-600 mb-2">CB, PayPal, Apple Pay</p>
						<p className="text-xs text-gray-500">
							Transactions 100% sécurisées
						</p>
					</div>

					{/* Satisfait ou remboursé */}
					<div className="flex flex-col items-center text-center p-6 bg-rose-light-2 rounded-2xl shadow-sm border border-nude-light hover:shadow-md transition-all duration-300 group">
						<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
							<TbPackage className="w-8 h-8 text-orange-600" />
						</div>
						<h3 className="font-semibold text-lg text-nude-dark mb-2">
							Satisfait ou remboursé
						</h3>
						<p className="text-sm text-gray-600 mb-2">
							30 jours pour changer d'avis
						</p>
						
					</div>

					{/* Service client */}
					<div className="flex flex-col items-center text-center p-6 bg-rose-light-2 rounded-2xl shadow-sm border border-nude-light hover:shadow-md transition-all duration-300 group">
						<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
							<TbHeadset className="w-8 h-8 text-purple-600" />
						</div>
						<h3 className="font-semibold text-lg text-nude-dark mb-2">
							Service client
						</h3>
						<p className="text-sm text-gray-600 mb-2">Support 7j/7</p>
						<p className="text-xs text-gray-500">Réponse sous 24h</p>
					</div>

					{/* Envoi rapide */}
					<div className="flex flex-col items-center text-center p-6 bg-rose-light-2 rounded-2xl shadow-sm border border-nude-light hover:shadow-md transition-all duration-300 group">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
							<TbPackageExport className="w-8 h-8 text-red-600" />
						</div>
						<h3 className="font-semibold text-lg text-nude-dark mb-2">
							Envoi rapide
						</h3>
						<p className="text-sm text-gray-600 mb-2">Livraison en 24-48h</p>
						<p className="text-xs text-gray-500">Expédition express</p>
					</div>
				</div>
			</div>
		</section>
	);
}
