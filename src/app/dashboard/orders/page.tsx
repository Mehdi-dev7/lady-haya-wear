"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Package, Search } from "lucide-react";

export default function OrdersPage() {
	// Données de test pour les commandes
	const orders = [
		{
			id: "#1234",
			customer: "Marie Dupont",
			date: "2024-01-15",
			status: "Livrée",
			total: "€89.99",
			items: 2,
		},
		{
			id: "#1235",
			customer: "Sophie Martin",
			date: "2024-01-14",
			status: "En cours",
			total: "€156.50",
			items: 3,
		},
		{
			id: "#1236",
			customer: "Julie Bernard",
			date: "2024-01-13",
			status: "En préparation",
			total: "€67.80",
			items: 1,
		},
		{
			id: "#1237",
			customer: "Anne Petit",
			date: "2024-01-12",
			status: "Livrée",
			total: "€234.00",
			items: 4,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Livrée":
				return "bg-green-100 text-green-800";
			case "En cours":
				return "bg-blue-100 text-blue-800";
			case "En préparation":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* En-tête */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-nude-dark">Commandes</h1>
					<p className="text-nude-dark mt-2">
						Gérez toutes les commandes de votre boutique
					</p>
				</div>
				<Button className="flex items-center space-x-2">
					<Package className="h-4 w-4" />
					<span>Nouvelle commande</span>
				</Button>
			</div>

			{/* Filtres et recherche */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Rechercher une commande..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<Button variant="outline" className="flex items-center space-x-2">
							<Filter className="h-4 w-4" />
							<span>Filtres</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Tableau des commandes */}
			<Card>
				<CardHeader>
					<CardTitle>Commandes récentes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-medium text-gray-900">
										Commande
									</th>
									<th className="text-left py-3 px-4 font-medium text-gray-900">
										Client
									</th>
									<th className="text-left py-3 px-4 font-medium text-gray-900">
										Date
									</th>
									<th className="text-left py-3 px-4 font-medium text-gray-900">
										Statut
									</th>
									<th className="text-left py-3 px-4 font-medium text-gray-900">
										Total
									</th>
									<th className="text-left py-3 px-4 font-medium text-gray-900">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr
										key={order.id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-3 px-4">
											<div>
												<div className="font-medium text-gray-900">
													{order.id}
												</div>
												<div className="text-sm text-gray-500">
													{order.items} article(s)
												</div>
											</div>
										</td>
										<td className="py-3 px-4 text-gray-900">
											{order.customer}
										</td>
										<td className="py-3 px-4 text-gray-900">{order.date}</td>
										<td className="py-3 px-4">
											<span
												className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
											>
												{order.status}
											</span>
										</td>
										<td className="py-3 px-4 font-medium text-gray-900">
											{order.total}
										</td>
										<td className="py-3 px-4">
											<Button variant="outline" size="sm">
												Voir détails
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
