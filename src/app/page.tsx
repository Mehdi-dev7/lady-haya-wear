import CategoryList from "@/components/CategoryList/CategoryList";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import ProductList from "@/components/ProductList/ProductList";
import Slider from "@/components/Slider/Slider";

export default function Home() {
	return (
		<div>
			<Slider />
			<FeaturedProducts />
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16">
				<CategoryList />
			</section>
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-beige-light py-16">
				<ProductList />
			</section>
		</div>
	);
}
