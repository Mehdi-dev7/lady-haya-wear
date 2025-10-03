import { defineField, defineType } from "sanity";

export default defineType({
	name: "category",
	title: "Catégorie",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Nom",
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
			rows: 3,
		}),
		defineField({
			name: "image",
			title: "Image",
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
		}),
		defineField({
			name: "featured",
			title: "Mise en avant",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "order",
			title: "Ordre d'affichage (Carrousel 3D)",
			type: "number",
			initialValue: 0,
			description:
				"Définit l'ordre dans le carrousel 3D 'Nos Collections'. 0 = première position, 1 = deuxième, etc.",
		}),
	],
	orderings: [
		{
			title: "Ordre d'affichage",
			name: "orderAsc",
			by: [{ field: "order", direction: "asc" }],
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
			subtitle: "description",
			media: "image",
		},
	},
});
