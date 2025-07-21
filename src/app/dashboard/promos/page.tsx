"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Edit, Plus, Ticket, Trash2 } from "lucide-react";

export default function PromosPage() {
	// Données de test pour les promotions
	const promos = [
		{
			id: 1,
			code: "ETE2024",
			discount: "20%",
			type: "Pourcentage",
			validFrom: "2024-06-01",
			validTo: "2024-08-31",
			usage: 45,
			maxUsage: 100,
			status: "Active",
		},
		{
			id: 2,
			code: "WELCOME10",
			discount: "€10",
			type: "Montant fixe",
			validFrom: "2024-01-01",
			validTo: "2024-12-31",
			usage: 12,
			maxUsage: 50,
			status: "Active",
		},
		{
			id: 3,
			code: "FLASH25",
			discount: "25%",
			type: "Pourcentage",
			validFrom: "2024-01-15",
			validTo: "2024-01-20",
			usage: 8,
			maxUsage: 20,
			status: "Expirée",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Active":
				return "bg-green-100 text-green-800";
			case "Expirée":
				return "bg-red-100 text-red-800";
			case "Inactive":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const copyToClipboard = (code: string) => {
		navigator.clipboard.writeText(code);
		// Ici vous pourriez ajouter une notification de succès
	};

	return (
		<div className="space-y-6">
			{/* En-tête */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-nude-dark">Promotions</h1>
					<p className="text-nude-dark mt-2">
						Gérez vos codes de réduction et promotions
					</p>
				</div>
				<Button className="flex items-center space-x-2">
					<Plus className="h-4 w-4" />
					<span>Nouvelle promotion</span>
				</Button>
			</div>

			{/* Statistiques des promotions */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Promotions actives
								</p>
								<p className="text-2xl font-bold text-gray-900">2</p>
							</div>
							<Ticket className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Utilisations totales
								</p>
								<p className="text-2xl font-bold text-gray-900">65</p>
							</div>
							<div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
								<span className="text-blue-600 font-bold text-sm">65</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Économies générées
								</p>
								<p className="text-2xl font-bold text-gray-900">€1,250</p>
							</div>
							<div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
								<span className="text-purple-600 font-bold text-sm">€</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Liste des promotions */}
			<Card>
				<CardHeader>
					<CardTitle>Codes de réduction</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{promos.map((promo) => (
							<div
								key={promo.id}
								className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="flex items-center space-x-2">
											<span className="font-mono font-bold text-lg text-blue-600">
												{promo.code}
											</span>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => copyToClipboard(promo.code)}
												className="h-6 w-6 p-0"
											>
												<Copy className="h-3 w-3" />
											</Button>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-lg font-bold text-green-600">
												-{promo.discount}
											</span>
											<span className="text-sm text-gray-500">
												({promo.type})
											</span>
										</div>
									</div>

									<div className="flex items-center space-x-4">
										<div className="text-right">
											<div className="text-sm text-gray-600">
												{promo.usage}/{promo.maxUsage} utilisations
											</div>
											<div className="text-xs text-gray-500">
												{promo.validFrom} - {promo.validTo}
											</div>
										</div>

										<span
											className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(promo.status)}`}
										>
											{promo.status}
										</span>

										<div className="flex items-center space-x-2">
											<Button variant="outline" size="sm">
												<Edit className="h-3 w-3" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
