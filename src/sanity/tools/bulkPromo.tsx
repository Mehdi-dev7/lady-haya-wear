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

interface Product {
	_id: string;
	name: string;
	category: {
		_id: string;
		name: string;
	};
	badges?: {
		isPromo?: boolean;
		promoType?: string;
		promoPercentage?: number;
		originalPrice?: number;
	};
}

interface Category {
	_id: string;
	name: string;
}

export default function BulkPromoTool() {
	const client = useClient({ apiVersion: "2023-01-01" });
	const schema = useSchema();
	const toast = useToast();

	const [categories, setCategories] = useState<Category[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
		new Set()
	);
	const [promoType, setPromoType] = useState<"percentage" | "originalPrice">(
		"percentage"
	);
	const [promoValue, setPromoValue] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

	// Charger les produits selon la catégorie sélectionnée
	useEffect(() => {
		if (!selectedCategory) {
			setProducts([]);
			return;
		}

		const fetchProducts = async () => {
			setLoading(true);
			try {
				const data = await client.fetch(
					`
          *[_type == "product" && category._ref == $categoryId] | order(name asc) {
            _id,
            name,
            category-> {
              _id,
              name
            },
            badges
          }
        `,
					{ categoryId: selectedCategory }
				);
				setProducts(data);
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
		fetchProducts();
	}, [selectedCategory, client, toast]);

	// Sélectionner/désélectionner tous les produits
	const toggleAllProducts = () => {
		if (selectedProducts.size === products.length) {
			setSelectedProducts(new Set());
		} else {
			setSelectedProducts(new Set(products.map((p) => p._id)));
		}
	};

	// Sélectionner/désélectionner un produit
	const toggleProduct = (productId: string) => {
		const newSelected = new Set(selectedProducts);
		if (newSelected.has(productId)) {
			newSelected.delete(productId);
		} else {
			newSelected.add(productId);
		}
		setSelectedProducts(newSelected);
	};

	// Appliquer les promotions
	const applyPromotions = async () => {
		if (selectedProducts.size === 0) {
			toast.push({
				status: "warning",
				title: "Aucun produit sélectionné",
				description: "Veuillez sélectionner au moins un produit",
			});
			return;
		}

		if (!promoValue) {
			toast.push({
				status: "warning",
				title: "Valeur manquante",
				description: "Veuillez saisir une valeur de promotion",
			});
			return;
		}

		const value = parseFloat(promoValue);
		if (isNaN(value) || value <= 0) {
			toast.push({
				status: "warning",
				title: "Valeur invalide",
				description: "La valeur de promotion doit être un nombre positif",
			});
			return;
		}

		if (promoType === "percentage" && value > 99) {
			toast.push({
				status: "warning",
				title: "Pourcentage invalide",
				description: "Le pourcentage ne peut pas dépasser 99%",
			});
			return;
		}

		setShowConfirmDialog(true);
	};

	// Confirmer et appliquer les promotions
	const confirmApplyPromotions = async () => {
		setUpdating(true);
		setShowConfirmDialog(false);

		try {
			const updates = Array.from(selectedProducts).map((productId) => {
				const updateData: any = {
					badges: {
						isPromo: true,
						promoType: promoType,
					},
				};

				if (promoType === "percentage") {
					updateData.badges.promoPercentage = parseFloat(promoValue);
				} else {
					updateData.badges.originalPrice = parseFloat(promoValue);
				}

				return client.patch(productId).set(updateData).commit();
			});

			await Promise.all(updates);

			toast.push({
				status: "success",
				title: "Promotions appliquées",
				description: `${selectedProducts.size} produit(s) mis à jour avec succès`,
			});

			// Recharger les produits pour voir les changements
			const data = await client.fetch(
				`
        *[_type == "product" && category._ref == $categoryId] | order(name asc) {
          _id,
          name,
          category-> {
            _id,
            name
          },
          badges
        }
      `,
				{ categoryId: selectedCategory }
			);
			setProducts(data);
			setSelectedProducts(new Set());
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			toast.push({
				status: "error",
				title: "Erreur",
				description: "Impossible d'appliquer les promotions",
			});
		} finally {
			setUpdating(false);
		}
	};

	// Supprimer les promotions
	const removePromotions = async () => {
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
			const updates = Array.from(selectedProducts).map((productId) => {
				return client
					.patch(productId)
					.set({
						badges: {
							isPromo: false,
							promoType: undefined,
							promoPercentage: undefined,
							originalPrice: undefined,
						},
					})
					.commit();
			});

			await Promise.all(updates);

			toast.push({
				status: "success",
				title: "Promotions supprimées",
				description: `${selectedProducts.size} produit(s) mis à jour avec succès`,
			});

			// Recharger les produits
			const data = await client.fetch(
				`
        *[_type == "product" && category._ref == $categoryId] | order(name asc) {
          _id,
          name,
          category-> {
            _id,
            name
          },
          badges
        }
      `,
				{ categoryId: selectedCategory }
			);
			setProducts(data);
			setSelectedProducts(new Set());
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			toast.push({
				status: "error",
				title: "Erreur",
				description: "Impossible de supprimer les promotions",
			});
		} finally {
			setUpdating(false);
		}
	};

	return (
		<Card padding={4}>
			<Stack space={4}>
				<Text size={4} weight="bold">
					🎯 Gestion des Promotions en Masse
				</Text>

				<Text size={2} muted>
					Sélectionnez une catégorie, choisissez les produits et définissez la
					promotion à appliquer.
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
								{products.length > 0 && (
									<Button
										mode="ghost"
										size={1}
										text={
											selectedProducts.size === products.length
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
							) : products.length === 0 ? (
								<Text size={2} muted>
									Aucun produit trouvé dans cette catégorie.
								</Text>
							) : (
								<Stack space={2}>
									{products.map((product) => (
										<Card key={product._id} padding={2} tone="default">
											<Flex align="center" gap={3}>
												<Checkbox
													checked={selectedProducts.has(product._id)}
													onChange={() => toggleProduct(product._id)}
												/>
												<Text size={2} weight="medium" style={{ flex: 1 }}>
													{product.name}
												</Text>
												{product.badges?.isPromo && (
													<Badge tone="positive">
														{product.badges.promoType === "percentage"
															? `-${product.badges.promoPercentage}%`
															: `Prix barré`}
													</Badge>
												)}
											</Flex>
										</Card>
									))}
								</Stack>
							)}
						</Stack>
					</Card>
				)}

				{/* Configuration de la promotion */}
				{selectedCategory && selectedProducts.size > 0 && (
					<Card padding={3} tone="caution">
						<Stack space={3}>
							<Text size={2} weight="medium">
								3. Configurer la promotion
							</Text>

							<Select
								value={promoType}
								onChange={(event) =>
									setPromoType(
										event.currentTarget.value as "percentage" | "originalPrice"
									)
								}
							>
								<option value="percentage">Pourcentage de réduction (%)</option>
								<option value="originalPrice">
									Prix barré (prix original en €)
								</option>
							</Select>

							<TextInput
								placeholder={
									promoType === "percentage"
										? "Ex: 20 pour -20%"
										: "Ex: 50 pour 50€"
								}
								value={promoValue}
								onChange={(event) => setPromoValue(event.currentTarget.value)}
								type="number"
								min="0"
								max={promoType === "percentage" ? "99" : undefined}
								step={promoType === "percentage" ? "1" : "0.01"}
							/>

							<Flex gap={2}>
								<Button
									mode="default"
									tone="positive"
									text={`Appliquer à ${selectedProducts.size} produit(s)`}
									onClick={applyPromotions}
									disabled={updating || !promoValue}
								/>
								<Button
									mode="ghost"
									tone="critical"
									text="Supprimer les promotions"
									onClick={removePromotions}
									disabled={updating}
								/>
							</Flex>
						</Stack>
					</Card>
				)}

				{/* Dialog de confirmation */}
				{showConfirmDialog && (
					<Dialog
						header="Confirmer l'application des promotions"
						id="confirm-promo"
						onClose={() => setShowConfirmDialog(false)}
						width={1}
					>
						<Card padding={4}>
							<Stack space={3}>
								<Text>
									Êtes-vous sûr de vouloir appliquer cette promotion à{" "}
									{selectedProducts.size} produit(s) ?
								</Text>
								<Text size={1} muted>
									Type:{" "}
									{promoType === "percentage" ? "Pourcentage" : "Prix barré"}
									<br />
									Valeur: {promoValue}
									{promoType === "percentage" ? "%" : "€"}
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
										onClick={confirmApplyPromotions}
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
