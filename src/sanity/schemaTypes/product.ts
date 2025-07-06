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
		},
		prepare(selection) {
			const { title, subtitle, media } = selection;
			return {
				title: title,
				subtitle: subtitle,
				media: media,
			};
		},
	},
});
