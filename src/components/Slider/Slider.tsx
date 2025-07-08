"use client";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SliderProps {
	featuredCategories: any[];
}

export default function Slider({ featuredCategories }: SliderProps) {
	const [currentSlide, setCurrentSlide] = useState(0);

	// Tableau des gradients disponibles
	const gradients = [
		"bg-gradient-to-r from-beige-light to-beige-dark",
		"bg-gradient-to-r from-nude-light to-nude-dark",
		"bg-gradient-to-r from-rose-light-2 to-rose-dark",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % featuredCategories.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [featuredCategories.length]);

	return (
		<div className="mt-10 h-[calc(100vh-72px)] lg:h-[calc(100vh-72px)] xl:h-[calc(100vh-72px)] 2xl:h-[calc(100vh-72px)] overflow-hidden relative">
			<div
				className="w-max h-full flex transition-all ease-in-out duration-1000"
				style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
			>
				{featuredCategories.map((category, index) => (
					<div
						className={`${gradients[index % gradients.length]} h-full w-screen flex flex-col lg:flex-row`}
						key={category._id}
					>
						{/* TEXT CONTAINER */}
						<div className="h-1/3 lg:w-1/2 lg:h-full w-full flex flex-col items-center justify-center gap-3 lg:gap-8 2xl:gap-12 text-center  lg:pt-0">
							<Image
								src="/assets/logo-haya.png"
								alt="logo"
								width={200}
								height={200}
								className="w-24 h-24 lg:w-48 lg:h-48"
							/>
							<h2 className="hidden lg:block text-3xl xl:text-4xl 2xl:text-4xl font-semibold font-balqis text-center text-logo">
								{category.name}
							</h2>
							<h1 className="text-5xl font-alex-brush text-logo lg:text-5xl xl:text-7xl text-center">
								Lady Haya Wear
							</h1>
							<Link
								href={`/collections/${category.slug?.current || category._id}`}
								className="hidden lg:block"
							>
								<button className="rounded-md py-3 px-4 bg-logo text-nude-light cursor-pointer hover:bg-nude-dark-2 hover:scale-105 transition-all duration-300">
									Voir la collection
								</button>
							</Link>
						</div>

						{/* IMAGE CONTAINER */}
						<div className="relative h-2/3 lg:w-1/2 lg:h-full">
							<Image
								src={
									category.image
										? urlFor(category.image)?.url() || "/assets/placeholder.jpg"
										: "/assets/placeholder.jpg"
								}
								alt={category.image?.alt || category.name}
								fill
								sizes="100%"
								className="object-cover"
							/>
							{/* DESCRIPTION OVERLAY - TOP */}
							<div className="absolute top-4 left-1/2 transform -translate-x-1/2 lg:hidden">
								<h2 className="text-3xl font-semibold text-white drop-shadow-lg text-center text-logo font-balqis">
									{category.name}
								</h2>
							</div>
							{/* BUTTON OVERLAY - BOTTOM RIGHT */}
							<div className="absolute bottom-14 right-2 md:right-6 lg:hidden">
								<Link
									href={`/collections/${category.slug?.current || category._id}`}
								>
									<button className="rounded-md py-2 px-2 md:px-3  text-nude-light text-base bg-logo cursor-pointer hover:bg-nude-dark-2 hover:scale-105 transition-all duration-300">
										Voir la collection
									</button>
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* DOTS - FIXED AT BOTTOM */}
			<div className="absolute left-1/2 bottom-8 lg:bottom-12 xl:bottom-16 2xl:bottom-20 transform -translate-x-1/2 flex gap-4 z-10">
				{featuredCategories.map((category, index) => (
					<div
						className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
							currentSlide === index ? "scale-150" : ""
						}`}
						key={category._id}
						onClick={() => setCurrentSlide(index)}
					>
						{currentSlide === index && (
							<div className="w-[6px] h-[6px] bg-gray-600 rounded-full" />
						)}
					</div>
				))}
			</div>
		</div>
	);
}
