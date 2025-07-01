"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const slides = [
	{
		id: 1,
		title: "Lady Haya Wear",
		logo: "/assets/logo-haya.png",
		description: "Collection Abaya",
		img: "/assets/grid/img1.jpeg",
		url: "/",
		bg: "bg-gradient-to-r from-beige-light to-beige-dark",
	},
	{
		id: 2,
		title: "Lady Haya Wear",
		logo: "/assets/logo-haya.png",
		description: "Collection Kimono",
		img: "/assets/grid/img2.jpeg",
		url: "/",
		bg: "bg-gradient-to-r from-beige-light to-beige-dark",
	},
	{
		id: 3,
		title: "Lady Haya Wear",
		logo: "/assets/logo-haya.png",
		description: "Collection Robe",
		img: "/assets/grid/img3.jpeg",
		url: "/",
		bg: "bg-gradient-to-r from-beige-light to-beige-dark",
	},
];

export default function Slider() {
	const [currentSlide, setCurrentSlide] = useState(0);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		setCurrentSlide((prev) => (prev + 1) % slides.length);
	// 	}, 3000);

	// 	return () => clearInterval(interval);
	// }, []);

	return (
		<div className="h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] xl:h-[calc(100vh-120px)] 2xl:h-[calc(100vh-140px)] overflow-hidden">
			<div
				className="w-max h-full flex transition-all ease-in-out duration-1000"
				style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
			>
				{slides.map((slide) => (
					<div
						className={`${slide.bg} h-full w-screen flex flex-col gap-16 lg:flex-row`}
						key={slide.id}
					>
						{/* TEXT CONTAINER */}
						<div className="h-1/2 lg:w-1/2 lg:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
							<Image src={slide.logo} alt="logo" width={200} height={200} />
							<h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-semibold">
								{slide.description}
							</h2>
							<h1 className="text-5xl xl:text-7xl 2xl:text-8xl ">
								{slide.title}
							</h1>
							<Link href={slide.url}>
								<button className="rounded-md py-3 px-4 bg-nude-dark text-nude-light">
									Voir la collection
								</button>
							</Link>
						</div>
						{/* IMAGE CONTAINER */}
						<div className="relative h-1/2 lg:w-1/2 lg:h-full">
							<Image
								src={slide.img}
								alt=""
								fill
								sizes="100%"
								className="object-cover"
							/>
						</div>
					</div>
				))}
			</div>
			<div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
				{slides.map((slide, index) => (
					<div
						className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
							currentSlide === index ? "scale-150" : ""
						}`}
						key={slide.id}
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
