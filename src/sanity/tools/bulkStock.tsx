import {
	Badge,
	Button,
	Card,
	Checkbox,
	Dialog,
	Flex,
	Select,
	Spinner,
	Stack,
	Text,
	TextInput,
	useToast,
} from "@sanity/ui";
import { useEffect, useState } from "react";
import { useClient, useSchema } from "sanity";

interface ProductDetail {
	_id: string;
	name: string;
	product: {
		_id: string;
		name: string;
		category: {
			_id: string;
			name: string;
		};
	};
	colors: Array<{
		name: string;
		sizes: Array<{
			size: string;
			available: boolean;
			quantity: number;
		}>;
		available: boolean;
	}>;
}

interface Category {
	_id: string;
	name: string;
}

interface StockUpdate {
	productDetailId: string;
	colorIndex: number;
	sizeIndex: number;
	newQuantity: number;
}

export default function BulkStockTool() {
	const client = useClient({ apiVersion: "2023-01-01" });
	const schema = useSchema();
	const toast = useToast();

	const [categories, setCategories] = useState<Category[]>([]);
	const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
		new Set()
	);
	const [selectedColorSizes, setSelectedColorSizes] = useState<
		Map<string, Set<string>>
	>(new Map());
	const [stockOperation, setStockOperation] = useState<
		"set" | "add" | "subtract"
	>("set");
	const [stockValue, setStockValue] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
	const [showColorSizeSelector, setShowColorSizeSelector] = useState(false);

	// Charger les catégories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await client.fetch(`
          *[_type == "category"] | order(name asc) {
            _id,
            name
          }
        `);
				setCategories(data);
			} catch (error) {
				console.error("Erreur lors du chargement des catégories:", error);
				toast.push({
					status: "error",
					title: "Erreur",
					description: "Impossible de charger les catégories",
				});
			}
		};
		fetchCategories();
	}, [client, toast]);

	// Charger les produits détaillés selon la catégorie sélectionnée
	useEffect(() => {
		if (!selectedCategory) {
			setProductDetails([]);
			return;
		}

		const fetchProductDetails = async () => {
			setLoading(true);
			try {
				const data = await client.fetch(
					`
          *[_type == "productDetail" && product->category._ref == $categoryId] | order(name asc) {
            _id,
            name,
            product-> {
              _id,
              name,
              category-> {
                _id,
                name
              }
            },
            colors[] {
              name,
              sizes[] {
                size,
                available,
                quantity
              },
              available
            }
          }
        `,
					{ categoryId: selectedCategory }
				);
				setProductDetails(data);
				setSelectedProducts(new Set());
			} catch (error) {
				console.error("Erreur lors du chargement des produits:", error);
				toast.push({
					status: "error",
					title: "Erreur",
					description: "Impossible de charger les produits",
				});
			} finally {
				setLoading(false);
			}
		};
		fetchProductDetails();
	}, [selectedCategory, client, toast]);

	// Sélectionner/désélectionner tous les produits
	const toggleAllProducts = () => {
		if (selectedProducts.size === productDetails.length) {
			setSelectedProducts(new Set());
		} else {
			setSelectedProducts(new Set(productDetails.map((p) => p._id)));
		}
	};

	// Sélectionner/désélectionner un produit
	const toggleProduct = (productId: string) => {
		const newSelected = new Set(selectedProducts);
		if (newSelected.has(productId)) {
			newSelected.delete(productId);
			// Supprimer aussi les sélections de couleurs/tailles pour ce produit
			const newColorSizes = new Map(selectedColorSizes);
			newColorSizes.delete(productId);
			setSelectedColorSizes(newColorSizes);
		} else {
			newSelected.add(productId);
		}
		setSelectedProducts(newSelected);
	};

	// Sélectionner/désélectionner une couleur/taille pour un produit
	const toggleColorSize = (
		productId: string,
		colorName: string,
		sizeName: string
	) => {
		const key = `${productId}-${colorName}-${sizeName}`;
		const newColorSizes = new Map(selectedColorSizes);

		if (!newColorSizes.has(productId)) {
			newColorSizes.set(productId, new Set());
		}

		const productSelections = newColorSizes.get(productId)!;
		if (productSelections.has(key)) {
			productSelections.delete(key);
		} else {
			productSelections.add(key);
		}

		setSelectedColorSizes(newColorSizes);
	};

	// Sélectionner/désélectionner toutes les tailles d'une couleur
	const toggleAllSizesForColor = (
		productId: string,
		colorName: string,
		sizes: any[]
	) => {
		const newColorSizes = new Map(selectedColorSizes);

		if (!newColorSizes.has(productId)) {
			newColorSizes.set(productId, new Set());
		}

		const productSelections = newColorSizes.get(productId)!;
		const colorKeys = sizes.map(
			(size) => `${productId}-${colorName}-${size.size}`
		);

		// Vérifier si toutes les tailles de cette couleur sont sélectionnées
		const allSelected = colorKeys.every((key) => productSelections.has(key));

		if (allSelected) {
			// Désélectionner toutes les tailles de cette couleur
			colorKeys.forEach((key) => productSelections.delete(key));
		} else {
			// Sélectionner toutes les tailles de cette couleur
			colorKeys.forEach((key) => productSelections.add(key));
		}

		setSelectedColorSizes(newColorSizes);
	};

	// Sélectionner/désélectionner toutes les couleurs/tailles d'un produit
	const toggleAllColorSizesForProduct = (productId: string, colors: any[]) => {
		const newColorSizes = new Map(selectedColorSizes);

		if (!newColorSizes.has(productId)) {
			newColorSizes.set(productId, new Set());
		}

		const productSelections = newColorSizes.get(productId)!;
		const allKeys: string[] = [];

		colors.forEach((color) => {
			color.sizes.forEach((size: any) => {
				allKeys.push(`${productId}-${color.name}-${size.size}`);
			});
		});

		// Vérifier si toutes les couleurs/tailles sont sélectionnées
		const allSelected = allKeys.every((key) => productSelections.has(key));

		if (allSelected) {
			// Désélectionner toutes les couleurs/tailles
			allKeys.forEach((key) => productSelections.delete(key));
		} else {
			// Sélectionner toutes les couleurs/tailles
			allKeys.forEach((key) => productSelections.add(key));
		}

		setSelectedColorSizes(newColorSizes);
	};

	// Calculer le total des stocks pour un produit
	const getTotalStock = (product: ProductDetail) => {
		return product.colors.reduce((total, color) => {
			return (
				total +
				color.sizes.reduce((colorTotal, size) => {
					return colorTotal + size.quantity;
				}, 0)
			);
		}, 0);
	};

	// Vérifier si un produit a un stock faible
	const hasLowStock = (product: ProductDetail) => {
		return product.colors.some((color) =>
			color.sizes.some((size) => size.quantity > 0 && size.quantity < 5)
		);
	};

	// Appliquer les modifications de stock
	const applyStockChanges = async () => {
		if (selectedProducts.size === 0) {
			toast.push({
				status: "warning",
				title: "Aucun produit sélectionné",
				description: "Veuillez sélectionner au moins un produit",
			});
			return;
		}

		if (!stockValue) {
			toast.push({
				status: "warning",
				title: "Valeur manquante",
				description: "Veuillez saisir une valeur de stock",
			});
			return;
		}

		const value = parseInt(stockValue);
		if (isNaN(value) || value < 0) {
			toast.push({
				status: "warning",
				title: "Valeur invalide",
				description: "La valeur de stock doit être un nombre positif ou zéro",
			});
			return;
		}

		// Préparer les mises à jour
		const updates: StockUpdate[] = [];
		selectedProducts.forEach((productId) => {
			const product = productDetails.find((p) => p._id === productId);
			if (product) {
				const productSelections = selectedColorSizes.get(productId);
				const hasSpecificSelections =
					productSelections && productSelections.size > 0;

				product.colors.forEach((color, colorIndex) => {
					color.sizes.forEach((size, sizeIndex) => {
						const key = `${productId}-${color.name}-${size.size}`;

						// Si des sélections spécifiques existent, ne modifier que celles-ci
						// Sinon, modifier toutes les couleurs/tailles du produit
						if (hasSpecificSelections) {
							if (!productSelections!.has(key)) {
								return; // Skip cette couleur/taille
							}
						}

						let newQuantity = size.quantity;

						switch (stockOperation) {
							case "set":
								newQuantity = value;
								break;
							case "add":
								newQuantity = size.quantity + value;
								break;
							case "subtract":
								newQuantity = Math.max(0, size.quantity - value);
								break;
						}

						updates.push({
							productDetailId: productId,
							colorIndex,
							sizeIndex,
							newQuantity,
						});
					});
				});
			}
		});

		if (updates.length === 0) {
			toast.push({
				status: "warning",
				title: "Aucune modification à appliquer",
				description:
					"Aucune couleur/taille sélectionnée pour les produits choisis",
			});
			return;
		}

		setStockUpdates(updates);
		setShowConfirmDialog(true);
	};

	// Confirmer et appliquer les modifications
	const confirmApplyStockChanges = async () => {
		setUpdating(true);
		setShowConfirmDialog(false);

		try {
			// Grouper les mises à jour par produit pour éviter les conflits
			const updatesByProduct = new Map<string, StockUpdate[]>();
			stockUpdates.forEach((update) => {
				if (!updatesByProduct.has(update.productDetailId)) {
					updatesByProduct.set(update.productDetailId, []);
				}
				updatesByProduct.get(update.productDetailId)!.push(update);
			});

			const updatePromises = Array.from(updatesByProduct.entries()).map(
				([productId, updates]) => {
					const product = productDetails.find((p) => p._id === productId);
					if (!product) {
						return Promise.resolve();
					}

					// Créer une copie profonde des couleurs
					const updatedColors = product.colors.map((color) => ({
						...color,
						sizes: color.sizes.map((size) => ({ ...size })),
					}));

					// Appliquer toutes les modifications pour ce produit
					updates.forEach((update) => {
						updatedColors[update.colorIndex].sizes[update.sizeIndex] = {
							...updatedColors[update.colorIndex].sizes[update.sizeIndex],
							quantity: update.newQuantity,
							available: update.newQuantity > 0,
						};
					});

					return client
						.patch(productId)
						.set({ colors: updatedColors })
						.commit();
				}
			);

			await Promise.all(updatePromises);

			toast.push({
				status: "success",
				title: "Stock mis à jour",
				description: `${selectedProducts.size} produit(s) mis à jour avec succès`,
			});

			// Recharger les produits pour voir les changements
			const data = await client.fetch(
				`
        *[_type == "productDetail" && product->category._ref == $categoryId] | order(name asc) {
          _id,
          name,
          product-> {
            _id,
            name,
            category-> {
              _id,
              name
            }
          },
          colors[] {
            name,
            sizes[] {
              size,
              available,
              quantity
            },
            available
          }
        }
      `,
				{ categoryId: selectedCategory }
			);
			setProductDetails(data);
			setSelectedProducts(new Set());
			setStockUpdates([]);
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			toast.push({
				status: "error",
				title: "Erreur",
				description: "Impossible de mettre à jour le stock",
			});
		} finally {
			setUpdating(false);
		}
	};

	// Réinitialiser le stock à zéro
	const resetStockToZero = async () => {
		if (selectedProducts.size === 0) {
			toast.push({
				status: "warning",
				title: "Aucun produit sélectionné",
				description: "Veuillez sélectionner au moins un produit",
			});
			return;
		}

		setUpdating(true);

		try {
			const updatePromises = Array.from(selectedProducts).map((productId) => {
				const product = productDetails.find((p) => p._id === productId);
				if (!product) return Promise.resolve();

				const updatedColors = product.colors.map((color) => ({
					...color,
					sizes: color.sizes.map((size) => ({
						...size,
						quantity: 0,
						available: false,
					})),
				}));

				return client.patch(productId).set({ colors: updatedColors }).commit();
			});

			await Promise.all(updatePromises);

			toast.push({
				status: "success",
				title: "Stock réinitialisé",
				description: `${selectedProducts.size} produit(s) mis à jour avec succès`,
			});

			// Recharger les produits
			const data = await client.fetch(
				`
        *[_type == "productDetail" && product->category._ref == $categoryId] | order(name asc) {
          _id,
          name,
          product-> {
            _id,
            name,
            category-> {
              _id,
              name
            }
          },
          colors[] {
            name,
            sizes[] {
              size,
              available,
              quantity
            },
            available
          }
        }
      `,
				{ categoryId: selectedCategory }
			);
			setProductDetails(data);
			setSelectedProducts(new Set());
		} catch (error) {
			console.error("Erreur lors de la réinitialisation:", error);
			toast.push({
				status: "error",
				title: "Erreur",
				description: "Impossible de réinitialiser le stock",
			});
		} finally {
			setUpdating(false);
		}
	};

	return (
		<Card padding={4}>
			<Stack space={4}>
				<Text size={4} weight="bold">
					📦 Gestion du Stock en Masse
				</Text>

				<Text size={2} muted>
					Sélectionnez une catégorie, choisissez les produits et modifiez le
					stock par couleur/taille.
				</Text>

				{/* Sélection de la catégorie */}
				<Card padding={3} tone="primary">
					<Stack space={3}>
						<Text size={2} weight="medium">
							1. Sélectionner une catégorie
						</Text>
						<Select
							value={selectedCategory}
							onChange={(event) =>
								setSelectedCategory(event.currentTarget.value)
							}
						>
							<option value="">Choisir une catégorie...</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</Select>
					</Stack>
				</Card>

				{/* Liste des produits */}
				{selectedCategory && (
					<Card padding={3} tone="default">
						<Stack space={3}>
							<Flex align="center" justify="space-between">
								<Text size={2} weight="medium">
									2. Sélectionner les produits
								</Text>
								{productDetails.length > 0 && (
									<Button
										mode="ghost"
										size={1}
										text={
											selectedProducts.size === productDetails.length
												? "Tout désélectionner"
												: "Tout sélectionner"
										}
										onClick={toggleAllProducts}
									/>
								)}
							</Flex>

							{loading ? (
								<Flex align="center" justify="center" padding={4}>
									<Spinner />
									<Text size={2} muted style={{ marginLeft: 8 }}>
										Chargement des produits...
									</Text>
								</Flex>
							) : productDetails.length === 0 ? (
								<Text size={2} muted>
									Aucun produit trouvé dans cette catégorie.
								</Text>
							) : (
								<Stack space={2}>
									{productDetails.map((product) => {
										const totalStock = getTotalStock(product);
										const isLowStock = hasLowStock(product);

										return (
											<Card key={product._id} padding={2} tone="default">
												<Flex align="center" gap={3}>
													<Checkbox
														checked={selectedProducts.has(product._id)}
														onChange={() => toggleProduct(product._id)}
													/>
													<Text size={2} weight="medium" style={{ flex: 1 }}>
														{product.name}
													</Text>
													{selectedProducts.has(product._id) && (
														<Button
															mode="ghost"
															size={0}
															text="Tout sélectionner"
															onClick={() =>
																toggleAllColorSizesForProduct(
																	product._id,
																	product.colors
																)
															}
														/>
													)}
													{isLowStock && (
														<Badge tone="caution" style={{ marginRight: 8 }}>
															⚠️ Stock faible
														</Badge>
													)}
													<Badge
														tone={totalStock > 0 ? "positive" : "critical"}
													>
														Total: {totalStock}
													</Badge>
												</Flex>

												{/* Détail des couleurs et tailles */}
												<Stack
													space={1}
													style={{ marginTop: 8, marginLeft: 24 }}
												>
													{product.colors.map((color, colorIndex) => {
														const productSelections = selectedColorSizes.get(
															product._id
														);
														const colorKeys = color.sizes.map(
															(size) =>
																`${product._id}-${color.name}-${size.size}`
														);
														const allSizesSelected = productSelections
															? colorKeys.every((key) =>
																	productSelections.has(key)
																)
															: false;

														return (
															<div key={colorIndex}>
																<Flex
																	align="center"
																	gap={2}
																	style={{ marginBottom: 4 }}
																>
																	<Checkbox
																		checked={allSizesSelected}
																		onChange={() =>
																			toggleAllSizesForColor(
																				product._id,
																				color.name,
																				color.sizes
																			)
																		}
																	/>
																	<Text
																		size={1}
																		weight="medium"
																		style={{ color: "#666" }}
																	>
																		{color.name}:
																	</Text>
																</Flex>
																<div
																	style={{
																		marginLeft: 24,
																		display: "flex",
																		gap: 8,
																		flexWrap: "wrap",
																	}}
																>
																	{color.sizes.map((size, sizeIndex) => {
																		const key = `${product._id}-${color.name}-${size.size}`;
																		const isSelected = productSelections
																			? productSelections.has(key)
																			: false;

																		return (
																			<Flex
																				key={sizeIndex}
																				align="center"
																				gap={1}
																			>
																				<Checkbox
																					checked={isSelected}
																					onChange={() =>
																						toggleColorSize(
																							product._id,
																							color.name,
																							size.size
																						)
																					}
																				/>
																				<Badge
																					tone={
																						size.quantity < 5 &&
																						size.quantity > 0
																							? "caution"
																							: size.quantity > 0
																								? "positive"
																								: "critical"
																					}
																					size={0}
																				>
																					{size.size}: {size.quantity}
																				</Badge>
																			</Flex>
																		);
																	})}
																</div>
															</div>
														);
													})}
												</Stack>
											</Card>
										);
									})}
								</Stack>
							)}
						</Stack>
					</Card>
				)}

				{/* Configuration des modifications de stock */}
				{selectedCategory && selectedProducts.size > 0 && (
					<Card padding={3} tone="caution">
						<Stack space={3}>
							<Text size={2} weight="medium">
								3. Configurer les modifications de stock
							</Text>

							<Text size={1} muted>
								💡 Astuce : Sélectionnez des couleurs/tailles spécifiques pour
								modifier seulement celles-ci, ou laissez vide pour modifier
								toutes les couleurs/tailles des produits sélectionnés.
							</Text>

							<Select
								value={stockOperation}
								onChange={(event) =>
									setStockOperation(
										event.currentTarget.value as "set" | "add" | "subtract"
									)
								}
							>
								<option value="set">Définir à (remplacer la quantité)</option>
								<option value="add">Ajouter (augmenter la quantité)</option>
								<option value="subtract">
									Soustraire (diminuer la quantité)
								</option>
							</Select>

							<TextInput
								placeholder={
									stockOperation === "set"
										? "Ex: 10 pour définir à 10"
										: stockOperation === "add"
											? "Ex: 5 pour ajouter 5"
											: "Ex: 3 pour soustraire 3"
								}
								value={stockValue}
								onChange={(event) => setStockValue(event.currentTarget.value)}
								type="number"
								min="0"
								step="1"
							/>

							<Flex gap={2}>
								<Button
									mode="default"
									tone="positive"
									text={`Appliquer à ${selectedProducts.size} produit(s)`}
									onClick={applyStockChanges}
									disabled={updating || !stockValue}
								/>
								<Button
									mode="ghost"
									tone="critical"
									text="Réinitialiser à zéro"
									onClick={resetStockToZero}
									disabled={updating}
								/>
							</Flex>

							{/* Afficher le nombre de couleurs/tailles sélectionnées */}
							{(() => {
								const totalSelections = Array.from(
									selectedColorSizes.values()
								).reduce((total, selections) => total + selections.size, 0);

								if (totalSelections > 0) {
									return (
										<Text size={1} style={{ color: "#0066cc" }}>
											✅ {totalSelections} couleur(s)/taille(s) spécifiquement
											sélectionnée(s)
										</Text>
									);
								}
								return (
									<Text size={1} style={{ color: "#666" }}>
										📝 Toutes les couleurs/tailles des produits sélectionnés
										seront modifiées
									</Text>
								);
							})()}
						</Stack>
					</Card>
				)}

				{/* Dialog de confirmation */}
				{showConfirmDialog && (
					<Dialog
						header="Confirmer les modifications de stock"
						id="confirm-stock"
						onClose={() => setShowConfirmDialog(false)}
						width={1}
					>
						<Card padding={4}>
							<Stack space={3}>
								<Text>
									Êtes-vous sûr de vouloir appliquer cette modification à{" "}
									{selectedProducts.size} produit(s) ?
								</Text>
								<Text size={1} muted>
									Opération:{" "}
									{stockOperation === "set"
										? "Définir à"
										: stockOperation === "add"
											? "Ajouter"
											: "Soustraire"}
									<br />
									Valeur: {stockValue}
									<br />
									Nombre de modifications: {stockUpdates.length}
								</Text>
								<Flex gap={2} justify="flex-end">
									<Button
										mode="ghost"
										text="Annuler"
										onClick={() => setShowConfirmDialog(false)}
									/>
									<Button
										mode="default"
										tone="positive"
										text="Confirmer"
										onClick={confirmApplyStockChanges}
										loading={updating}
									/>
								</Flex>
							</Stack>
						</Card>
					</Dialog>
				)}
			</Stack>
		</Card>
	);
}
