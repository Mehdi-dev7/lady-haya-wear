import { getAllCategories } from "@/lib/sanity-queries";
import CollectionsClient from "@/app/collections/CollectionsClient";

export default async function CollectionsPage() {
	const categories = await getAllCategories();

	return <CollectionsClient categories={categories} />;
}
