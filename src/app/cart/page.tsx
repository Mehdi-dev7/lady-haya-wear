"use client";

import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

export default function CartPage() {
	const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
		useCart();

	// Fonction pour vérifier le stock disponible d'un item
	const getAvailableStock = (item: any) => {
		return item.maxQuantity || 10;
	};

	// Calcul des frais de livraison
	const getShippingCost = () => {
		const total = getCartTotal();
		return total >= 50 ? 0 : 5.99; // Livraison gratuite dès 50€
	};

	// Calcul du total final
	const getFinalTotal = () => {
		return getCartTotal() + getShippingCost();
	};

	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header */}
			<header className="bg-white/50 border-b border-gray-200">
				<div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-6">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="flex items-center gap-2 text-nude-dark hover:text-logo transition-colors"
						>
							<FiArrowLeft className="w-5 h-5" />
							<span>Continuer mes achats</span>
						</Link>
					</div>
					<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mt-12">
						Mon Panier
					</h1>
				</div>
			</header>

			{/* Contenu principal */}
			<main className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12">
				{!cartItems || cartItems.length === 0 ? (
					/* Panier vide */
					<div className="text-center py-16">
						<div className="text-8xl mb-6">🛒</div>
						<h2 className="text-3xl font-alex-brush text-logo mb-4">
							Votre panier est vide
						</h2>
						<p className="text-nude-dark mb-8 max-w-md mx-auto">
							Découvrez nos collections et ajoutez des produits à votre panier
							pour commencer vos achats.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/collections"
								className="rounded-2xl bg-nude-dark text-white py-3 px-8 text-lg hover:bg-rose-dark transition-all duration-300"
							>
								Découvrir nos collections
							</Link>
							<Link
								href="/"
								className="rounded-2xl ring-2 ring-nude-dark text-nude-dark py-3 px-8 text-lg hover:bg-nude-dark hover:text-white transition-all duration-300"
							>
								Retour à l'accueil
							</Link>
						</div>
					</div>
				) : (
					/* Panier avec articles */
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
						{/* Liste des articles */}
						<div className="lg:col-span-2">
							<div className="bg-nude-light rounded-2xl shadow-lg p-6">
								<h2 className="text-2xl font-semibold text-nude-dark mb-6">
									Articles ({cartItems.length})
								</h2>

								<div className="space-y-6">
									{cartItems.map((item) => (
										<div
											key={item.id}
											className="flex gap-6 p-4 bg-nude-light/30 rounded-xl"
										>
											{/* Image */}
											<div className="relative w-24 h-32 flex-shrink-0">
												<Image
													src={item.image}
													alt={item.imageAlt || item.name}
													fill
													className="object-cover rounded-lg"
												/>
											</div>

											{/* Informations */}
											<div className="flex-1 flex flex-col justify-between">
												<div>
													{/* Nom et prix */}
													<div className="flex justify-between items-start mb-2">
														<h3 className="font-semibold text-lg text-nude-dark">
															{item.name}
														</h3>
														<div className="text-right">
															{item.originalPrice &&
															item.originalPrice < item.price ? (
																<div className="text-sm text-gray-400 line-through">
																	{item.originalPrice.toFixed(2)}€
																</div>
															) : null}
															<div className="text-xl font-semibold text-logo">
																{item.price.toFixed(2)}€
															</div>
														</div>
													</div>

													{/* Détails couleur et taille */}
													<div className="flex items-center gap-4 mb-4">
														<div className="flex items-center gap-2">
															<div
																className="w-4 h-4 rounded-full border border-gray-300"
																style={{ backgroundColor: item.colorHex }}
															/>
															<span className="text-sm text-gray-600">
																{item.color}
															</span>
														</div>
														<span className="text-gray-400">•</span>
														<span className="text-sm text-gray-600">
															Taille {item.size}
														</span>
													</div>
												</div>

												{/* Actions */}
												<div className="flex items-center justify-between">
													{/* Quantité */}
													<div className="flex items-center gap-3">
														<button
															onClick={() =>
																updateQuantity(item.id, item.quantity - 1)
															}
															disabled={item.quantity <= 1}
															className="w-8 h-8 rounded-full ring-2 ring-nude-dark text-nude-dark hover:ring-rose-dark-2 hover:bg-rose-light hover:text-rose-dark-2 flex items-center justify-center transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
														>
															−
														</button>
														<span className="text-lg font-medium text-nude-dark min-w-[30px] text-center">
															{item.quantity}
														</span>
														<button
															onClick={() =>
																updateQuantity(item.id, item.quantity + 1)
															}
															disabled={
																item.quantity >= getAvailableStock(item)
															}
															className="w-8 h-8 rounded-full ring-2 ring-nude-dark text-nude-dark hover:ring-rose-dark-2 hover:bg-rose-light hover:text-rose-dark-2 flex items-center justify-center transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
														>
															+
														</button>
													</div>

													{/* Supprimer */}
													<button
														onClick={() => removeFromCart(item.id)}
														className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
													>
														<FiTrash2 className="w-4 h-4" />
														<span className="text-sm">Supprimer</span>
													</button>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Actions du panier */}
								<div className="border-t border-gray-200 pt-6 mt-6">
									<div className="flex justify-between items-center">
										<button
											onClick={clearCart}
											className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
										>
											Vider le panier
										</button>
										<Link
											href="/collections"
											className="text-nude-dark hover:text-logo transition-colors cursor-pointer"
										>
											Continuer mes achats
										</Link>
									</div>
								</div>
							</div>
						</div>

						{/* Résumé de commande */}
						<div className="lg:col-span-1">
							<div className="bg-nude-light rounded-2xl shadow-lg p-6 sticky top-6">
								<h2 className="text-2xl font-semibold text-nude-dark mb-6">
									Résumé de commande
								</h2>

								{/* Détails des prix */}
								<div className="space-y-4 mb-6">
									<div className="flex justify-between text-gray-600">
										<span>Sous-total</span>
										<span>{getCartTotal().toFixed(2)}€</span>
									</div>
									<div className="flex justify-between text-gray-600">
										<span>Frais de livraison</span>
										<span>
											{getShippingCost() === 0 ? (
												<span className="text-green-600 font-medium">
													Gratuit
												</span>
											) : (
												`${getShippingCost().toFixed(2)}€`
											)}
										</span>
									</div>
									{getShippingCost() > 0 && (
										<div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
											🎉 Plus que {(50 - getCartTotal()).toFixed(2)}€ pour la
											livraison gratuite !
										</div>
									)}
									<div className="border-t border-gray-200 pt-4">
										<div className="flex justify-between text-xl font-semibold text-logo">
											<span>Total</span>
											<span>{getFinalTotal().toFixed(2)}€</span>
										</div>
									</div>
								</div>

								{/* Bouton commander */}
								<Link
									href="/checkout"
									className="w-2/3 lg:w-full 2xl:w-2/3 bg-nude-dark text-white py-3 px-6 rounded-2xl text-base md:text-lg font-semibold hover:bg-rose-dark transition-all duration-300 text-center block"
								>
									Passer la commande
								</Link>

								{/* Informations supplémentaires */}
								<div className="mt-6 space-y-3 text-sm text-gray-500">
									<div className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>Livraison gratuite dès 50€</span>
									</div>
									<div className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>Retours gratuits sous 30 jours</span>
									</div>
									<div className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>Paiement sécurisé</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
