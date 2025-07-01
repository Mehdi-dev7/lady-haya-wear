"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface CartModalProps {
	onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
	const cartItems = true;
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// Vérifier si le clic est sur l'icône du panier
			const target = event.target as HTMLElement;
			const isCartIcon = target.closest("[data-cart-icon]");

			if (
				modalRef.current &&
				!modalRef.current.contains(target) &&
				!isCartIcon
			) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	return (
		<div
			ref={modalRef}
			className="absolute w-96 top-12 right-0 p-10 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-nude-light flex flex-col gap-8 z-20"
		>
			{!cartItems ? (
				<div className="text-logo">Votre panier est vide</div>
			) : (
				<>
					<h2 className="text-2xl text-logo">Panier</h2>
					<div className="flex flex-col gap-10">
						{/* ITEMS */}
						<div className="flex gap-6">
							<Image
								src="/assets/grid/img1.jpeg"
								alt="Cart"
								width={100}
								height={120}
								className="object-cover rounded-md"
							/>
							<div className="flex flex-col justify-between w-full">
								{/* TOP */}
								<div className="">
									{/* TITLE */}
									<div className="flex items-center justify-between gap-8">
										<h3 className="font-semibold ">Nom du produit</h3>
										<div className="p-1 ">49€</div>
									</div>

									{/* DESC */}
									<div className="text-sm text-gray-500">Disponible</div>
								</div>

								{/* BOTTOM */}
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Qty. 2</span>
									<span className="text-blue-500">Supprimer</span>
								</div>
							</div>
						</div>
					</div>
					{/* BOTTOM */}
					<div className="">
						<div className="flex items-center justify-between font-semibold">
							<span className="">Sous-total</span>
							<span className="">49€</span>
						</div>
						<p className="text-gray-500 text-sm mt-2 mb-4">
							Lorem ipsum dolor sit amet.
						</p>
						<div className="flex justify-between text-sm">
							<button className="rounded-md bg-nude-light text-logo py-3 px-4 ring-1 ring-nude-dark">
								Voir le panier
							</button>
							<button className="rounded-md py-3 px-4 bg-logo text-nude-light">
								Valider la commande
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
