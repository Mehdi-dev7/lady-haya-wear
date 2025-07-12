"use client";

import { useEffect, useState } from "react";
import { FaChevronDown, FaFilter, FaSearch, FaTimes } from "react-icons/fa";

interface FilterProps {
	products: any[];
	onFilterChange: (filteredProducts: any[]) => void;
	categories?: any[];
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
								className={`w-full px-4 py-3 text-left hover:bg-nude-light transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
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
				<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
			)}
		</div>
	);
}

export default function Filter({
	products,
	onFilterChange,
	categories = [],
}: FilterProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedColor, setSelectedColor] = useState("");
	const [selectedSize, setSelectedSize] = useState("");
	const [sortBy, setSortBy] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	// Extraire les couleurs et tailles uniques des produits
	const uniqueColors = [
		...new Set(
			products.flatMap(
				(product) => product.colors?.map((color: any) => color.name) || []
			)
		),
	].filter(Boolean);

	const uniqueSizes = [
		...new Set(
			products.flatMap(
				(product) =>
					product.colors?.flatMap(
						(color: any) => color.sizes?.map((size: any) => size.size) || []
					) || []
			)
		),
	].filter(Boolean);

	// Options pour les selects
	const sortOptions = [
		{ value: "", label: "Tous" },
		{ value: "price-asc", label: "Prix : Croissant" },
		{ value: "price-desc", label: "Prix : Décroissant" },
		{ value: "newest", label: "Plus récents" },
		{ value: "oldest", label: "Plus anciens" },
		{ value: "name-asc", label: "Nom : A-Z" },
		{ value: "name-desc", label: "Nom : Z-A" },
	];

	const categoryOptions = [
		{ value: "", label: "Toutes" },
		...categories.map((category) => ({
			value: category.name,
			label: category.name,
		})),
	];

	const colorOptions = [
		{ value: "", label: "Toutes" },
		...uniqueColors.map((color) => ({ value: color, label: color })),
	];

	const sizeOptions = [
		{ value: "", label: "Toutes" },
		...uniqueSizes.map((size) => ({ value: size, label: size })),
	];

	// Appliquer les filtres
	useEffect(() => {
		let filteredProducts = [...products];

		// Filtre par recherche (nom)
		if (searchTerm) {
			filteredProducts = filteredProducts.filter((product) =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filtre par catégorie
		if (selectedCategory) {
			filteredProducts = filteredProducts.filter(
				(product) => product.category?.name === selectedCategory
			);
		}

		// Filtre par couleur
		if (selectedColor) {
			filteredProducts = filteredProducts.filter((product) =>
				product.colors?.some((color: any) => color.name === selectedColor)
			);
		}

		// Filtre par taille
		if (selectedSize) {
			filteredProducts = filteredProducts.filter((product) =>
				product.colors?.some((color: any) =>
					color.sizes?.some(
						(size: any) =>
							size.size === selectedSize && size.available && size.quantity > 0
					)
				)
			);
		}

		// Tri
		if (sortBy) {
			filteredProducts.sort((a, b) => {
				switch (sortBy) {
					case "price-asc":
						return (a.price || 0) - (b.price || 0);
					case "price-desc":
						return (b.price || 0) - (a.price || 0);
					case "newest":
						return (
							new Date(b._createdAt || 0).getTime() -
							new Date(a._createdAt || 0).getTime()
						);
					case "oldest":
						return (
							new Date(a._createdAt || 0).getTime() -
							new Date(b._createdAt || 0).getTime()
						);
					case "name-asc":
						return a.name.localeCompare(b.name);
					case "name-desc":
						return b.name.localeCompare(a.name);
					default:
						return 0;
				}
			});
		}

		onFilterChange(filteredProducts);
	}, [
		searchTerm,
		selectedCategory,
		selectedColor,
		selectedSize,
		sortBy,
		products,
		onFilterChange,
	]);

	// Réinitialiser tous les filtres
	const clearAllFilters = () => {
		setSearchTerm("");
		setSelectedCategory("");
		setSelectedColor("");
		setSelectedSize("");
		setSortBy("");
	};

	// Vérifier s'il y a des filtres actifs
	const hasActiveFilters =
		searchTerm || selectedCategory || selectedColor || selectedSize || sortBy;

	return (
		<div className="mb-8">
			{/* Barre de recherche principale */}
			<div className="flex flex-col lg:flex-row gap-4 mb-6">
				<div className="flex-1 relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher un produit..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Tri */}
						<CustomSelect
							value={sortBy}
							onChange={setSortBy}
							options={sortOptions}
							placeholder="Trier par"
							label="Trier par"
						/>

						{/* Catégorie */}
						{categories.length > 0 && (
							<CustomSelect
								value={selectedCategory}
								onChange={setSelectedCategory}
								options={categoryOptions}
								placeholder="Sélectionner une collection"
								label="Collection"
							/>
						)}

						{/* Couleur */}
						<CustomSelect
							value={selectedColor}
							onChange={setSelectedColor}
							options={colorOptions}
							placeholder="Sélectionner une couleur"
							label="Couleur"
						/>

						{/* Taille */}
						<CustomSelect
							value={selectedSize}
							onChange={setSelectedSize}
							options={sizeOptions}
							placeholder="Sélectionner une taille"
							label="Taille"
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
					{selectedCategory && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Collection : {selectedCategory}
						</span>
					)}
					{selectedColor && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Couleur : {selectedColor}
						</span>
					)}
					{selectedSize && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Taille : {selectedSize}
						</span>
					)}

					{sortBy && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Tri : {sortBy}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
