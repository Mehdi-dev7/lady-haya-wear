"use client";

import OrderTrackingModal from "@/components/Dashboard/OrderTrackingModal";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink, Package, Truck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
	FaChevronDown,
	FaEdit,
	FaFilter,
	FaSearch,
	FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface OrderItem {
	id: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	colorName?: string;
	sizeName?: string;
}

interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	customerPhone?: string;
	status: string;
	total: number;
	subtotal: number;
	shippingCost: number;
	taxAmount: number;
	paymentMethod?: string;
	paymentStatus: string;
	notes?: string;
	trackingNumber?: string;
	carrier?: string;
	createdAt: string;
	shippedAt?: string;
	deliveredAt?: string;
	items: OrderItem[];
}

interface OrderStats {
	PENDING?: number;
	PROCESSING?: number;
	SHIPPED?: number;
	DELIVERED?: number;
	CANCELLED?: number;
}

export default function OrdersPage() {
	const [allOrders, setAllOrders] = useState<Order[]>([]); // Toutes les commandes
	const [orders, setOrders] = useState<Order[]>([]); // Commandes filtrées
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<OrderStats>({});
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState("");
	const [sortByAmount, setSortByAmount] = useState("");
	const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
	const [trackingModal, setTrackingModal] = useState<Order | null>(null);

	// Fonction pour basculer l'expansion d'une commande
	const toggleOrderExpansion = (orderId: string) => {
		setExpandedOrders((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(orderId)) {
				newSet.delete(orderId);
			} else {
				newSet.add(orderId);
			}
			return newSet;
		});
	};

	// Fonction de chargement des commandes (sans recherche)
	const fetchOrders = async (status: string, page: number) => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				status,
				search: "",
				page: page.toString(),
				limit: "50", // Charger plus de données pour le filtrage local
			});

			const response = await fetch(`/api/admin/orders?${params}`);
			if (response.ok) {
				const data = await response.json();

				// Trier les commandes par ordre de priorité des statuts
				const sortedOrders = data.orders.sort((a: Order, b: Order) => {
					const statusOrder = {
						PENDING: 1, // En préparation
						SHIPPED: 2, // En livraison
						DELIVERED: 3, // Livré
						CANCELLED: 4, // Annulé
					};

					const orderA = statusOrder[a.status as keyof typeof statusOrder] || 5;
					const orderB = statusOrder[b.status as keyof typeof statusOrder] || 5;

					// Si même statut, trier par date de création (plus récent en premier)
					if (orderA === orderB) {
						return (
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						);
					}

					return orderA - orderB;
				});

				setAllOrders(sortedOrders);
				setStats(data.stats);
				setTotalPages(data.pagination.totalPages);
			} else {
				toast.error("Erreur lors du chargement des commandes");
			}
		} catch (error) {
			console.error("Erreur lors du chargement des commandes:", error);
			toast.error("Erreur lors du chargement des commandes");
		} finally {
			setLoading(false);
		}
	};

	// Appliquer les filtres localement (comme dans Filter.tsx)
	useEffect(() => {
		let filteredOrders = [...allOrders];

		// Filtre par recherche (numéro de commande, nom client, email)
		if (searchTerm) {
			filteredOrders = filteredOrders.filter(
				(order) =>
					order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filtre par statut (déjà fait côté serveur, mais on peut refiltrer localement)
		if (selectedStatus && selectedStatus !== "all") {
			filteredOrders = filteredOrders.filter(
				(order) => order.status === selectedStatus
			);
		}

		// Tri local
		if (sortBy) {
			filteredOrders.sort((a, b) => {
				switch (sortBy) {
					case "newest":
						return (
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						);
					case "oldest":
						return (
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
						);
					default:
						return 0;
				}
			});
		}

		if (sortByAmount) {
			filteredOrders.sort((a, b) => {
				switch (sortByAmount) {
					case "amount-asc":
						return a.total - b.total;
					case "amount-desc":
						return b.total - a.total;
					default:
						return 0;
				}
			});
		}

		setOrders(filteredOrders);
	}, [allOrders, searchTerm, selectedStatus, sortBy, sortByAmount]);

	// Charger les données quand les filtres de base changent
	useEffect(() => {
		fetchOrders(selectedStatus, currentPage);
	}, [selectedStatus, currentPage]);

	// Réinitialiser tous les filtres
	const clearAllFilters = () => {
		setSearchTerm("");
		setSelectedStatus("all");
		setSortBy("");
		setSortByAmount("");
		setCurrentPage(1);
	};

	// Vérifier s'il y a des filtres actifs
	const hasActiveFilters =
		searchTerm || selectedStatus !== "all" || sortBy || sortByAmount;

	// Mettre à jour le statut d'une commande
	const updateOrderStatus = async (orderId: string, newStatus: string) => {
		try {
			const response = await fetch(`/api/admin/orders/${orderId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});

			if (response.ok) {
				toast.success("Statut de la commande mis à jour");
				// Mettre à jour localement dans allOrders
				setAllOrders((prevOrders) =>
					prevOrders.map((order) =>
						order.id === orderId ? { ...order, status: newStatus } : order
					)
				);
				// Mettre à jour localement dans orders (commandes filtrées)
				setOrders((prevOrders) =>
					prevOrders.map((order) =>
						order.id === orderId ? { ...order, status: newStatus } : order
					)
				);
			} else {
				const data = await response.json();
				toast.error(data.error || "Erreur lors de la mise à jour");
			}
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			toast.error("Erreur lors de la mise à jour du statut");
		}
	};

	// Mettre à jour les informations de suivi
	const updateOrderTracking = async (orderId: string, data: any) => {
		try {
			const response = await fetch(`/api/admin/orders/${orderId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (response.ok) {
				const updatedOrder = await response.json();
				// Mettre à jour localement avec les données complètes de la réponse
				setAllOrders((prevOrders) =>
					prevOrders.map((order) =>
						order.id === orderId ? { ...order, ...updatedOrder.order } : order
					)
				);
				setOrders((prevOrders) =>
					prevOrders.map((order) =>
						order.id === orderId ? { ...order, ...updatedOrder.order } : order
					)
				);
				return updatedOrder;
			} else {
				const errorData = await response.json();
				throw new Error(errorData.error || "Erreur lors de la mise à jour");
			}
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			throw error;
		}
	};

	// Obtenir le lien de suivi
	const getTrackingUrl = (carrier: string, trackingNumber: string) => {
		if (!trackingNumber || !carrier) return "";

		switch (carrier) {
			case "colissimo":
				return `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;
			case "chronopost":
				return `https://www.chronopost.fr/tracking-colis?listeNumerosLT=${trackingNumber}`;
			case "mondial-relay":
				return `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${trackingNumber}`;
			case "dpd":
				return `https://www.dpd.fr/tracer/${trackingNumber}`;
			case "ups":
				return `https://www.ups.com/track?tracknum=${trackingNumber}`;
			case "fedex":
				return `https://www.fedex.com/fr-fr/tracking.html?tracknumbers=${trackingNumber}`;
			default:
				return "";
		}
	};

	// Obtenir l'icône et la couleur selon le statut
	const getStatusInfo = (status: string) => {
		switch (status) {
			case "PENDING":
				return {
					icon: Clock,
					color: "text-red-600 bg-rose-light-2",
					label: "En préparation",
				};
			case "PROCESSING":
				return {
					icon: Clock,
					color: "text-blue-600 bg-blue-100",
					label: "En traitement",
				};
			case "SHIPPED":
				return {
					icon: Truck,
					color: "text-orange-400 bg-orange-100",
					label: "En livraison",
				};
			case "DELIVERED":
				return {
					icon: Package,
					color: "text-green-600 bg-green-100",
					label: "Livré",
				};
			case "CANCELLED":
				return {
					icon: XCircle,
					color: "text-white bg-red-600",
					label: "Annulé",
				};
			default:
				return {
					icon: Clock,
					color: "text-gray-600 bg-gray-100",
					label: status,
				};
		}
	};

	// Obtenir l'icône et la couleur selon le statut de paiement
	const getPaymentStatusInfo = (status: string) => {
		switch (status) {
			case "PAID":
				return { color: "text-green-600 bg-green-100", label: "Payé" };
			case "PENDING":
				return { color: "text-orange-600 bg-orange-100", label: "En attente" };
			case "FAILED":
				return { color: "text-red-600 bg-red-100", label: "Échec" };
			case "REFUNDED":
				return { color: "text-blue-600 bg-blue-100", label: "Remboursé" };
			default:
				return { color: "text-gray-600 bg-gray-100", label: status };
		}
	};

	// Composant Select personnalisé avec menu stylisé
	function CustomSelect({
		value,
		onChange,
		options,
		placeholder,
		label,
	}: {
		value: string;
		onChange: (value: string) => void;
		options: { value: string; label: string }[];
		placeholder: string;
		label: string;
	}) {
		const [isOpen, setIsOpen] = useState(false);

		const selectedOption = options.find((option) => option.value === value);

		return (
			<div className="relative">
				<label className="block text-xs sm:text-sm font-medium text-nude-dark-2 mb-1 sm:mb-2">
					{label}
				</label>
				<div className="relative">
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors bg-white cursor-pointer text-left flex items-center justify-between text-sm sm:text-base"
					>
						<span
							className={selectedOption ? "text-nude-dark" : "text-gray-500"}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<FaChevronDown
							className={`w-3 h-3 sm:w-4 sm:h-4 text-nude-dark transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
						/>
					</button>

					{/* Menu déroulant stylisé */}
					{isOpen && (
						<div className="absolute z-50 w-full mt-2 bg-white border-2 border-nude-medium rounded-2xl shadow-lg max-h-60 overflow-y-auto scrollbar-hide">
							{options.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
									className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-nude-light transition-colors first:rounded-t-2xl last:rounded-b-2xl text-sm sm:text-base ${
										value === option.value
											? "bg-nude-medium text-nude-dark font-medium"
											: "text-nude-dark hover:text-nude-dark-2"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Overlay pour fermer le menu en cliquant ailleurs */}
				{isOpen && (
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</div>
		);
	}

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="p-1 sm:p-6 space-y-2 sm:space-y-6">
			{/* Modal de suivi */}
			<OrderTrackingModal
				order={trackingModal}
				onClose={() => setTrackingModal(null)}
				onUpdate={updateOrderTracking}
			/>
			{/* En-tête */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-xl sm:text-2xl text-logo font-bold">
						Gestion des Commandes
					</h1>
					<p className="text-nude-dark mt-1 text-sm sm:text-base">
						Suivi et gestion des commandes clients
					</p>
				</div>
			</div>

			{/* Statistiques dynamiques basées sur les commandes filtrées */}
			<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
				{/* Commandes en préparation */}
				<Card className="shadow-lg w-full sm:w-64">
					<CardContent className="p-3 sm:p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm text-nude-dark">
									Commandes en préparation
								</p>
								<p className="text-xl sm:text-2xl font-bold text-logo">
									{orders.filter((order) => order.status === "PENDING").length}
								</p>
							</div>
							<Clock className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				{/* Commandes en livraison */}
				<Card className="shadow-lg w-full sm:w-64">
					<CardContent className="p-3 sm:p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm text-nude-dark">
									Commandes en livraison
								</p>
								<p className="text-xl sm:text-2xl font-bold text-logo">
									{orders.filter((order) => order.status === "SHIPPED").length}
								</p>
							</div>
							<Truck className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
						</div>
					</CardContent>
				</Card>

				{/* Total des commandes affichées */}
				<Card className="shadow-lg w-full sm:w-64">
					<CardContent className="p-3 sm:p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm text-nude-dark">
									Total affiché
								</p>
								<p className="text-xl sm:text-2xl font-bold text-logo">
									{orders.length}
								</p>
							</div>
							<Package className="h-6 w-6 sm:h-8 sm:w-8 text-nude-dark" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filtres et recherche */}
			<div className="mb-4 sm:mb-8">
				{/* Barre de recherche principale */}
				<div className="flex flex-col lg:flex-row gap-2 sm:gap-4 mb-3 sm:mb-6">
					<div className="flex-1 relative">
						<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
						<input
							type="text"
							placeholder="Rechercher par numéro, client, email..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full lg:w-1/3 pl-8 sm:pl-10 pr-4 py-2 sm:py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors text-sm sm:text-base"
						/>
						{loading && (
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
								<div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-nude-dark"></div>
							</div>
						)}
					</div>

					<div className="flex gap-1 sm:gap-2 lg:-ml-12">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-2 sm:py-1 rounded-2xl border-2 cursor-pointer transition-colors text-xs sm:text-sm ${
								showFilters
									? "border-nude-dark bg-nude-medium text-nude-light"
									: "border-nude-medium text-nude-dark hover:border-nude-medium"
							}`}
						>
							<FaFilter className="text-xs sm:text-sm" />
							Filtres
						</button>

						{hasActiveFilters && (
							<button
								onClick={clearAllFilters}
								className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-3 rounded-2xl border-2 border-red-300 text-red-300 hover:bg-red-300 hover:text-white transition-colors cursor-pointer text-xs sm:text-sm"
							>
								<FaTimes className="text-xs sm:text-sm" />
								Effacer
							</button>
						)}
					</div>
				</div>

				{/* Panneau de filtres */}
				{showFilters && (
					<div className="bg-rose-light-2 rounded-2xl p-2 sm:p-6 shadow-lg border border-nude-light mb-3 sm:mb-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
							{/* Statut */}
							<CustomSelect
								value={selectedStatus}
								onChange={setSelectedStatus}
								options={[
									{ value: "all", label: "Tous les statuts" },
									{ value: "PENDING", label: "En préparation" },
									{ value: "PROCESSING", label: "En traitement" },
									{ value: "SHIPPED", label: "En livraison" },
									{ value: "DELIVERED", label: "Livré" },
									{ value: "CANCELLED", label: "Annulé" },
								]}
								placeholder="Sélectionner un statut"
								label="Statut"
							/>

							{/* Tri par date */}
							<CustomSelect
								value={sortBy}
								onChange={setSortBy}
								options={[
									{ value: "", label: "Tous" },
									{ value: "newest", label: "Plus récents" },
									{ value: "oldest", label: "Plus anciens" },
								]}
								placeholder="Trier par date"
								label="Tri par date"
							/>

							{/* Tri par montant */}
							<CustomSelect
								value={sortByAmount}
								onChange={setSortByAmount}
								options={[
									{ value: "", label: "Tous" },
									{ value: "amount-asc", label: "Montant croissant" },
									{ value: "amount-desc", label: "Montant décroissant" },
								]}
								placeholder="Trier par montant"
								label="Tri par montant"
							/>
						</div>
					</div>
				)}

				{/* Indicateur de filtres actifs */}
				{hasActiveFilters && (
					<div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
						{searchTerm && (
							<span className="px-2 sm:px-3 py-1 bg-nude-light text-nude-dark rounded-full text-xs sm:text-sm">
								Recherche : "{searchTerm}"
							</span>
						)}
						{selectedStatus !== "all" && (
							<span className="px-2 sm:px-3 py-1 bg-nude-light text-nude-dark rounded-full text-xs sm:text-sm">
								Statut : {selectedStatus}
							</span>
						)}
						{sortBy && (
							<span className="px-2 sm:px-3 py-1 bg-nude-light text-nude-dark rounded-full text-xs sm:text-sm">
								Tri : {sortBy}
							</span>
						)}
						{sortByAmount && (
							<span className="px-2 sm:px-3 py-1 bg-nude-light text-nude-dark rounded-full text-xs sm:text-sm">
								Tri montant : {sortByAmount}
							</span>
						)}
					</div>
				)}
			</div>

			{/* Liste des commandes */}
			<Card className="shadow-lg -mx-1 sm:mx-0">
				<CardHeader className="pb-2 sm:pb-6">
					<CardTitle className="text-nude-dark text-base sm:text-lg">
						Commandes ({orders.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="p-2 sm:p-6">
					{orders.length === 0 ? (
						<div className="text-center py-6 sm:py-8">
							<Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
							<p className="text-gray-500 text-sm sm:text-base">
								Aucune commande trouvée
							</p>
						</div>
					) : (
						<div className="space-y-2 sm:space-y-4">
							{orders.map((order) => {
								const statusInfo = getStatusInfo(order.status);
								const paymentStatusInfo = getPaymentStatusInfo(
									order.paymentStatus
								);
								const StatusIcon = statusInfo.icon;
								const isExpanded = expandedOrders.has(order.id);

								return (
									<div
										key={order.id}
										className="border rounded-lg p-2 sm:p-3 hover:shadow-md transition-shadow"
									>
										{/* En-tête compacte - toujours visible */}
										<div className="flex justify-between items-start mb-2">
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-sm sm:text-lg mb-1">
													{order.orderNumber}
												</h3>
												<p className="text-gray-600 font-medium text-sm sm:text-base truncate">
													{order.customerName}
												</p>
											</div>
											<div className="text-right flex-shrink-0 ml-2">
												<div className="flex items-center justify-end gap-2 mb-1">
													<span
														className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full flex-shrink-0 truncate ${statusInfo.color}`}
													>
														<StatusIcon className="h-2 w-2 sm:h-3 sm:w-3 inline mr-1 flex-shrink-0" />
														<span className="hidden sm:inline">
															{statusInfo.label}
														</span>
														<span className="sm:hidden">
															{statusInfo.label}
														</span>
													</span>
													{order.trackingNumber && (
														<span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
															📦 Suivi
														</span>
													)}
												</div>
												<p className="text-xs sm:text-sm text-gray-500">
													{new Date(order.createdAt).toLocaleDateString()}
												</p>
											</div>
										</div>

										{/* Bouton d'expansion et menu de statut */}
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-2">
												{/* Bouton d'expansion */}
												<button
													onClick={() => toggleOrderExpansion(order.id)}
													className="flex items-center gap-1 text-xs sm:text-sm text-nude-dark hover:text-nude-dark-2 transition-colors underline cursor-pointer"
												>
													<span>
														{isExpanded ? "Masquer" : "Voir"} les détails
													</span>
													<svg
														className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</button>

												{/* Bouton de suivi */}
												<button
													onClick={() => setTrackingModal(order)}
													className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors underline cursor-pointer"
												>
													<FaEdit className="w-3 h-3" />
													<span className="hidden sm:inline">Suivi</span>
												</button>
											</div>

											{/* Prix et statut de paiement */}
											<div className="flex items-center gap-2">
												<p className="text-sm sm:text-lg font-bold text-logo">
													{order.total.toFixed(2)}€
												</p>
												<span
													className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${paymentStatusInfo.color}`}
												>
													{paymentStatusInfo.label}
												</span>
											</div>
										</div>

										{/* Contenu détaillé - visible seulement si expandé */}
										{isExpanded && (
											<div className="pt-2 border-t border-gray-200">
												{/* Informations client détaillées */}
												<div className="mb-2 sm:mb-3">
													<p className="text-xs sm:text-sm text-gray-500 mb-1">
														{order.customerEmail}
													</p>
													{order.customerPhone && (
														<p className="text-xs sm:text-sm text-gray-500">
															{order.customerPhone}
														</p>
													)}
												</div>

												{/* Produits */}
												<div className="mb-2 sm:mb-3">
													<p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
														Produits :
													</p>
													<div className="space-y-0.5">
														{order.items.map((item) => (
															<div
																key={item.id}
																className="flex justify-between items-center text-xs sm:text-sm"
															>
																<span className="flex-1 min-w-0">
																	{item.productName} x{item.quantity}
																	{item.colorName && ` (${item.colorName})`}
																	{item.sizeName && ` - ${item.sizeName}`}
																</span>
																<span className="font-medium flex-shrink-0 ml-2 flex items-center">
																	{item.totalPrice.toFixed(2)}€
																</span>
															</div>
														))}
													</div>
												</div>

												{/* Informations de suivi */}
												<div className="mb-2 sm:mb-3">
													<p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
														Suivi de livraison :{" "}
														{order.trackingNumber || order.carrier ? (
															<span className="font-normal text-gray-600">
																{order.carrier && (
																	<span className="capitalize">
																		{order.carrier.replace("-", " ")}
																	</span>
																)}
																{order.carrier && order.trackingNumber && " - "}
																{order.trackingNumber && (
																	<span>
																		{order.trackingNumber}
																		{getTrackingUrl(
																			order.carrier || "",
																			order.trackingNumber
																		) && (
																			<a
																				href={getTrackingUrl(
																					order.carrier || "",
																					order.trackingNumber
																				)}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="text-blue-600 hover:text-blue-800 ml-1"
																			>
																				<ExternalLink className="w-3 h-3 inline" />
																			</a>
																		)}
																	</span>
																)}
															</span>
														) : (
															<span className="font-normal text-gray-500 italic">
																Aucune information disponible
															</span>
														)}
													</p>
												</div>

												{/* Notes */}
												{order.notes && (
													<div className="mt-2">
														<p className="text-xs sm:text-sm text-gray-600 italic">
															Note: {order.notes}
														</p>
													</div>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center gap-2">
					<Button
						variant="outline"
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
					>
						Précédent
					</Button>
					<span className="flex items-center px-2 sm:px-4 text-xs sm:text-sm">
						Page {currentPage} sur {totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() =>
							setCurrentPage(Math.min(totalPages, currentPage + 1))
						}
						disabled={currentPage === totalPages}
						className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
					>
						Suivant
					</Button>
				</div>
			)}
		</div>
	);
}
