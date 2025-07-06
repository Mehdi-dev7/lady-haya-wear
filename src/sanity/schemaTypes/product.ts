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
			name: "description",
			title: "Description",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "price",
			title: "Prix (€)",
			type: "number",
			validation: (Rule) => Rule.required().positive(),
		}),
		defineField({
			name: "images",
			title: "Images",
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
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: "category",
			title: "Catégorie",
			type: "reference",
			to: [{ type: "category" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "sizes",
			title: "Tailles disponibles",
			type: "array",
			of: [{ type: "string" }],
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
		}),
		defineField({
			name: "colors",
			title: "Couleurs disponibles",
			type: "array",
			of: [{ type: "string" }],
			options: {
				list: [
					{ title: "Noir", value: "Noir" },
					{ title: "Blanc", value: "Blanc" },
					{ title: "Beige", value: "Beige" },
					{ title: "Rose", value: "Rose" },
					{ title: "Bleu", value: "Bleu" },
					{ title: "Vert", value: "Vert" },
					{ title: "Rouge", value: "Rouge" },
					{ title: "Violet", value: "Violet" },
					{ title: "Gris", value: "Gris" },
					{ title: "Marron", value: "Marron" },
				],
			},
		}),
		defineField({
			name: "inStock",
			title: "En stock",
			type: "boolean",
			initialValue: true,
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
			media: "images.0",
		},
		prepare(selection) {
			const { title, subtitle, media } = selection;
			return {
				title: title,
				subtitle: `${subtitle}€`,
				media: media,
			};
		},
	},
});
