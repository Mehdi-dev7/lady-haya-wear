"use client";
import { useEffect, useState } from "react";

import Link from "next/link";

export default function Menu() {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// Le menu monte immédiatement au scroll
			setIsScrolled(window.scrollY > 190);
		};

		const handleOpenMenu = () => {
			setIsOpen(true);
		};

		const handleCloseMenu = () => {
			setIsOpen(false);
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("openMenu", handleOpenMenu);
		window.addEventListener("closeMenu", handleCloseMenu);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("openMenu", handleOpenMenu);
			window.removeEventListener("closeMenu", handleCloseMenu);
		};
	}, []);

	const closeMenu = () => {
		setIsOpen(false);
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
				} ${isScrolled ? "top-0" : "top-18"}`}
				onClick={closeMenu}
			>
				<div
					className={`absolute left-0 top-0 h-full w-2/3 bg-logo border-t border-white transform transition-transform duration-300 ease-out ${
						isOpen ? "translate-x-0" : "-translate-x-full"
					}`}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Contenu du menu */}
					<div className="flex flex-col items-center justify-center pt-24 px-8 gap-6 text-xl">
						<Link
							href="/"
							className="relative group text-rose-light transition-colors inline-block"
							onClick={closeMenu}
						>
							Accueil
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-rose-light group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-rose-light transition-colors inline-block"
							onClick={closeMenu}
						>
							Collections
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-rose-light group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-rose-light transition-colors inline-block"
							onClick={closeMenu}
						>
							Produits
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-rose-light group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-rose-light transition-colors inline-block"
							onClick={closeMenu}
						>
							Contact
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-rose-light group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
