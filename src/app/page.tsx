import CategoryList from "@/components/CategoryList/CategoryList";
import ProductList from "@/components/ProductList/ProductList";
import Slider from "@/components/Slider/Slider";
import { getAllCategories, getFeaturedCategories, getFeaturedProducts } from "@/lib/sanity-queries";

export default async function Home() {
	const featuredCategories = await getFeaturedCategories();
	const allCategories = await getAllCategories();
	const featuredProducts = await getFeaturedProducts();

	return (
		<div>
			<Slider featuredCategories={featuredCategories} />
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<CategoryList categories={allCategories} />
			</section>
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-beige-light py-16">
				<ProductList featuredProducts={featuredProducts} />
			</section>
		</div>
	);
}
