import { defineField, defineType } from "sanity";

export default defineType({
	name: "productDetail",
	title: "Fiche Produit Détaillée",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Nom du produit",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "product",
			title: "Produit associé",
			type: "reference",
			to: [{ type: "product" }],
			description: "Sélectionnez le produit que vous voulez détailler",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description complète",
			type: "text",
			rows: 6,
			description: "Description détaillée du produit",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "price",
			title: "Prix actuel (€)",
			type: "number",
			validation: (Rule) => Rule.required().positive(),
		}),
		defineField({
			name: "originalPrice",
			title: "Prix original (€)",
			type: "number",
			description: "Prix original pour les promotions",
			validation: (Rule) => Rule.positive(),
		}),
		defineField({
			name: "colors",
			title: "Couleurs disponibles",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "name",
							title: "Nom de la couleur",
							type: "string",
							validation: (Rule) => Rule.required(),
						},
						{
							name: "hexCode",
							title: "Code couleur (HEX)",
							type: "string",
							description: "Ex: #FF0000 pour rouge",
							validation: (Rule) => Rule.required().regex(/^#[0-9A-F]{6}$/i),
						},
						{
							name: "mainImage",
							title: "Image principale de cette couleur",
							type: "image",
							options: {
								hotspot: true,
							},
							fields: [
								{
									name: "alt",
									title: "Texte alternatif",
									type: "string",
									validation: (Rule) => Rule.required(),
								},
							],
							validation: (Rule) => Rule.required(),
						},
						{
							name: "additionalImages",
							title: "Images supplémentaires pour cette couleur",
							type: "array",
							of: [
								{
									type: "image",
									options: {
										hotspot: true,
									},
									fields: [
										{
											name: "alt",
											title: "Texte alternatif",
											type: "string",
											validation: (Rule) => Rule.required(),
										},
										{
											name: "caption",
											title: "Légende",
											type: "string",
										},
									],
								},
							],
							description:
								"Images supplémentaires pour cette couleur spécifique",
						},
						{
							name: "sizes",
							title: "Tailles disponibles pour cette couleur",
							type: "array",
							of: [
								{
									type: "object",
									fields: [
										{
											name: "size",
											title: "Taille",
											type: "string",
											options: {
												list: [
													{ title: "XS", value: "XS" },
													{ title: "S", value: "S" },
													{ title: "M", value: "M" },
													{ title: "L", value: "L" },
													{ title: "XL", value: "XL" },
													{ title: "XXL", value: "XXL" },
													{ title: "Unique", value: "Unique" },
												],
											},
										},
										{
											name: "available",
											title: "Disponible",
											type: "boolean",
											initialValue: true,
										},
										{
											name: "quantity",
											title: "Quantité pour cette taille",
											type: "number",
											initialValue: 0,
											validation: (Rule) => Rule.min(0),
										},
									],
									preview: {
										select: {
											title: "size",
											subtitle: "available",
											quantity: "quantity",
										},
										prepare(selection) {
											const { title, subtitle, quantity } = selection;
											return {
												title: `Taille ${title}`,
												subtitle: subtitle
													? `Disponible (${quantity})`
													: "Indisponible",
											};
										},
									},
								},
							],
							validation: (Rule) => Rule.required().min(1),
						},
						{
							name: "available",
							title: "Couleur disponible",
							type: "boolean",
							initialValue: true,
						},
					],
					preview: {
						select: {
							title: "name",
							subtitle: "available",
							media: "mainImage",
						},
						prepare(selection) {
							const { title, subtitle, media } = selection;
							return {
								title: title,
								subtitle: subtitle ? "Disponible" : "Indisponible",
								media: media,
							};
						},
					},
				},
			],
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: "galleryImages",
			title: "Images de la galerie générale",
			type: "array",
			of: [
				{
					type: "image",
					options: {
						hotspot: true,
					},
					fields: [
						{
							name: "alt",
							title: "Texte alternatif",
							type: "string",
							validation: (Rule) => Rule.required(),
						},
						{
							name: "caption",
							title: "Légende",
							type: "string",
						},
					],
				},
			],
			description:
				"Images supplémentaires pour la galerie générale du produit (non liées à une couleur spécifique)",
		}),
		defineField({
			name: "badges",
			title: "Badges",
			type: "object",
			fields: [
				defineField({
					name: "isNew",
					title: "Nouveau produit",
					type: "boolean",
					initialValue: false,
				}),
				defineField({
					name: "isPromo",
					title: "Produit en promotion",
					type: "boolean",
					initialValue: false,
				}),
				defineField({
					name: "promoPercentage",
					title: "Pourcentage de réduction",
					type: "number",
					hidden: ({ parent }) => !parent?.isPromo,
					validation: (Rule) =>
						Rule.min(1)
							.max(100)
							.warning("Le pourcentage doit être entre 1 et 100"),
				}),
			],
		}),
		defineField({
			name: "category",
			title: "Catégorie",
			type: "reference",
			to: [{ type: "category" }],
			description:
				"La collection sera automatiquement récupérée depuis le produit associé",
		}),
		defineField({
			name: "featured",
			title: "Mise en avant",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			of: [{ type: "string" }],
			options: {
				layout: "tags",
			},
		}),
	],
	orderings: [
		{
			title: "Date de création (plus récent)",
			name: "createdAtDesc",
			by: [{ field: "_createdAt", direction: "desc" }],
		},
		{
			title: "Prix croissant",
			name: "priceAsc",
			by: [{ field: "price", direction: "asc" }],
		},
		{
			title: "Prix décroissant",
			name: "priceDesc",
			by: [{ field: "price", direction: "desc" }],
		},
		{
			title: "Nom A-Z",
			name: "nameAsc",
			by: [{ field: "name", direction: "asc" }],
		},
	],
	preview: {
		select: {
			title: "name",
			subtitle: "price",
			media: "colors.0.mainImage",
			productName: "product.name",
			isNew: "badges.isNew",
			isPromo: "badges.isPromo",
			colors: "colors",
		},
		prepare(selection) {
			const { title, subtitle, media, productName, isNew, isPromo, colors } =
				selection;
			let badges = [];
			if (productName) badges.push("📋");
			if (isNew) badges.push("🆕");
			if (isPromo) badges.push("🏷️");

			// Vérifier le stock faible
			const hasLowStock = colors?.some((color: any) =>
				color.sizes?.some((size: any) => size.quantity > 0 && size.quantity < 5)
			);
			if (hasLowStock) badges.push("⚠️");

			return {
				title: title,
				subtitle: `${subtitle}€ ${badges.join(" ")}`,
				media: media,
			};
		},
	},
});
