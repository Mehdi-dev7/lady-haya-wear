import Slider from "@/components/Slider/Slider";
import CategoryList from "@/components/CategoryList/CategoryList";

export default function Home() {
	return (
		<div>
			<Slider />
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light">
				<CategoryList />
			</section>
		</div>
	);
}