"use client";

import SalesChart from "@/components/Dashboard/SalesChart";
import StatsCard from "@/components/Dashboard/StatsCard";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
	// Données de test pour les statistiques
	const stats = [
		{
			title: "Utilisateurs totaux",
			value: "1,234",
			description: "Utilisateurs inscrits",
			icon: Users,
			trend: { value: 12, isPositive: true },
		},
		{
			title: "Produits en vente",
			value: "89",
			description: "Produits disponibles",
			icon: ShoppingCart,
			trend: { value: 5, isPositive: true },
		},
		{
			title: "Commandes ce mois",
			value: "156",
			description: "Commandes traitées",
			icon: Package,
			trend: { value: 8, isPositive: true },
		},
		{
			title: "Chiffre d'affaires",
			value: "€12,450",
			description: "Ce mois-ci",
			icon: TrendingUp,
			trend: { value: 15, isPositive: true },
		},
	];

	// Données de test pour le graphique des ventes
	const salesData = [
		{ period: "Jan", sales: 1200, salesNormal: 1200, salesHigh: 0 },
		{ period: "Fév", sales: 1800, salesNormal: 0, salesHigh: 1800 },
		{ period: "Mar", sales: 1400, salesNormal: 1400, salesHigh: 0 },
		{ period: "Avr", sales: 2200, salesNormal: 0, salesHigh: 2200 },
		{ period: "Mai", sales: 1900, salesNormal: 0, salesHigh: 1900 },
		{ period: "Juin", sales: 2500, salesNormal: 0, salesHigh: 2500 },
		{ period: "Juil", sales: 2100, salesNormal: 0, salesHigh: 2100 },
		{ period: "Août", sales: 2800, salesNormal: 0, salesHigh: 2800 },
		{ period: "Sep", sales: 2400, salesNormal: 0, salesHigh: 2400 },
		{ period: "Oct", sales: 3200, salesNormal: 0, salesHigh: 3200 },
		{ period: "Nov", sales: 2900, salesNormal: 0, salesHigh: 2900 },
		{ period: "Déc", sales: 3500, salesNormal: 0, salesHigh: 3500 },
	];

	return (
		<div className="space-y-6">
			{/* En-tête */}
			<div>
				<h1 className="text-3xl font-bold text-logo">Tableau de bord</h1>
				<p className="text-nude-dark mt-2">
					Vue d'ensemble de votre boutique Lady Haya Wear
				</p>
			</div>

			{/* Cartes de statistiques */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				{stats.map((stat, index) => (
					<StatsCard
						key={index}
						title={stat.title}
						value={stat.value}
						description={stat.description}
						icon={stat.icon}
						trend={stat.trend}
					/>
				))}
			</div>

			{/* Graphique des ventes */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<SalesChart data={salesData} title="Ventes mensuelles 2024" />

				{/* Carte d'activité récente */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-lg lg:text-2xl font-semibold text-nude-dark mb-4">
						Activité récente
					</h3>
					<div className="space-y-4">
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<div>
								<p className="text-sm lg:text-base font-medium text-nude-dark">
									Nouvelle commande #1234
								</p>
								<p className="text-xs lg:text-sm text-nude-dark">
									Il y a 2 minutes
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<div>
								<p className="text-sm lg:text-base font-medium text-nude-dark">
									Nouveau produit ajouté
								</p>
								<p className="text-xs lg:text-sm text-nude-dark">
									Il y a 1 heure
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
							<div>
								<p className="text-sm lg:text-base font-medium text-nude-dark">
									Promotion créée
								</p>
								<p className="text-xs lg:text-sm text-nude-dark">
									Il y a 3 heures
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
