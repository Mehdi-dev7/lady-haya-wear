"use client";

import { useFavorites } from "@/lib/FavoritesContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHeart, FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import CartModal from "../CartModal/CartModal";

export default function NavbarIcons() {
	const router = useRouter();
	const { favorites } = useFavorites();

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);

	// TEMPORY
	const isLoggedIn = false;

	const handleProfile = () => {
		if (!isLoggedIn) {
			router.push("/login");
		}
		setIsProfileOpen((prev) => !prev);
	};

	return (
		<div className="flex items-center gap-4 xl:gap-6 relative">
			<FaUser
				className="text-xl md:text-2xl cursor-pointer text-logo"
				onClick={handleProfile}
			/>
			{isProfileOpen && (
				<div className="absolute p-4 rounded-md top-12 left-0 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 ">
					<Link href="/">Profile</Link>
					<div className="mt-2 cursor-pointer">Logout</div>
				</div>
			)}
			<div className="relative cursor-pointer">
				<FaHeart className="text-xl md:text-2xl cursor-pointer text-logo" />
				{favorites.length > 0 && (
					<div className="absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full text-white text-sm flex items-center justify-center">
						{favorites.length}
					</div>
				)}
			</div>
			<div className="relative cursor-pointer">
				<FaBagShopping
					className="text-xl md:text-2xl mr-2 md:mr-0 cursor-pointer text-logo"
					data-cart-icon
					onClick={(e) => {
						e.stopPropagation();
						setIsCartOpen((prev) => !prev);
					}}
				/>
				<div className="absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full text-white text-sm flex items-center justify-center mr-2 md:mr-0">
					2
				</div>
				{isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
			</div>
		</div>
	);
}
