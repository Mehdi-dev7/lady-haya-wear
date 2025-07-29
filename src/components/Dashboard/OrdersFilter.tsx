"use client";

import { useState } from "react";
import { FaChevronDown, FaFilter, FaSearch, FaTimes } from "react-icons/fa";

interface OrdersFilterProps {
	orders: any[];
	onFilterChange: (filteredOrders: any[]) => void;
}

interface CustomSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder: string;
	label: string;
}

// Composant Select personnalisé avec menu stylisé
function CustomSelect({
	value,
	onChange,
	options,
	placeholder,
	label,
}: CustomSelectProps) {
	const [isOpen, setIsOpen] = useState(false);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div className="relative">
			<label className="block text-sm font-medium text-nude-dark-2 mb-2">
				{label}
			</label>
			<div className="relative">
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors bg-white cursor-pointer text-left flex items-center justify-between"
				>
					<span className={selectedOption ? "text-nude-dark" : "text-gray-500"}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<FaChevronDown
						className={`w-4 h-4 text-nude-dark transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
								className={`w-full px-4 py-3 text-left transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
									value === option.value
										? "bg-nude-medium text-nude-dark font-medium"
										: "text-nude-dark hover:bg-rose-light-2 hover:text-nude-dark-2 hover:shadow-sm"
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
				<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
			)}
		</div>
	);
}

export default function OrdersFilter({
	orders,
	onFilterChange,
}: OrdersFilterProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("");
	const [sortBy, setSortBy] = useState("status-priority");
	const [showFilters, setShowFilters] = useState(false);

	// Fonction pour appliquer les filtres
	const applyFilters = (
		newSearchTerm: string,
		newSelectedStatus: string,
		newSortBy: string
	) => {
		let filteredOrders = [...orders];

		// Filtre par recherche (ID commande, nom client)
		if (newSearchTerm) {
			filteredOrders = filteredOrders.filter(
				(order) =>
					order.id.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
					order.customer.toLowerCase().includes(newSearchTerm.toLowerCase())
			);
		}

		// Filtre par statut
		if (newSelectedStatus) {
			filteredOrders = filteredOrders.filter(
				(order) => order.status === newSelectedStatus
			);
		}

		// Tri
		if (newSortBy) {
			filteredOrders.sort((a, b) => {
				switch (newSortBy) {
					case "status-priority":
						// Ordre de priorité : En préparation > En cours > Livrée > Annulée
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
					case "date-desc":
						return new Date(b.date).getTime() - new Date(a.date).getTime();
					case "date-asc":
						return new Date(a.date).getTime() - new Date(b.date).getTime();
					case "total-desc":
						return (
							parseFloat(b.total.replace("€", "")) -
							parseFloat(a.total.replace("€", ""))
						);
					case "total-asc":
						return (
							parseFloat(a.total.replace("€", "")) -
							parseFloat(b.total.replace("€", ""))
						);
					case "customer-asc":
						return a.customer.localeCompare(b.customer);
					case "customer-desc":
						return b.customer.localeCompare(a.customer);
					default:
						return 0;
				}
			});
		}

		onFilterChange(filteredOrders);
	};

	// Gestionnaires d'événements avec application immédiate des filtres
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		applyFilters(value, selectedStatus, sortBy);
	};

	const handleStatusChange = (value: string) => {
		setSelectedStatus(value);
		applyFilters(searchTerm, value, sortBy);
	};

	const handleSortChange = (value: string) => {
		setSortBy(value);
		applyFilters(searchTerm, selectedStatus, value);
	};

	// Options pour les selects
	const sortOptions = [
		{ value: "", label: "Tous" },
		{ value: "status-priority", label: "Par statut (priorité)" },
		{ value: "date-desc", label: "Plus récentes" },
		{ value: "date-asc", label: "Plus anciennes" },
		{ value: "total-desc", label: "Montant : Décroissant" },
		{ value: "total-asc", label: "Montant : Croissant" },
		{ value: "customer-asc", label: "Client : A-Z" },
		{ value: "customer-desc", label: "Client : Z-A" },
	];

	const statusOptions = [
		{ value: "", label: "Tous les statuts" },
		{ value: "PENDING", label: "En préparation" },
		{ value: "PROCESSING", label: "En traitement" },
		{ value: "SHIPPED", label: "En livraison" },
		{ value: "DELIVERED", label: "Livré" },
		{ value: "CANCELLED", label: "Annulé" },
	];

	// Réinitialiser tous les filtres
	const clearAllFilters = () => {
		setSearchTerm("");
		setSelectedStatus("");
		setSortBy("status-priority");
		applyFilters("", "", "status-priority");
	};

	// Vérifier s'il y a des filtres actifs
	const hasActiveFilters = searchTerm || selectedStatus || sortBy;

	return (
		<div className="mb-8">
			{/* Barre de recherche principale */}
			<div className="flex flex-col lg:flex-row gap-4 mb-6">
				<div className="flex-1 relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher une commande ou un client..."
						value={searchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="w-2/3 md:w-1/2 lg:w-1/3 pl-10 pr-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors"
					/>
				</div>

				<div className="flex gap-2 lg:-ml-12">
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-2 py-1 rounded-2xl border-2 cursor-pointer transition-colors ${
							showFilters
								? "border-nude-dark bg-nude-medium text-nude-light"
								: "border-nude-medium text-nude-dark hover:border-nude-medium"
						}`}
					>
						<FaFilter />
						Filtres
					</button>

					{hasActiveFilters && (
						<button
							onClick={clearAllFilters}
							className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-red-300 text-red-300 hover:bg-red-300 hover:text-white transition-colors cursor-pointer"
						>
							<FaTimes />
							Effacer
						</button>
					)}
				</div>
			</div>

			{/* Panneau de filtres */}
			{showFilters && (
				<div className="bg-rose-light-2 rounded-2xl p-6 shadow-lg border border-nude-light mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Tri */}
						<CustomSelect
							value={sortBy}
							onChange={handleSortChange}
							options={sortOptions}
							placeholder="Trier par"
							label="Trier par"
						/>

						{/* Statut */}
						<CustomSelect
							value={selectedStatus}
							onChange={handleStatusChange}
							options={statusOptions}
							placeholder="Sélectionner un statut"
							label="Statut"
						/>
					</div>
				</div>
			)}

			{/* Indicateur de filtres actifs */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2 mb-4">
					{searchTerm && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Recherche : "{searchTerm}"
						</span>
					)}
					{selectedStatus && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Statut : {selectedStatus}
						</span>
					)}
					{sortBy && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Tri : {sortOptions.find((opt) => opt.value === sortBy)?.label}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
