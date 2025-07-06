export default {
	name: "category",
	title: "Catégorie",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Nom",
			type: "string",
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
		},
		{
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
					validation: (Rule: any) => Rule.required(),
				},
			],
		},
		{
			name: "featured",
			title: "Mise en avant",
			type: "boolean",
			initialValue: false,
		},
		{
			name: "order",
			title: "Ordre d'affichage",
			type: "number",
			initialValue: 0,
		},
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
};
