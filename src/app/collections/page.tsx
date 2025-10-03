import CollectionsClient from "@/app/collections/CollectionsClient";
import { getAllCategories } from "@/lib/sanity-queries";

// Revalidation toutes les 60 secondes pour récupérer les nouvelles catégories
export const revalidate = 60;

export default async function CollectionsPage() {
	const categories = await getAllCategories();

	return <CollectionsClient categories={categories} />;
}
