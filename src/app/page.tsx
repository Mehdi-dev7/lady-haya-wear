import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import AnimatedSection from "@/components/AnimatedSection";
import CategoryList from "@/components/CategoryList/CategoryList";
import Newsletter from "@/components/Newsletter/Newsletter";
import ProductList from "@/components/ProductList/ProductList";
import Reviews from "@/components/Reviews/Reviews";
import ServicesInfo from "@/components/ServicesInfo/ServicesInfo";
import Slider from "@/components/Slider/Slider";
import {
	getAllCategories,
	getFeaturedCategories,
	getFeaturedProducts,
} from "@/lib/sanity-queries";

export default async function Home() {
	const featuredCategories = await getFeaturedCategories();
	const allCategories = await getAllCategories();
	const featuredProducts = await getFeaturedProducts();

	return (
		<AnimatedPageWrapper>
			<Slider featuredCategories={featuredCategories} />

			<AnimatedSection
				className="bg-rose-light-2 md:py-16 py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48"
				delay={0.2}
			>
				<CategoryList categories={allCategories} />
			</AnimatedSection>

			<AnimatedSection
				className="bg-beige-light md:py-16 py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48"
				delay={0.3}
			>
				<ProductList featuredProducts={featuredProducts} />
			</AnimatedSection>

			<AnimatedSection delay={0.4}>
				<Reviews />
			</AnimatedSection>

			<AnimatedSection delay={0.5}>
				<Newsletter />
			</AnimatedSection>

			<AnimatedSection delay={0.6}>
				<ServicesInfo />
			</AnimatedSection>
		</AnimatedPageWrapper>
	);
}
