"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import Link from "next/link";
import { FaInstagram, FaSnapchat, FaTwitter } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

export default function Menu() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleOpenMenu = () => {
			setIsOpen(true);
			document.body.style.overflow = "hidden";
		};

		const handleCloseMenu = () => {
			setIsOpen(false);
			document.body.style.overflow = "unset";
		};

		window.addEventListener("openMenu", handleOpenMenu);
		window.addEventListener("closeMenu", handleCloseMenu);

		return () => {
			window.removeEventListener("openMenu", handleOpenMenu);
			window.removeEventListener("closeMenu", handleCloseMenu);
			document.body.style.overflow = "unset";
		};
	}, []);

	const closeMenu = () => {
		setIsOpen(false);
		// Restaurer le scroll quand on ferme le menu
		document.body.style.overflow = "unset";
		window.dispatchEvent(
			new CustomEvent("menuToggle", { detail: { isOpen: false } })
		);
	};

	return (
		<div className="">
			{/* Menu avec animation */}
			<div
				className={`fixed left-0 right-0 bottom-0 z-60 transition-all duration-300 ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				} top-18`}
				onClick={closeMenu}
			>
				<div
					className={`absolute left-0 top-0 h-full w-[90%] md:w-3/4 bg-nude-medium border-t border-white transform transition-transform duration-300 ease-out ${
						isOpen ? "translate-x-0" : "-translate-x-full"
					}`}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Contenu du menu */}
					<div className="flex flex-col items-center justify-center pt-24 px-8 gap-6 text-xl">
						<div className="flex items-center gap-2">
							<Image
								src="/assets/logo-haya.png"
								alt="Logo"
								width={48}
								height={48}
							/>
							<h1 className="text-logo font-alex-brush font-semibold text-4xl">
								Lady-Haya
							</h1>
						</div>

						{/* Trait de séparation */}
						<div className="w-32 h-[1px] bg-nude-dark my-4"></div>

						<Link
							href="/"
							className="relative group text-logo font-balqis font-semibold text-2xl transition-colors inline-block"
							onClick={closeMenu}
						>
							Accueil
							<span
								className="absolute bottom-0 left-1/2 w-0 menu-underline group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"
								style={{
									height: "1px",
									backgroundColor: "var(--color-nude-dark)",
								}}
							></span>
						</Link>
						<Link
							href="/collections"
							className="relative group text-logo font-balqis font-semibold text-2xl transition-colors inline-block"
							onClick={closeMenu}
						>
							Collections
							<span
								className="absolute bottom-0 left-1/2 w-0 menu-underline group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"
								style={{
									height: "1px",
									backgroundColor: "var(--color-nude-dark)",
								}}
							></span>
						</Link>
						<Link
							href="/"
							className="relative group text-logo font-balqis font-semibold text-2xl transition-colors inline-block"
							onClick={closeMenu}
						>
							Produits
							<span
								className="absolute bottom-0 left-1/2 w-0 menu-underline group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"
								style={{
									height: "1px",
									backgroundColor: "var(--color-nude-dark)",
								}}
							></span>
						</Link>
						<Link
							href="/"
							className="relative group text-logo font-balqis font-semibold text-2xl transition-colors inline-block"
							onClick={closeMenu}
						>
							Contact
							<span
								className="absolute bottom-0 left-1/2 w-0 menu-underline group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"
								style={{
									height: "1px",
									backgroundColor: "var(--color-nude-dark)",
								}}
							></span>
						</Link>

						{/* Trait de séparation */}
						<div className="w-32 h-[1px] bg-nude-dark my-4"></div>

						{/* Réseaux sociaux */}
						<div className="flex flex-col items-center gap-4">
							<h3 className="text-logo font-balqis font-semibold text-lg">
								Suivez-nous
							</h3>
							<div className="flex gap-4">
								<a
									href="https://twitter.com/ladyhaya"
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300"
									onClick={closeMenu}
								>
									<FaTwitter className="text-xl text-white" />
								</a>
								<a
									href="https://instagram.com/ladyhaya"
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors duration-300"
									onClick={closeMenu}
								>
									<FaInstagram className="text-xl text-white" />
								</a>
								<a
									href="https://tiktok.com/@ladyhaya"
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 bg-black rounded-full hover:bg-gray-800 transition-colors duration-300"
									onClick={closeMenu}
								>
									<FaTiktok className="text-xl text-white" />
								</a>
								<a
									href="https://snapchat.com/add/ladyhaya"
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors duration-300"
									onClick={closeMenu}
								>
									<FaSnapchat className="text-xl text-white" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
