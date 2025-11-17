import { sanityClient } from "./sanity";

/**
 * Gestion des stocks Sanity
 *
 * Ce module gère la synchronisation des stocks entre Sanity (CMS) et les commandes
 * - Vérification de disponibilité
 * - Décrémentation lors d'une commande
 * - Incrémentation lors d'une annulation/remboursement
 */

export interface CartItem {
	productId?: string;
	slug?: string;
	name: string;
	color: string;
	size: string;
	quantity: number;
	price: number;
}

export interface StockCheckResult {
	available: boolean;
	productName: string;
	color: string;
	size: string;
	requested: number;
	available_quantity: number;
	message?: string;
}

/**
 * Vérifie la disponibilité du stock pour un ensemble d'articles
 *
 * @param items - Articles du panier à vérifier
 * @returns Array de résultats de vérification
 *
 * @example
 * const results = await checkStockAvailability(cartItems);
 * const unavailable = results.filter(r => !r.available);
 * if (unavailable.length > 0) {
 *   throw new Error('Stock insuffisant');
 * }
 */
export async function checkStockAvailability(
	items: CartItem[]
): Promise<StockCheckResult[]> {
	const results: StockCheckResult[] = [];

	for (const item of items) {
		try {
			// Récupérer le produit depuis Sanity (par slug ou productId)
			let product;

			if (item.slug) {
				product = await sanityClient.fetch(
					`*[_type == "productUnified" && slug.current == $slug][0] {
	          _id,
	          name,
	          colors[] {
	            name,
	            sizes[] {
	              size,
	              quantity
	            }
	          }
	        }`,
					{ slug: item.slug }
				);
			} else if (item.productId) {
				product = await sanityClient.fetch(
					`*[_type == "productUnified" && _id == $productId][0] {
	          _id,
	          name,
	          colors[] {
	            name,
	            sizes[] {
	              size,
	              quantity
	            }
	          }
	        }`,
					{ productId: item.productId }
				);
			}

			if (!product) {
				results.push({
					available: false,
					productName: item.name,
					color: item.color,
					size: item.size,
					requested: item.quantity,
					available_quantity: 0,
					message: "Produit non trouvé",
				});
				continue;
			}

			// Trouver la variante de couleur
			const colorVariant = product.colors?.find(
				(c: any) => c.name === item.color
			);

			if (!colorVariant) {
				results.push({
					available: false,
					productName: product.name,
					color: item.color,
					size: item.size,
					requested: item.quantity,
					available_quantity: 0,
					message: `Couleur "${item.color}" non disponible`,
				});
				continue;
			}

			// Trouver la variante de taille
			const sizeVariant = colorVariant.sizes?.find(
				(s: any) => s.size === item.size
			);

			if (!sizeVariant) {
				results.push({
					available: false,
					productName: product.name,
					color: item.color,
					size: item.size,
					requested: item.quantity,
					available_quantity: 0,
					message: `Taille "${item.size}" non disponible`,
				});
				continue;
			}

			// Vérifier la quantité disponible
			const availableQty = sizeVariant.quantity || 0;
			const isAvailable = availableQty >= item.quantity;

			results.push({
				available: isAvailable,
				productName: product.name,
				color: item.color,
				size: item.size,
				requested: item.quantity,
				available_quantity: availableQty,
				message: isAvailable
					? undefined
					: `Stock insuffisant (${availableQty} disponible${availableQty > 1 ? "s" : ""})`,
			});
		} catch (error) {
			console.error("Erreur vérification stock:", error);
			results.push({
				available: false,
				productName: item.name,
				color: item.color,
				size: item.size,
				requested: item.quantity,
				available_quantity: 0,
				message: "Erreur lors de la vérification du stock",
			});
		}
	}

	return results;
}

/**
 * Décrémente le stock dans Sanity après une commande validée
 *
 * @param items - Articles commandés
 * @throws Error si le stock est insuffisant ou si la mise à jour échoue
 *
 * @example
 * try {
 *   await decrementStock(orderItems);
 *   console.log('Stock mis à jour avec succès');
 * } catch (error) {
 *   console.error('Échec mise à jour stock:', error);
 * }
 */
