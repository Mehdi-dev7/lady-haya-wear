"use client";

import OrdersFilter from "@/components/Dashboard/OrdersFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function OrdersPage() {
	// Données de test pour les commandes - mémorisées pour éviter les re-renders
	const orders = useMemo(
		() => [
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
			{
				id: "#1238",
				customer: "Claire Dubois",
				date: "2024-01-11",
				status: "Annulée",
				total: "€45.50",
				items: 1,
			},
			{
				id: "#1239",
				customer: "Lucie Moreau",
				date: "2024-01-10",
				status: "En préparation",
				total: "€123.75",
				items: 2,
			},
		],
		[]
	);

	// Fonction pour trier les commandes par statut
	const sortOrdersByStatus = (ordersToSort: any[]) => {
		return [...ordersToSort].sort((a, b) => {
			const statusOrder = {
				"En préparation": 1,
				"En cours": 2,
				Livrée: 3,
				Annulée: 4,
			};
			return (
				(statusOrder[a.status as keyof typeof statusOrder] || 5) -
				(statusOrder[b.status as keyof typeof statusOrder] || 5)
			);
		});
	};

	const [filteredOrders, setFilteredOrders] = useState(() =>
		sortOrdersByStatus(orders)
	);

	// Utiliser useCallback pour éviter les re-renders infinis
	const handleFilterChange = useCallback((filteredOrders: any[]) => {
		setFilteredOrders(filteredOrders);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "En préparation":
				return "bg-rose-medium ";
			case "En cours":
				return "bg-orange-400 text-white";
			case "Livrée":
				return "bg-green-500 text-white";
			case "Annulée":
				return "bg-red-500 text-white";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Composant de sélection de statut
	const StatusSelector = ({
		order,
		onStatusChange,
	}: {
		order: any;
		onStatusChange: (orderId: string, newStatus: string) => void;
	}) => {
		const [isOpen, setIsOpen] = useState(false);

		const statusOptions = [
			{ value: "En préparation", label: "En préparation" },
			{ value: "En cours", label: "En cours" },
			{ value: "Livrée", label: "Livrée" },
			{ value: "Annulée", label: "Annulée" },
		];

		const handleStatusChange = (newStatus: string) => {
			onStatusChange(order.id, newStatus);
			setIsOpen(false);
		};

		return (
			<div className="relative">
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full transition-colors ${getStatusColor(order.status)}`}
				>
					<span>{order.status}</span>
					<FaChevronDown
						className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
					/>
				</button>

				{isOpen && (
					<div className="absolute z-50 mt-1 w-40 bg-white border-2 border-nude-medium rounded-lg shadow-lg">
						{statusOptions.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => handleStatusChange(option.value)}
								className={`w-full px-3 py-2 text-left text-sm hover:bg-rose-light-2 transition-colors first:rounded-t-lg last:rounded-b-lg ${
									order.status === option.value
										? "bg-nude-medium text-black font-medium"
										: "text-black"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
				)}

				{/* Overlay pour fermer le menu en cliquant ailleurs */}
				{isOpen && (
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</div>
		);
	};

	// Fonction pour changer le statut d'une commande
	const handleStatusChange = (orderId: string, newStatus: string) => {
		setFilteredOrders((prevOrders) => {
			const updatedOrders = prevOrders.map((order) =>
				order.id === orderId ? { ...order, status: newStatus } : order
			);
			return sortOrdersByStatus(updatedOrders);
		});
	};

	return (
		<div className="space-y-6">
			{/* En-tête */}
			<div>
				<h1 className="text-3xl font-bold text-logo">Commandes</h1>
				<p className="text-nude-dark mt-2">
					Gérez toutes les commandes de votre boutique
				</p>
			</div>

			{/* Filtres et recherche */}
			<OrdersFilter orders={orders} onFilterChange={handleFilterChange} />

			{/* Tableau des commandes */}
			<Card className="bg-[#d9c4b5]/25 border border-rose-medium">
				<CardHeader>
					<CardTitle className="text-logo">Commandes récentes</CardTitle>
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
								</tr>
							</thead>
							<tbody>
								{filteredOrders.map((order) => (
									<tr
										key={order.id}
										className="border-b border-gray-100 hover:bg-[#d9c4b5]/50"
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
											<StatusSelector
												order={order}
												onStatusChange={handleStatusChange}
											/>
										</td>
										<td className="py-3 px-4 font-medium text-gray-900">
											{order.total}
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
