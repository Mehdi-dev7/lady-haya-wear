"use client";
import { useState } from "react";

import Link from "next/link";
import { IoMdClose, IoMdMenu } from "react-icons/io";

export default function Menu() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="">
			{/* Icône qui se transforme */}
			<div className="relative">
				<IoMdMenu
					className={`text-4xl cursor-pointer text-nude-dark transition-all duration-300 ${
						isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
					}`}
					onClick={() => setIsOpen((prev) => !prev)}
				/>
				<IoMdClose
					className={`absolute top-0 left-0 text-4xl cursor-pointer text-nude-dark transition-all duration-300 ${
						isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
					}`}
					onClick={() => setIsOpen((prev) => !prev)}
				/>
			</div>

			{/* Menu avec animation */}
			<div
				className={`fixed inset-0 z-40 transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsOpen(false)}
			>
				<div
					className={`absolute left-0 top-18 h-[calc(100vh-72px)] w-2/3 bg-rose-light border-t border-white transform transition-transform duration-300 ease-out ${
						isOpen ? "translate-x-0" : "-translate-x-full"
					}`}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Contenu du menu */}
					<div className="flex flex-col items-center justify-center pt-24 px-8 gap-6 text-xl">
						
						<Link
							href="/"
							className="relative group text-nude-dark hover:text-nude-dark transition-colors inline-block"
							onClick={() => setIsOpen(false)}
						>
							Collections
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-nude-dark hover:text-nude-dark transition-colors inline-block"
							onClick={() => setIsOpen(false)}
						>
							Produits
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-nude-dark hover:text-nude-dark transition-colors inline-block"
							onClick={() => setIsOpen(false)}
						>
							Contact
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-nude-dark hover:text-nude-dark transition-colors inline-block"
							onClick={() => setIsOpen(false)}
						>
							Qui sommes-nous ?
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-nude-dark hover:text-nude-dark transition-colors inline-block"
							onClick={() => setIsOpen(false)}
						>
							Cart(1)
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
