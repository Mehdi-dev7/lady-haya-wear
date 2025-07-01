"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartModal from "../CartModal/CartModal";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";

export default function NavbarIcons() {
	const router = useRouter();

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
				className="text-2xl cursor-pointer text-logo"
				onClick={handleProfile}
			/>
			{isProfileOpen && (
				<div className="absolute p-4 rounded-md top-12 left-0 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 ">
					<Link href="/">Profile</Link>
					<div className="mt-2 cursor-pointer">Logout</div>
				</div>
			)}
			<FaHeart
				className="text-2xl cursor-pointer text-logo"
			/>
			<div className="relative cursor-pointer">
				<FaBagShopping
					className="text-2xl cursor-pointer text-logo"
					onClick={() => setIsCartOpen((prev) => !prev)}
				/>
				<div className="absolute -top-4 -right-4 w-6 h-6 bg-[#F35C7A] rounded-full text-white text-sm flex items-center justify-center">
					2
				</div>
				{isCartOpen && <CartModal />}
			</div>
		</div>
	);
}
