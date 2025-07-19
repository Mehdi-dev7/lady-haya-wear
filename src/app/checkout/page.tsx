"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	FaCcMastercard,
	FaCcPaypal,
	FaCcVisa,
	FaChevronDown,
	FaLock,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

const fakeUser = {
	nom: "Dupont",
	prenom: "Marie",
	adresse: "123 rue de Paris, 75001 Paris",
};

export default function CheckoutPage() {
	const [showAddressMenu, setShowAddressMenu] = useState(false);
	const [selectedDelivery, setSelectedDelivery] = useState("domicile");
	const [selectedPayment, setSelectedPayment] = useState("");
	const [cardInfo, setCardInfo] = useState({
		number: "",
		name: "",
		expiry: "",
		cvc: "",
	});
	const [civility, setCivility] = useState("Mme");
	const router = useRouter();

	// Simuler l'absence d'adresse pour la démo
	const hasAddress = !!fakeUser.adresse;

	// Simuler le panier
	const cart = [
		{
			id: 1,
			name: "Robe longue soie",
			price: 60,
			img: "/assets/grid/img1.jpeg",
		},
		{ id: 2, name: "Kimono satin", price: 40, img: "/assets/grid/img2.jpeg" },
	];
	const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
	const livraison = subtotal > 50 ? 0 : 5.99; // Harmonisé avec cart
	const tva = subtotal * 0.2;
	const total = subtotal + livraison;

	return (
		<div className="min-h-screen bg-beige-light">
			{/* Bandeau paiement sécurisé */}
			<div className="fixed top-0 left-0 w-full z-50 bg-black text-white flex items-center justify-center py-3 shadow-md">
				<FaLock className="mr-2 text-lg" />
				<span className="font-semibold tracking-wide">
					Paiement 100% sécurisé
				</span>
			</div>
			{/* Header */}
			<header className="bg-nude-light border-b border-gray-200 mt-12">
				<div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-6">
					<div className="flex items-center gap-4">
						<Link
							href="/cart"
							className="flex items-center gap-2 text-nude-dark hover:text-logo transition-colors cursor-pointer"
						>
							<FiArrowLeft className="w-5 h-5" />
							<span>Retour au panier</span>
						</Link>
					</div>
					<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mt-8">
						Finaliser ma commande
					</h1>
				</div>
			</header>

			{/* Contenu principal */}
			<main className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12">
				<div className="flex flex-col lg:flex-row gap-12 mt-8 lg:mt-4">
					{/* Colonne principale (infos, livraison, paiement) */}
					<div className="w-full lg:w-[60%]">
						<div className="bg-nude-light rounded-2xl shadow-lg p-6 mb-8">
							<h2 className="text-2xl font-semibold text-nude-dark mb-6">
								Informations client
							</h2>
							<div className="flex flex-col gap-4 mb-4">
								<div className="font-medium">
									{fakeUser.prenom} {fakeUser.nom}
								</div>
								<div>
									<div
										className={`border rounded-lg p-4 flex flex-col gap-2 bg-beige-light/60 w-full transition-all duration-300 ${showAddressMenu ? "max-w-lg w-full" : "max-w-sm"}`}
									>
										{hasAddress ? (
											<>
												<div className="text-base text-gray-700">
													{fakeUser.adresse}
												</div>
												<button
													className="text-sm text-nude-dark-2 underline flex items-center gap-1 cursor-pointer"
													onClick={() => setShowAddressMenu((v) => !v)}
												>
													Modifier l'adresse{" "}
													<FaChevronDown
														className={`transition-transform ${showAddressMenu ? "rotate-180" : "rotate-0"}`}
													/>
												</button>
											</>
										) : (
											<button
												className="text-xs text-nude-dark-2 underline cursor-pointer"
												onClick={() => setShowAddressMenu((v) => !v)}
											>
												Ajouter une adresse
											</button>
										)}
										{showAddressMenu && (
											<div className="mt-2 p-3 border rounded-2xl bg-white shadow space-y-4 w-full max-w-lg">
												{/* Civilité */}
												<div className="flex gap-6 mb-2">
													<label className="flex items-center gap-2 cursor-pointer">
														<input
															type="radio"
															name="civility"
															value="M."
															checked={civility === "M."}
															onChange={() => setCivility("M.")}
															className="hidden"
														/>
														<span
															className={`w-3 h-3 rounded-full border-2 border-nude-dark flex items-center justify-center ${civility === "M." ? "bg-nude-dark" : "bg-white"}`}
														></span>
														<span className="text-nude-dark text-sm">M.</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<input
															type="radio"
															name="civility"
															value="Mme"
															checked={civility === "Mme"}
															onChange={() => setCivility("Mme")}
															className="hidden"
														/>
														<span
															className={`w-3 h-3 rounded-full border-2 border-nude-dark flex items-center justify-center ${civility === "Mme" ? "bg-nude-dark" : "bg-white"}`}
														></span>
														<span className="text-nude-dark text-sm">Mme</span>
													</label>
												</div>
												<input
													type="text"
													placeholder="Nom complet"
													className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
													required
												/>
												<input
													type="text"
													placeholder="Ligne d'adresse 1"
													className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
													required
												/>
												<input
													type="text"
													placeholder="Ligne d'adresse 2 (facultatif)"
													className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
												/>
												<div className="flex gap-4">
													<input
														type="text"
														placeholder="Code postal"
														className="w-1/2 min-w-0 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
														required
													/>
													<input
														type="text"
														placeholder="Ville"
														className="w-1/2 min-w-0 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
														required
													/>
												</div>
												<div className="pt-2 text-right">
													<button
														type="button"
														className="bg-logo hover:bg-nude-dark text-white font-semibold px-8 py-2 rounded-full shadow btn-hover transition-all duration-200 cursor-pointer"
													>
														Valider
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Livraison */}
							<div className="bg-nude-light rounded-2xl shadow-lg p-6 mb-8 mt-8">
								<h2 className="text-2xl font-semibold text-nude-dark mb-6">
									Livraison
								</h2>
								<div className="flex flex-col gap-3">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="delivery"
											value="domicile"
											checked={selectedDelivery === "domicile"}
											onChange={() => setSelectedDelivery("domicile")}
										/>
										<span>À domicile (Chronopost)</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="delivery"
											value="relay"
											checked={selectedDelivery === "relay"}
											onChange={() => setSelectedDelivery("relay")}
										/>
										<span>Point relais (Mondial Relay)</span>
									</label>
									{selectedDelivery === "relay" && (
										<div className="ml-6 mt-2 text-xs text-gray-500">
											(Sélection du point relais à venir)
										</div>
									)}
								</div>
							</div>

							{/* Paiement */}
							<div className="bg-nude-light rounded-2xl shadow-lg p-6 mt-8">
								<h2 className="text-2xl font-semibold text-nude-dark mb-6">
									Paiement
								</h2>
								<div className="flex flex-col gap-3">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="payment"
											value="cb"
											checked={selectedPayment === "cb"}
											onChange={() => setSelectedPayment("cb")}
										/>
										<span className="flex items-center gap-1">
											Carte bancaire
											<FaCcVisa className="text-blue-600 text-lg" />
											<FaCcMastercard className="text-orange-600 text-lg" />
										</span>
									</label>
									{selectedPayment === "cb" && (
										<div className="ml-6 mt-2 flex flex-col gap-2">
											<input
												type="text"
												inputMode="numeric"
												pattern="[0-9]{16}"
												maxLength={16}
												placeholder="Numéro de carte"
												className="border rounded px-2 py-1 w-full"
												value={cardInfo.number}
												onChange={(e) => {
													const val = e.target.value
														.replace(/\D/g, "")
														.slice(0, 16);
													setCardInfo({ ...cardInfo, number: val });
												}}
												autoComplete="cc-number"
											/>
											<input
												type="text"
												inputMode="text"
												pattern="[A-Za-zÀ-ÿ\s]+"
												maxLength={26}
												placeholder="Nom sur la carte"
												className="border rounded px-2 py-1 w-full"
												value={cardInfo.name}
												onChange={(e) => {
													const val = e.target.value
														.replace(/[^A-Za-zÀ-ÿ\s]/g, "")
														.slice(0, 26);
													setCardInfo({ ...cardInfo, name: val });
												}}
												autoComplete="cc-name"
											/>
											<div className="flex gap-2">
												<input
													type="text"
													inputMode="numeric"
													pattern="[0-9]{2}/[0-9]{2}"
													maxLength={5}
													placeholder="MM/AA"
													className="border rounded px-2 py-1 w-1/2"
													value={cardInfo.expiry}
													onChange={(e) => {
														let val = e.target.value.replace(/[^0-9]/g, "");
														if (val.length > 2)
															val = val.slice(0, 2) + "/" + val.slice(2, 4);
														else val = val.slice(0, 2);
														setCardInfo({
															...cardInfo,
															expiry: val.slice(0, 5),
														});
													}}
													autoComplete="cc-exp"
												/>
												<input
													type="text"
													inputMode="numeric"
													pattern="[0-9]{3}"
													maxLength={3}
													placeholder="CVC"
													className="border rounded px-2 py-1 w-1/2"
													value={cardInfo.cvc}
													onChange={(e) => {
														const val = e.target.value
															.replace(/\D/g, "")
															.slice(0, 3);
														setCardInfo({ ...cardInfo, cvc: val });
													}}
													autoComplete="cc-csc"
												/>
											</div>
										</div>
									)}
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="payment"
											value="paypal"
											checked={selectedPayment === "paypal"}
											onChange={() => setSelectedPayment("paypal")}
										/>
										<span className="flex items-center gap-1">
											Paypal <FaCcPaypal className="text-blue-500 text-lg" />
										</span>
									</label>
									{selectedPayment === "paypal" && (
										<div className="ml-6 mt-2 text-xs text-blue-600">
											Redirection vers Paypal à la validation…
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					{/* Résumé de commande */}
					<div className="w-full lg:w-[40%]">
						<div className="bg-nude-light rounded-2xl shadow-lg p-6 sticky top-6">
							<h2 className="text-2xl font-semibold text-nude-dark mb-6">
								Résumé de commande
							</h2>
							{/* Détails des prix */}
							<div className="space-y-4 mb-6">
								<div className="flex flex-col gap-3 mb-4">
									{cart.map((item) => (
										<div
											key={item.id}
											className="flex items-center gap-3 border-b pb-2 last:border-b-0 last:pb-0"
										>
											<img
												src={item.img}
												alt={item.name}
												className="w-12 h-12 object-cover rounded"
											/>
											<div className="flex-1">
												<div className="text-sm font-medium">{item.name}</div>
											</div>
											<div className="text-sm font-semibold">
												{item.price.toFixed(2)} €
											</div>
										</div>
									))}
								</div>
								<div className="flex justify-between text-gray-600">
									<span>Sous-total</span>
									<span>{subtotal.toFixed(2)}€</span>
								</div>
								<div className="flex justify-between text-gray-600">
									<span>Frais de livraison</span>
									<span>
										{livraison === 0 ? (
											<span className="text-green-600 font-medium">
												Gratuit
											</span>
										) : (
											`${livraison.toFixed(2)}€`
										)}
									</span>
								</div>
								{livraison > 0 && (
									<div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
										🎉 Plus que {(50 - subtotal).toFixed(2)}€ pour la livraison
										gratuite !
									</div>
								)}
								<div className="flex justify-between text-gray-600">
									<span>TVA (20%)</span>
									<span>{tva.toFixed(2)}€</span>
								</div>
								<div className="border-t border-gray-200 pt-4">
									<div className="flex justify-between text-xl font-semibold text-logo">
										<span>Total</span>
										<span>{total.toFixed(2)}€</span>
									</div>
								</div>
							</div>

							{/* Bouton commander */}
							<button
								className={`w-[80%] md:w-[60%] lg:w-full 2xl:w-[80%] py-3 px-6 rounded-2xl text-base md:text-lg font-semibold transition-all duration-300 text-center block mt-4 cursor-pointer
    ${selectedPayment === "paypal" ? "bg-[#0750B4] hover:bg-[#063a80] text-white" : "bg-nude-dark text-white hover:bg-rose-dark"}`}
								onClick={() => {
									if (!hasAddress) {
										alert("Merci de renseigner votre adresse de livraison.");
										return;
									}
									if (!selectedPayment) {
										alert("Merci de choisir un mode de paiement.");
										return;
									}
									if (selectedPayment === "paypal") {
										alert("Redirection vers Paypal...");
									} else {
										alert("Paiement en cours...");
									}
								}}
							>
								{selectedPayment === "paypal" ? "Payer avec Paypal" : "Payer"}
							</button>
							<button
								className="w-full mt-3 py-2 rounded-2xl border border-nude-dark text-nude-dark font-semibold bg-white hover:bg-beige-light transition cursor-pointer"
								onClick={() => router.push("/allProducts")}
								type="button"
							>
								Continuer mes achats
							</button>

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
									<span>Retours possibles sous 30 jours</span>
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
			</main>
		</div>
	);
}
