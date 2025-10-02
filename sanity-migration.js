// Script de migration pour ajouter les _key manquantes aux produits détaillés
// À exécuter dans le script Sanity ou via groq-cli

// Requête GROQ pour mettre à jour tous les productDetail avec des _key manquantes
const query = `
*[_type == "productDetail"] {
  _id,
  name,
  colors
}
`;

// Script de transformation (à adapter selon votre environnement)
async function addMissingKeys() {
	try {
		// Récupérer tous les produits détaillés
		const products = await client.fetch(query);

		for (const product of products) {
			if (product.colors && Array.isArray(product.colors)) {
				let hasChanges = false;
				const updatedColors = product.colors.map((color, index) => {
					if (!color._key) {
						hasChanges = true;
						return {
							...color,
							_key: `${color.name || "color"}-${index}-${Date.now().toString().slice(-6)}`,
						};
					}
					return color;
				});

				if (hasChanges) {
					console.log(`Mise à jour du produit: ${product.name}`);

					// Mettre à jour les tailles également
					const updatedColorsWithSizes = updatedColors.map((color) => {
						if (color.sizes && Array.isArray(color.sizes)) {
							const updatedSizes = color.sizes.map((size, sizeIndex) => {
								if (!size._key) {
									return {
										...size,
										_key: `${size.size || "size"}-${sizeIndex}-${Date.now().toString().slice(-6)}`,
									};
								}
								return size;
							});
							return {
								...color,
								sizes: updatedSizes,
							};
						}
						return color;
					});

					await client
						.patch(product._id)
						.set({ colors: updatedColorsWithSizes })
						.commit();
				}
			}
		}

		console.log("Migration terminée!");
	} catch (error) {
		console.error("Erreur lors de la migration:", error);
	}
}

// Exporter la fonction pour usage externe
module.exports = { addMissingKeys, query };