export async function decrementStock(items: CartItem[]): Promise<void> {
	// Vérifier d'abord la disponibilité
	const stockCheck = await checkStockAvailability(items);
	const unavailable = stockCheck.filter((r) => !r.available);

	if (unavailable.length > 0) {
		const messages = unavailable.map(
			(r) =>
				`${r.productName} (${r.color} - ${r.size}): ${r.message || "Stock insuffisant"}`
		);
		throw new Error(
			`Stock insuffisant pour les articles suivants:\n${messages.join("\n")}`
		);
	}

	// Décrémenter le stock pour chaque article
	for (const item of items) {
		try {
			// Récupérer le produit complet (par slug ou productId)
			let product;

			if (item.slug) {
				product = await sanityClient.fetch(
					`*[_type == "productUnified" && slug.current == $slug][0] {
	          _id,
	          colors[] {
	            name,
	            sizes[] {
	              size,
	              quantity
	            }
	          }
	        }`,
					{ slug: item.slug }
				);
			} else if (item.productId) {
				product = await sanityClient.fetch(
					`*[_type == "productUnified" && _id == $productId][0] {
	          _id,
	          colors[] {
	            name,
	            sizes[] {
	              size,
	              quantity
	            }
	          }
	        }`,
					{ productId: item.productId }
				);
			}

			if (!product) {
				throw new Error(`Produit non trouvé: ${item.slug || item.productId}`);
			}

			// Trouver les indices de la variante
			const colorIndex = product.colors.findIndex(
				(c: any) => c.name === item.color
			);
			if (colorIndex === -1) {
				throw new Error(`Couleur non trouvée: ${item.color}`);
			}

			const sizeIndex = product.colors[colorIndex].sizes.findIndex(
				(s: any) => s.size === item.size
			);
			if (sizeIndex === -1) {
				throw new Error(`Taille non trouvée: ${item.size}`);
			}

			// Calculer la nouvelle quantité
			const currentQty = product.colors[colorIndex].sizes[sizeIndex].quantity;
			const newQty = currentQty - item.quantity;

			if (newQty < 0) {
				throw new Error(
					`Stock insuffisant pour ${item.name} (${item.color} - ${item.size})`
				);
			}

			// Mettre à jour le stock dans Sanity
			await sanityClient
				.patch(product._id)
				.set({
					[`colors[${colorIndex}].sizes[${sizeIndex}].quantity`]: newQty,
				})
				.commit();

			console.log(
				`✅ Stock décrémenté: ${item.name} (${item.color} - ${item.size}): ${currentQty} → ${newQty}`
			);
		} catch (error) {
			console.error(
				`Erreur décrémentation stock pour ${item.name}:`,
				error
			);
			throw error;
		}
	}
}

/**
 * Incrémente le stock dans Sanity (annulation/remboursement)
 *
 * @param items - Articles à remettre en stock
 *
 * @example
 * await incrementStock(cancelledOrderItems);
 */
export async function incrementStock(items: CartItem[]): Promise<void> {
	for (const item of items) {
		try {
			// Récupérer le produit complet (par slug ou par productId)
			let product;

			if (item.slug) {
				product = await sanityClient.fetch(
					`*[_type == "productUnified" && slug.current == $slug][0] {
	          _id,
	          colors[] {
	            name,
	            sizes[] {
	              size,
	              quantity
	            }
	          }
	        }`,
					{ slug: item.slug }
				);
			} else if (item.productId) {
				product = await sanityClient.fetch(
					`*[_type == "productUnified" && _id == $productId][0] {
	          _id,
	          colors[] {
	            name,
	            sizes[] {
	              size,
	              quantity
	            }
	          }
	        }`,
					{ productId: item.productId }
				);
			}

			if (!product) {
				console.warn(
					`Produit non trouvé pour incrémentation: ${item.slug || item.productId}`
				);
				continue;
			}

			// Trouver les indices de la variante
			const colorIndex = product.colors.findIndex(
				(c: any) => c.name === item.color
			);
			if (colorIndex === -1) {
				console.warn(`Couleur non trouvée: ${item.color}`);
				continue;
			}

			const sizeIndex = product.colors[colorIndex].sizes.findIndex(
				(s: any) => s.size === item.size
			);
			if (sizeIndex === -1) {
				console.warn(`Taille non trouvée: ${item.size}`);
				continue;
			}

			// Calculer la nouvelle quantité
			const currentQty = product.colors[colorIndex].sizes[sizeIndex].quantity;
			const newQty = currentQty + item.quantity;

			// Mettre à jour le stock dans Sanity
			await sanityClient
				.patch(product._id)
				.set({
					[`colors[${colorIndex}].sizes[${sizeIndex}].quantity`]: newQty,
				})
				.commit();

			console.log(
				`✅ Stock incrémenté: ${item.name} (${item.color} - ${item.size}): ${currentQty} → ${newQty}`
			);
		} catch (error) {
			console.error(`Erreur incrémentation stock pour ${item.name}:`, error);
			// Ne pas throw pour permettre l'incrémentation des autres items
		}
	}
}

/**
 * Récupère le stock actuel d'un produit spécifique
 *
 * @param slug - Slug du produit
 * @param color - Couleur
 * @param size - Taille
 * @returns Quantité disponible ou null si non trouvé
 */
export async function getCurrentStock(
	slug: string,
	color: string,
	size: string
): Promise<number | null> {
	try {
		const product = await sanityClient.fetch(
			`*[_type == "productUnified" && slug.current == $slug][0] {
        colors[] {
          name,
          sizes[] {
            size,
            quantity
          }
        }
      }`,
			{ slug }
		);

		if (!product) return null;

		const colorVariant = product.colors?.find((c: any) => c.name === color);
		if (!colorVariant) return null;

		const sizeVariant = colorVariant.sizes?.find((s: any) => s.size === size);
		if (!sizeVariant) return null;

		return sizeVariant.quantity || 0;
	} catch (error) {
		console.error("Erreur récupération stock:", error);
		return null;
	}
}
