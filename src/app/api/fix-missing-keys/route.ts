import { sanityClient } from "@/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		console.log("🔧 Début de la correction des clés manquantes...");

		// Récupérer tous les produits détaillés
		const products = await sanityClient.fetch(`
			*[_type == "productDetail"] {
				_id,
				name,
				colors
			}
		`);

		console.log(`📝 ${products.length} produits à vérifier`);

		let fixedCount = 0;

		for (const product of products) {
			if (product.colors && Array.isArray(product.colors)) {
				let hasChanges = false;

				// Vérifier et corriger les couleurs
				const updatedColors = product.colors.map(
					(color: any, index: number) => {
						if (!color._key) {
							hasChanges = true;
							return {
								...color,
								_key: `${color.name || "color"}-${index}-${Date.now().toString().slice(-6)}`,
							};
						}

						// Vérifier et corriger les tailles
						if (color.sizes && Array.isArray(color.sizes)) {
							const updatedSizes = color.sizes.map(
								(size: any, sizeIndex: number) => {
									if (!size._key) {
										hasChanges = true;
										return {
											...size,
											_key: `${size.size || "size"}-${sizeIndex}-${Date.now().toString().slice(-6)}`,
										};
									}
									return size;
								}
							);

							return {
								...color,
								sizes: updatedSizes,
							};
						}

						return color;
					}
				);

				if (hasChanges) {
					console.log(`🔧 Mise à jour du produit: ${product.name}`);

					await sanityClient
						.patch(product._id)
						.set({ colors: updatedColors })
						.commit();

					fixedCount++;
				}
			}
		}

		console.log(`✅ Correction terminée! ${fixedCount} produits corrigés`);

		return NextResponse.json({
			success: true,
			message: `${fixedCount} produits corrigés avec succès`,
			fixedCount,
		});
	} catch (error) {
		console.error("❌ Erreur lors de la correction:", error);

		return NextResponse.json(
			{
				error: "Erreur lors de la correction des clés manquantes",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}
