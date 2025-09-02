import { defineField, defineType } from "sanity";

export default defineType({
	name: "product",
	title: "Produit",
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
			name: "shortDescription",
			title: "Description courte",
			type: "text",
			rows: 2,
			description: "Description courte affichée sur les cartes produits",
			validation: (Rule) => Rule.required().max(150),
		}),
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
		}),
		defineField({
			name: "category",
			title: "Catégorie",
			type: "reference",
			to: [{ type: "category" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "featured",
			title: "Mise en avant",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "isNew",
			title: "Nouveau produit",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "badges",
			title: "Badges et Promotions",
			type: "object",
			fields: [
				defineField({
					name: "isPromo",
					title: "Produit en promotion",
					type: "boolean",
					initialValue: false,
					description: "Activer pour afficher le badge promotion",
				}),
				defineField({
					name: "promoType",
					title: "Type de promotion",
					type: "string",
					options: {
						list: [
							{ title: "Pourcentage de réduction", value: "percentage" },
							{ title: "Prix barré (prix original)", value: "originalPrice" },
						],
						layout: "radio",
					},
					hidden: ({ parent }) => !parent?.isPromo,
					initialValue: "percentage",
					description: "Choisissez le type de promotion à afficher",
				}),
				defineField({
					name: "promoPercentage",
					title: "Pourcentage de réduction (%)",
					type: "number",
					hidden: ({ parent }) =>
						!parent?.isPromo || parent?.promoType !== "percentage",
					validation: (Rule) =>
						Rule.min(1)
							.max(99)
							.warning("Le pourcentage doit être entre 1 et 99"),
					description: "Exemple: 20 pour -20%",
				}),
				defineField({
					name: "originalPrice",
					title: "Prix original (€)",
					type: "number",
					hidden: ({ parent }) =>
						!parent?.isPromo || parent?.promoType !== "originalPrice",
					validation: (Rule) => Rule.positive(),
					description:
						"Prix original à afficher barré (doit être supérieur au prix actuel du produit détaillé)",
				}),
			],
			description: "Gestion des badges et promotions pour ce produit",
		}),
	],
	orderings: [
		{
			title: "Date de création (plus récent)",
			name: "createdAtDesc",
			by: [{ field: "_createdAt", direction: "desc" }],
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
			subtitle: "shortDescription",
			media: "mainImage",
			isNew: "isNew",
			featured: "featured",
			isPromo: "badges.isPromo",
			promoType: "badges.promoType",
			promoPercentage: "badges.promoPercentage",
		},
		prepare(selection) {
			const {
				title,
				subtitle,
				media,
				isNew,
				featured,
				isPromo,
				promoType,
				promoPercentage,
			} = selection;
			let badges = [];

			if (featured) badges.push("⭐");
			if (isNew) badges.push("🆕");
			if (isPromo) {
				if (promoType === "percentage" && promoPercentage) {
					badges.push(`🏷️ -${promoPercentage}%`);
				} else if (promoType === "originalPrice") {
					badges.push("🏷️ PROMO");
				} else {
					badges.push("🏷️");
				}
			}

			return {
				title: title,
				subtitle: `${subtitle} ${badges.join(" ")}`,
				media: media,
			};
		},
	},
});
