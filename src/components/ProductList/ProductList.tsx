"use client";
import { useFavorites } from "@/lib/FavoritesContext";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

export default function ProductList() {
	const { favorites, toggleFavorite } = useFavorites();

	const handleToggleFavorite = (productId: number, e: React.MouseEvent) => {
		e.preventDefault(); // Empêcher la navigation du Link
		e.stopPropagation();
		toggleFavorite(productId);
	};

	return (
		<div>
			<div className="text-center mb-12">
				<h2 className="text-5xl lg:text-6xl font-alex-brush text-logo mb-4">
					Nos Coups de Cœur
				</h2>
			</div>
			<div className="flex gap-x-8 gap-y-16 justify-between flex-wrap">
				<Link
					href="/products"
					className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-nude-light"
				>
					<div className="relative w-full h-80 rounded-2xl overflow-hidden">
						<Image
							src="/assets/grid/img1.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl z-10 hover:opacity-0 transition-opacity easy duration-500"
						/>
						<Image
							src="/assets/grid/img2.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl"
						/>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Product Name</span>
						<span className="font-semibold">$49</span>
					</div>
					<div className="text-sm text-gray-500">My description</div>
					<div className="flex items-center justify-between gap-3 pointer-events-none">
						<button className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-2 px-4 text-xs hover:bg-red-400 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto">
							Add to cart
						</button>
						<button
							onClick={(e) => handleToggleFavorite(1, e)}
							className="p-2 hover:scale-110 transition-transform duration-200 cursor-pointer pointer-events-auto"
						>
							{favorites.includes(1) ? (
								<FaHeart className="text-xl text-red-400" />
							) : (
								<FiHeart className="text-xl text-gray-400 hover:text-red-400 transition-colors duration-200" />
							)}
						</button>
					</div>
				</Link>

				<Link
					href="/products"
					className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-rose-light-2"
				>
					<div className="relative w-full h-80 rounded-2xl overflow-hidden">
						<Image
							src="/assets/grid/img4.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl z-10 hover:opacity-0 transition-opacity easy duration-500"
						/>
						<Image
							src="/assets/grid/img5.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl"
						/>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Product Name</span>
						<span className="font-semibold">$49</span>
					</div>
					<div className="text-sm text-gray-500">My description</div>
					<div className="flex items-center justify-between gap-3 pointer-events-none">
						<button className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-2 px-4 text-xs hover:bg-red-400 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto">
							Add to cart
						</button>
						<button
							onClick={(e) => handleToggleFavorite(2, e)}
							className="p-2 hover:scale-110 transition-transform duration-200 cursor-pointer pointer-events-auto"
						>
							{favorites.includes(2) ? (
								<FaHeart className="text-xl text-red-400" />
							) : (
								<FiHeart className="text-xl text-gray-400 hover:text-red-400 transition-colors duration-200" />
							)}
						</button>
					</div>
				</Link>

				<Link
					href="/products"
					className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-nude-light"
				>
					<div className="relative w-full h-80 rounded-2xl overflow-hidden">
						<Image
							src="/assets/grid/img6.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl z-10 hover:opacity-0 transition-opacity easy duration-500"
						/>
						<Image
							src="/assets/grid/img7.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl"
						/>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Product Name</span>
						<span className="font-semibold">$49</span>
					</div>
					<div className="text-sm text-gray-500">My description</div>
					<div className="flex items-center justify-between gap-3 pointer-events-none">
						<button className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-2 px-4 text-xs hover:bg-red-400 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto">
							Add to cart
						</button>
						<button
							onClick={(e) => handleToggleFavorite(3, e)}
							className="p-2 hover:scale-110 transition-transform duration-200 cursor-pointer pointer-events-auto"
						>
							{favorites.includes(3) ? (
								<FaHeart className="text-xl text-red-400" />
							) : (
								<FiHeart className="text-xl text-gray-400 hover:text-red-400 transition-colors duration-200" />
							)}
						</button>
					</div>
				</Link>

				<Link
					href="/products"
					className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-rose-light-2"
				>
					<div className="relative w-full h-80 rounded-2xl overflow-hidden">
						<Image
							src="/assets/grid/img8.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl z-10 hover:opacity-0 transition-opacity easy duration-500"
						/>
						<Image
							src="/assets/grid/img9.jpeg"
							alt="Product Image"
							fill
							sizes="25vw"
							className="absolute object-cover rounded-2xl"
						/>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Product Name</span>
						<span className="font-semibold">$49</span>
					</div>
					<div className="text-sm text-gray-500">My description</div>
					<div className="flex items-center justify-between gap-3 pointer-events-none">
						<button className="rounded-2xl w-max ring-1 ring-red-400 text-red-400 py-2 px-4 text-xs hover:bg-red-400 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto">
							Add to cart
						</button>
						<button
							onClick={(e) => handleToggleFavorite(4, e)}
							className="p-2 hover:scale-110 transition-transform duration-200 cursor-pointer pointer-events-auto"
						>
							{favorites.includes(4) ? (
								<FaHeart className="text-xl text-red-400" />
							) : (
								<FiHeart className="text-xl text-gray-400 hover:text-red-400 transition-colors duration-200" />
							)}
						</button>
					</div>
				</Link>
			</div>
		</div>
	);
}
