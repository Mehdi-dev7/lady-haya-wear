"use client";

import { useEffect, useState } from "react";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";

interface FilterProps {
	products: any[];
	onFilterChange: (filteredProducts: any[]) => void;
	categories?: any[];
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
	const [priceRange, setPriceRange] = useState({ min: "", max: "" });
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

		// Filtre par prix
		if (priceRange.min || priceRange.max) {
			filteredProducts = filteredProducts.filter((product) => {
				const price = product.price || 0;
				const min = priceRange.min ? parseFloat(priceRange.min) : 0;
				const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
				return price >= min && price <= max;
			});
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
		priceRange,
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
		setPriceRange({ min: "", max: "" });
		setSortBy("");
	};

	// Vérifier s'il y a des filtres actifs
	const hasActiveFilters =
		searchTerm ||
		selectedCategory ||
		selectedColor ||
		selectedSize ||
		priceRange.min ||
		priceRange.max ||
		sortBy;

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
						className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-nude-light focus:border-nude-dark focus:outline-none transition-colors"
					/>
				</div>

				<div className="flex gap-2">
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-colors ${
							showFilters
								? "border-nude-dark bg-nude-dark text-white"
								: "border-nude-light text-nude-dark hover:border-nude-dark"
						}`}
					>
						<FaFilter />
						Filtres
					</button>

					{hasActiveFilters && (
						<button
							onClick={clearAllFilters}
							className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
						>
							<FaTimes />
							Effacer
						</button>
					)}
				</div>
			</div>

			{/* Panneau de filtres */}
			{showFilters && (
				<div className="bg-white rounded-2xl p-6 shadow-lg border border-nude-light mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
						{/* Tri */}
						<div>
							<label className="block text-sm font-medium text-nude-dark mb-2">
								Trier par
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="w-full px-3 py-2 rounded-lg border-2 border-nude-light focus:border-nude-dark focus:outline-none transition-colors"
							>
								<option value="">Tous</option>
								<option value="price-asc">Prix : Croissant</option>
								<option value="price-desc">Prix : Décroissant</option>
								<option value="newest">Plus récents</option>
								<option value="oldest">Plus anciens</option>
								<option value="name-asc">Nom : A-Z</option>
								<option value="name-desc">Nom : Z-A</option>
							</select>
						</div>

						{/* Catégorie */}
						{categories.length > 0 && (
							<div>
								<label className="block text-sm font-medium text-nude-dark mb-2">
									Collection
								</label>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full px-3 py-2 rounded-lg border-2 border-nude-light focus:border-nude-dark focus:outline-none transition-colors"
								>
									<option value="">Toutes</option>
									{categories.map((category) => (
										<option key={category._id} value={category.name}>
											{category.name}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Couleur */}
						{uniqueColors.length > 0 && (
							<div>
								<label className="block text-sm font-medium text-nude-dark mb-2">
									Couleur
								</label>
								<select
									value={selectedColor}
									onChange={(e) => setSelectedColor(e.target.value)}
									className="w-full px-3 py-2 rounded-lg border-2 border-nude-light focus:border-nude-dark focus:outline-none transition-colors"
								>
									<option value="">Toutes</option>
									{uniqueColors.map((color) => (
										<option key={color} value={color}>
											{color}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Taille */}
						{uniqueSizes.length > 0 && (
							<div>
								<label className="block text-sm font-medium text-nude-dark mb-2">
									Taille
								</label>
								<select
									value={selectedSize}
									onChange={(e) => setSelectedSize(e.target.value)}
									className="w-full px-3 py-2 rounded-lg border-2 border-nude-light focus:border-nude-dark focus:outline-none transition-colors"
								>
									<option value="">Toutes</option>
									{uniqueSizes.map((size) => (
										<option key={size} value={size}>
											{size}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Prix minimum */}
						<div>
							<label className="block text-sm font-medium text-nude-dark mb-2">
								Prix min (€)
							</label>
							<input
								type="number"
								placeholder="0"
								value={priceRange.min}
								onChange={(e) =>
									setPriceRange((prev) => ({ ...prev, min: e.target.value }))
								}
								className="w-full px-3 py-2 rounded-lg border-2 border-nude-light focus:border-nude-dark focus:outline-none transition-colors"
							/>
						</div>

						{/* Prix maximum */}
						<div>
							<label className="block text-sm font-medium text-nude-dark mb-2">
								Prix max (€)
							</label>
							<input
								type="number"
								placeholder="∞"
								value={priceRange.max}
								onChange={(e) =>
									setPriceRange((prev) => ({ ...prev, max: e.target.value }))
								}
								className="w-full px-3 py-2 rounded-lg border-2 border-nude-light focus:border-nude-dark focus:outline-none transition-colors"
							/>
						</div>
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
					{(priceRange.min || priceRange.max) && (
						<span className="px-3 py-1 bg-nude-light text-nude-dark rounded-full text-sm">
							Prix : {priceRange.min || "0"}€ - {priceRange.max || "∞"}€
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
