"use client";

import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaHeart, FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import CartModal from "../CartModal/CartModal";
import FavModal from "../FavModal/FavModal";

export default function NavbarIcons() {
	const router = useRouter();
	const { favorites } = useFavorites();
	const { getCartCount } = useCart();
	const { user, loading, logout } = useAuth();
	const profileModalRef = useRef<HTMLDivElement>(null);

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isFavOpen, setIsFavOpen] = useState(false);

	// Vérifier si l'utilisateur est connecté
	const isLoggedIn = !!user;

	// Fermeture de la modale au clic extérieur
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileModalRef.current &&
				!profileModalRef.current.contains(event.target as Node)
			) {
				setIsProfileOpen(false);
			}
		};

		if (isProfileOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isProfileOpen]);

	const handleProfile = () => {
		if (!isLoggedIn) {
			router.push("/login");
		} else {
			setIsProfileOpen((prev) => !prev);
		}
	};

	const handleLogout = async () => {
		setIsProfileOpen(false);
		await logout();
		router.push("/");
	};

	return (
		<div className="flex items-center gap-4 xl:gap-6 relative">
			<FaUser
				className="text-xl md:text-2xl cursor-pointer text-logo"
				onClick={handleProfile}
			/>
			{isProfileOpen && isLoggedIn && (
				<div
					ref={profileModalRef}
					className="absolute p-4 rounded-lg top-12 right-2 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 bg-nude-light border border-nude-light min-w-[200px]"
				>
					<div className="flex items-center gap-3 mb-3 pb-3 border-b border-nude-medium">
						<Image
							src="/assets/logo-haya.png"
							alt="Lady Haya Wear"
							width={32}
							height={32}
							className="rounded-full"
						/>
						<div>
							<p className="text-logo font-medium truncate max-w-[120px]">
								{user?.profile?.firstName || user?.profile?.lastName
									? `${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`.trim()
									: user?.name || user?.email || "Utilisateur"}
							</p>
						</div>
					</div>
					<Link
						href="/account"
						className="block py-2 px-3 hover:bg-rose-light-2 rounded-md transition-colors duration-200 text-nude-dark hover:text-logo"
						onClick={() => setIsProfileOpen(false)}
					>
						Mon compte
					</Link>
					<Link
						href="/orders"
						className="block py-2 px-3 hover:bg-rose-light-2 rounded-md transition-colors duration-200 text-nude-dark hover:text-logo"
						onClick={() => setIsProfileOpen(false)}
					>
						Mes commandes
					</Link>
					<div className="border-t border-nude-light my-2"></div>
					<button
						className="block w-full text-left py-2 px-3 hover:bg-rose-light-2 rounded-md transition-colors duration-200 text-nude-dark hover:text-logo cursor-pointer"
						onClick={handleLogout}
					>
						Se déconnecter
					</button>
				</div>
			)}
			<div className="relative cursor-pointer">
				<FaHeart
					className="text-xl md:text-2xl cursor-pointer text-logo"
					onClick={() => setIsFavOpen(true)}
				/>
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
				{getCartCount() > 0 && (
					<div className="absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full text-white text-sm flex items-center justify-center mr-2 md:mr-0">
						{getCartCount()}
					</div>
				)}
				{isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
			</div>

			{/* FavModal */}
			<FavModal isOpen={isFavOpen} onClose={() => setIsFavOpen(false)} />
		</div>
	);
}
