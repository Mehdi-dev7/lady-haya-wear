"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { IoArrowUp } from "react-icons/io5";
import NavbarIcons from "../Navbar/NavbarIcons";

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			setIsScrolled(scrollY > 200);
			setShowScrollTop(scrollY > 1000);
		};

		const handleMenuToggle = (event: CustomEvent) => {
			setIsMenuOpen(event.detail.isOpen);
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("menuToggle", handleMenuToggle as EventListener);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener(
				"menuToggle",
				handleMenuToggle as EventListener
			);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<>
			<div
				className={`h-[68px] px-4 md:px-8 lg:px-8 xl:px-18 2xl:px-22 bg-rose-light fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
					isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
				}`}
			>
				{/* Mobile et Tablet (sm à lg) */}
				<div className="flex items-center justify-between h-full xl:hidden">
					<div className="relative">
						<IoMdMenu
							className={`text-4xl cursor-pointer text-logo transition-all duration-300 ${
								isMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
							}`}
							onClick={() => {
								console.log("Navbar: Clic sur menu");
								window.dispatchEvent(new CustomEvent("openMenu"));
								setIsMenuOpen(true);
							}}
						/>
						<IoMdClose
							className={`absolute top-0 left-0 text-4xl cursor-pointer text-logo transition-all duration-300 ${
								isMenuOpen
									? "opacity-100 rotate-0"
									: "opacity-0 -rotate-90 pointer-events-none"
							}`}
							onClick={() => {
								console.log("Navbar: Clic sur fermeture");
								window.dispatchEvent(new CustomEvent("closeMenu"));
								setIsMenuOpen(false);
							}}
						/>
					</div>
					<Link href="/" className=" items-center gap-3 hidden md:flex">
						<Image
							src="/assets/logo-haya.png"
							alt="Logo"
							width={48}
							height={48}
							className="w-12 h-12"
						/>
						<div className="text-3xl lg:text-4xl tracking-wide font-alex-brush text-logo font-semibold leading-none">
							Lady Haya{" "}
						</div>
					</Link>
					<NavbarIcons />
				</div>
				{/* Desktop (xl+) */}
				<div className="hidden xl:flex items-center h-full relative">
					{/* LEFT - Logo */}
					<Link href="/" className="flex items-center gap-3 absolute left-0">
						<Image
							src="/assets/logo-haya.png"
							alt="Logo"
							width={48}
							height={48}
							className="w-12 h-12"
						/>
						<div className="text-4xl tracking-wide font-alex-brush text-logo font-semibold leading-none">
							Lady Haya
						</div>
					</Link>

					{/* CENTER - Navigation (centrée par rapport à l'écran) */}
					<div className="w-full flex justify-center">
						<div className="hidden lg:flex gap-8 lg:gap-8 xl:gap-14 2xl:gap-16 lg:ml-24 xl:ml-32">
							<Link
								href="/"
								className="relative group text-logo text-xl transition-colors tracking-wide font-balqis font-bold leading-none"
							>
								Accueil
								<span className="absolute bottom-0 left-1/2 w-0 menu-underline h-[1px] group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in "></span>
							</Link>
							<Link
								href="/collections"
								className="relative group text-logo font-balqis font-bold text-xl transition-colors tracking-wide leading-none"
							>
								Collections
								<span className="absolute bottom-0 left-1/2 w-0 menu-underline h-[1px] group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
							</Link>
							<Link
								href="/allProducts"
								className="relative group text-logo font-balqis font-bold text-xl transition-colors tracking-wide leading-none"
							>
								Tous nos Produits
								<span className="absolute bottom-0 left-1/2 w-0 menu-underline h-[1px] group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
							</Link>
							<Link
								href="/contact"
								className="relative group text-logo font-balqis font-bold text-xl transition-colors tracking-wide leading-none"
							>
								Contact
								<span className="absolute bottom-0 left-1/2 w-0 menu-underline h-[1px] group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
							</Link>
						</div>
					</div>

					{/* RIGHT - Icons */}
					<div className="flex items-center justify-between gap-8 absolute right-0">
						<NavbarIcons />
					</div>
				</div>
			</div>

			{/* Bouton remonter en haut */}
			<button
				onClick={scrollToTop}
				className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-rose-medium text-logo rounded-full shadow-lg hover:bg-rose-dark hover:scale-110 transition-all duration-300 flex items-center justify-center ${
					showScrollTop
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-10 pointer-events-none"
				}`}
				aria-label="Remonter en haut"
			>
				<IoArrowUp className="text-2xl" />
			</button>
		</>
	);
}
