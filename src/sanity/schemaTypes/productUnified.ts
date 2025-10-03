import { defineField, defineType } from "sanity";

export default defineType({
	name: "productUnified",
	title: "🛍️ Produit",
	type: "document",
	groups: [
		{
			name: "basic",
			title: "📝 Informations de base",
		},
		{
			name: "pricing",
			title: "💰 Prix",
		},
		{
			name: "media",
			title: "📸 Images principales",
		},
		{
			name: "variants",
			title: "🎨 Couleurs & Tailles",
		},
		{
			name: "options",
			title: "⭐ Options d'affichage",
		},
	],
	fields: [
		// ========== INFORMATIONS DE BASE ==========
		defineField({
			name: "name",
			title: "Nom du produit",
			type: "string",
			validation: (Rule) => Rule.required(),
			group: "basic",
			description: "Le nom de votre produit",
		}),
		defineField({
			name: "slug",
			title: "URL du produit",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
			group: "basic",
			description: "Cliquez sur 'Generate' pour créer automatiquement l'URL",
		}),
		defineField({
			name: "shortDescription",
			title: "Description courte",
			type: "text",
			rows: 2,
			description: "Affichée sur les cartes produits (max 150 caractères)",
			validation: (Rule) => Rule.required().max(150),
			group: "basic",
		}),
		defineField({
			name: "description",
			title: "Description détaillée",
			type: "text",
			rows: 6,
			description: "Description complète affichée sur la page du produit",
			validation: (Rule) => Rule.required(),
			group: "basic",
		}),
		defineField({
			name: "category",
			title: "Catégorie",
			type: "reference",
			to: [{ type: "category" }],
			validation: (Rule) => Rule.required(),
			group: "basic",
		}),

		// ========== PRIX ==========
		defineField({
			name: "price",
			title: "Prix actuel (€)",
			type: "number",
			validation: (Rule) => Rule.required().positive(),
			group: "pricing",
		}),
		defineField({
			name: "originalPrice",
			title: "Prix original (€)",
			type: "number",
			description:
				"Si en promotion, indiquez l'ancien prix (sera affiché barré)",
			validation: (Rule) => Rule.positive(),
			group: "pricing",
		}),

		// ========== IMAGES PRINCIPALES ==========
		defineField({
			name: "mainImage",
			title: "Image principale",
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
			group: "media",
			description: "L'image affichée en premier sur les cartes produits",
		}),
		defineField({
			name: "hoverImage",
			title: "Image au survol",
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
			description: "Image qui s'affiche quand on survole le produit",
			group: "media",
		}),

		// ========== COULEURS & VARIANTES ==========
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
							description: "Ex: Noir, Blanc, Rouge...",
						},
						{
							name: "hexCode",
							title: "Code couleur (HEX)",
							type: "string",
							description: "Ex: #FF0000 pour rouge, #000000 pour noir",
							validation: (Rule) =>
								Rule.required().regex(/^#[0-9A-F]{6}$/i, {
									name: "hex",
									invert: false,
								}),
						},
						{
							name: "mainImage",
							title: "Photo principale de cette couleur",
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
							title: "Photos supplémentaires",
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
									],
								},
							],
							description:
								"Photos supplémentaires de cette couleur (optionnel)",
						},
						{
							name: "sizes",
							title: "Tailles disponibles",
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
											title: "En stock",
											type: "boolean",
											initialValue: true,
										},
										{
											name: "quantity",
											title: "Quantité",
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
													? `✅ En stock (${quantity})`
													: "❌ Rupture",
											};
										},
									},
								},
							],
							validation: (Rule) => Rule.required().min(1),
							description: "Ajoutez au moins une taille",
						},
						{
							name: "available",
							title: "Couleur disponible",
							type: "boolean",
							initialValue: true,
							description: "Décochez si cette couleur n'est plus disponible",
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
								subtitle: subtitle ? "✅ Disponible" : "❌ Indisponible",
								media: media,
							};
						},
					},
				},
			],
			validation: (Rule) => Rule.required().min(1),
			group: "variants",
			description: "Ajoutez toutes les couleurs disponibles pour ce produit",
		}),

		// ========== OPTIONS D'AFFICHAGE ==========
		defineField({
			name: "featured",
			title: "⭐ Coup de cœur",
			type: "boolean",
			initialValue: false,
			group: "options",
			description:
				"Cochez pour afficher ce produit dans la section 'Coups de cœur'",
		}),
		defineField({
			name: "isNew",
			title: "🆕 Nouveau produit",
			type: "boolean",
			initialValue: false,
			group: "options",
			description: "Affiche un badge 'NOUVEAU' sur le produit",
		}),
		defineField({
			name: "isPromo",
			title: "🏷️ En promotion",
			type: "boolean",
			initialValue: false,
			group: "options",
			description: "Affiche un badge promotion sur le produit",
		}),
		defineField({
			name: "promoPercentage",
			title: "Pourcentage de réduction",
			type: "number",
			hidden: ({ parent }) => !parent?.isPromo,
			validation: (Rule) => Rule.min(1).max(99).warning("Entre 1 et 99%"),
			group: "options",
			description: "Ex: 20 pour -20%",
		}),
		defineField({
			name: "tags",
			title: "🏷️ Tags",
			type: "array",
			of: [{ type: "string" }],
			options: {
				layout: "tags",
			},
			group: "options",
			description: "Mots-clés pour faciliter la recherche (optionnel)",
		}),
	],
	orderings: [
		{
			title: "Plus récent",
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
			media: "mainImage",
			isNew: "isNew",
			isPromo: "isPromo",
			featured: "featured",
			promoPercentage: "promoPercentage",
		},
		prepare(selection) {
			const {
				title,
				subtitle,
				media,
				isNew,
				isPromo,
				featured,
				promoPercentage,
			} = selection;
			let badges = [];
			if (featured) badges.push("⭐");
			if (isNew) badges.push("🆕");
			if (isPromo) {
				badges.push(promoPercentage ? `🏷️ -${promoPercentage}%` : "🏷️");
			}

			return {
				title: title,
				subtitle: `${subtitle}€ ${badges.join(" ")}`,
				media: media,
			};
		},
	},
});
