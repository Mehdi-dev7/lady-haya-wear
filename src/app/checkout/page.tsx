"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCcMastercard, FaCcPaypal, FaCcVisa, FaLock } from "react-icons/fa";
import { FiArrowLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-toastify";

const fakeUser = {
	nom: "Dupont",
	prenom: "Marie",
	adresse: "123 rue de Paris, 75001 Paris",
};

export default function CheckoutPage() {
	const { cartItems, getCartTotal } = useCart();
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
	const [user, setUser] = useState<any>(null);
	const [address, setAddress] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [modalForm, setModalForm] = useState({
		nom: address?.lastName || address?.nom || "",
		prenom: address?.firstName || address?.prenom || "",
		ligne1: address?.street || address?.ligne1 || "",
		ligne2: address?.company || address?.ligne2 || "",
		codePostal: address?.zipCode || address?.codePostal || "",
		ville: address?.city || address?.ville || "",
	});
	const [adresses, setAdresses] = useState<any[]>([]);
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
		null
	);
	const [localAddresses, setLocalAddresses] = useState<any[]>([]);
	const [showOtherAddresses, setShowOtherAddresses] = useState(false);

	useEffect(() => {
		async function fetchUserAndAddress() {
			setLoading(true);
			const userRes = await fetch("/api/user/account");
			const userData = await userRes.json();
			setUser(userData.user);
			const addressRes = await fetch("/api/user/account/address");
			const addressData = await addressRes.json();
			setAddress(addressData.address);
			setLoading(false);
		}
		fetchUserAndAddress();
	}, []);

	useEffect(() => {
		async function fetchAddresses() {
			setLoading(true);
			const res = await fetch("/api/user/account/address?all=1");
			const data = await res.json();
			setAdresses(data.addresses || []);
			// Sélectionner la principale par défaut
			const main = (data.addresses || []).find((a: any) => a.isDefault);
			setSelectedAddressId(main ? main.id : data.addresses?.[0]?.id || null);
			setLoading(false);
		}
		fetchAddresses();
	}, []);

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Chargement...
			</div>
		);

	// Vérifier si le panier est vide
	if (!cartItems || cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-beige-light flex items-center justify-center">
				<div className="text-center">
					<div className="text-8xl mb-6">🛒</div>
					<h2 className="text-3xl font-alex-brush text-logo mb-4">
						Votre panier est vide
					</h2>
					<p className="text-nude-dark mb-8 max-w-md mx-auto">
						Ajoutez des produits à votre panier pour finaliser votre commande.
					</p>
					<Link
						href="/allProducts"
						className="rounded-2xl bg-nude-dark text-white py-3 px-8 text-lg hover:bg-rose-dark transition-all duration-300"
					>
						Découvrir nos produits
					</Link>
				</div>
			</div>
		);
	}

	// Simuler l'absence d'adresse pour la démo
	const hasAddress = !!fakeUser.adresse;

	// Calculs panier avec les vraies données
	const subtotalHT = getCartTotal();
	const tva = subtotalHT * 0.2;
	const livraison = subtotalHT + tva >= 50 ? 0 : 5.99;
	const totalTTC = subtotalHT + tva + livraison;

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
									{user?.civility ? user.civility + " " : ""}
									{user?.nom} {user?.prenom}
								</div>
								<div className="text-nude-dark font-semibold mb-2 text-base">
									Adresse de livraison
								</div>
								<div className="mb-4">
									{adresses.length === 0 ? (
										<div className="flex flex-col items-center gap-4">
											<div className="text-nude-dark font-semibold text-base">
												Aucune adresse enregistrée
											</div>
											<button
												className="bg-nude-dark text-white px-6 py-2 rounded-2xl font-semibold hover:bg-logo transition-all duration-200"
												onClick={() => {
													setModalForm({
														nom: "",
														prenom: "",
														ligne1: "",
														ligne2: "",
														codePostal: "",
														ville: "",
													});
													setCivility("Mme");
													setShowAddressMenu(true);
												}}
											>
												Ajouter une adresse
											</button>
										</div>
									) : (
										<div className="flex flex-col gap-2">
											{/* Affichage de l'adresse principale */}
											{adresses
												.filter((a) => a.isDefault)
												.map((a) => (
													<label
														key={a.id}
														className="flex items-center gap-3 cursor-pointer"
													>
														<input
															type="radio"
															name="selectedAddress"
															checked={selectedAddressId === a.id}
															onChange={() => setSelectedAddressId(a.id)}
															className="sr-only"
														/>
														<span
															className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${selectedAddressId === a.id ? "bg-nude-dark" : "bg-white"}`}
														/>
														<div className="flex-1 bg-beige-light border border-nude-dark/30 rounded-lg p-4 max-w-md">
															<div className="text-logo font-semibold">
																{a.lastName} {a.firstName}
															</div>
															<div className="text-nude-dark">{a.street}</div>
															<div className="text-nude-dark">
																{a.zipCode} {a.city}
															</div>
															<div className="text-xs text-gray-500 mt-1">
																{a.civility === "MR"
																	? "M."
																	: a.civility === "MME"
																		? "Mme"
																		: ""}{" "}
																(principale)
															</div>
														</div>
													</label>
												))}
											{/* Lien pour afficher/masquer les autres adresses */}
											{adresses.filter((a) => !a.isDefault).length > 0 && (
												<button
													type="button"
													className="flex items-center gap-1 text-nude-dark underline font-semibold  mt-2 mb-1 hover:text-logo cursor-pointer"
													onClick={() => setShowOtherAddresses((v) => !v)}
												>
													{showOtherAddresses ? (
														<FiChevronUp style={{ strokeWidth: 3 }} />
													) : (
														<FiChevronDown style={{ strokeWidth: 3 }} />
													)}
													<span>
														{showOtherAddresses
															? "Masquer les autres adresses"
															: "Voir mes adresses"}
													</span>
												</button>
											)}
											{/* Affichage des autres adresses */}
											{showOtherAddresses &&
												adresses
													.filter((a) => !a.isDefault)
													.map((a) => (
														<label
															key={a.id}
															className="flex items-center gap-3 cursor-pointer"
														>
															<input
																type="radio"
																name="selectedAddress"
																checked={selectedAddressId === a.id}
																onChange={() => setSelectedAddressId(a.id)}
																className="sr-only"
															/>
															<span
																className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${selectedAddressId === a.id ? "bg-nude-dark" : "bg-white"}`}
															/>
															<div className="flex-1 bg-beige-light border border-nude-dark/30 rounded-lg p-4 max-w-md">
																<div className="text-logo font-semibold">
																	{a.lastName} {a.firstName}
																</div>
																<div className="text-nude-dark">{a.street}</div>
																<div className="text-nude-dark">
																	{a.zipCode} {a.city}
																</div>
																<div className="text-xs text-gray-500 mt-1">
																	{a.civility === "MR"
																		? "M."
																		: a.civility === "MME"
																			? "Mme"
																			: ""}
																</div>
															</div>
														</label>
													))}
										</div>
									)}
								</div>
							</div>

							{/* Bouton-lien Ajouter une adresse */}
							<button
								className="text-nude-dark underline font-semibold hover:text-logo transition-colors flex items-center gap-1 cursor-pointer "
								onClick={() => {
									setModalForm({
										nom: "",
										prenom: "",
										ligne1: "",
										ligne2: "",
										codePostal: "",
										ville: "",
									});
									setCivility("Mme");
									setShowAddressMenu(!showAddressMenu);
								}}
								type="button"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									className="inline-block"
									style={{ marginRight: "2px", verticalAlign: "middle" }}
									aria-hidden="true"
								>
									<path
										d="M8 3v10M3 8h10"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
								Ajouter une adresse
							</button>

							{/* Formulaire déroulant d'ajout d'adresse */}
							{showAddressMenu && (
								<form
									className="bg-beige-light border border-nude-dark/30 rounded-lg p-4 mt-2 w-full max-w-md animate-fade-in flex flex-col gap-3"
									onSubmit={async (e) => {
										e.preventDefault();
										const res = await fetch("/api/user/account/address", {
											method: "POST",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify({
												civility,
												lastName: modalForm.nom,
												firstName: modalForm.prenom,
												street: modalForm.ligne1,
												company: modalForm.ligne2,
												zipCode: modalForm.codePostal,
												city: modalForm.ville,
											}),
										});
										const data = await res.json();
										if (!res.ok) {
											toast.error(
												data.error || "Erreur lors de l'ajout de l'adresse"
											);
											return;
										}
										toast.success("Adresse ajoutée avec succès !");
										setShowAddressMenu(false);
										// Recharge les adresses depuis la BDD
										setLoading(true);
										const res2 = await fetch("/api/user/account/address?all=1");
										const data2 = await res2.json();
										setAdresses(data2.addresses || []);
										setLoading(false);
									}}
								>
									<div className="flex gap-4">
										<label className="flex items-center gap-1 cursor-pointer">
											<input
												type="radio"
												name="civility"
												value="Mme"
												checked={civility === "Mme"}
												onChange={() => setCivility("Mme")}
												className="sr-only"
											/>
											<span
												className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${civility === "Mme" ? "bg-nude-dark" : "bg-white"}`}
											/>
											Mme
										</label>
										<label className="flex items-center gap-1 cursor-pointer">
											<input
												type="radio"
												name="civility"
												value="M."
												checked={civility === "M."}
												onChange={() => setCivility("M.")}
												className="sr-only"
											/>
											<span
												className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${civility === "M." ? "bg-nude-dark" : "bg-white"}`}
											/>
											M.
										</label>
									</div>
									<div className="flex flex-col sm:flex-row gap-2">
										<input
											className="border rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-[#d9c4b5] focus:outline-none min-w-0"
											placeholder="Nom"
											value={modalForm.nom}
											onChange={(e) =>
												setModalForm((f) => ({ ...f, nom: e.target.value }))
											}
											required
										/>
										<input
											className="border rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-[#d9c4b5] focus:outline-none min-w-0"
											placeholder="Prénom"
											value={modalForm.prenom}
											onChange={(e) =>
												setModalForm((f) => ({ ...f, prenom: e.target.value }))
											}
											required
										/>
									</div>
									<input
										className="border rounded px-2 py-1 focus:ring-2 focus:ring-[#d9c4b5] focus:outline-none"
										placeholder="N° et rue"
										value={modalForm.ligne1}
										onChange={(e) =>
											setModalForm((f) => ({ ...f, ligne1: e.target.value }))
										}
										required
									/>
									<input
										className="border rounded px-2 py-1 focus:ring-2 focus:ring-[#d9c4b5] focus:outline-none"
										placeholder="Complément (optionnel)"
										value={modalForm.ligne2}
										onChange={(e) =>
											setModalForm((f) => ({ ...f, ligne2: e.target.value }))
										}
									/>
									<div className="flex flex-col sm:flex-row gap-2">
										<input
											className="border rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-[#d9c4b5] focus:outline-none min-w-0"
											placeholder="Code postal"
											value={modalForm.codePostal}
											onChange={(e) =>
												setModalForm((f) => ({
													...f,
													codePostal: e.target.value,
												}))
											}
											required
										/>
										<input
											className="border rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-[#d9c4b5] focus:outline-none min-w-0"
											placeholder="Ville"
											value={modalForm.ville}
											onChange={(e) =>
												setModalForm((f) => ({ ...f, ville: e.target.value }))
											}
											required
										/>
									</div>
									<div className="flex gap-2 mt-2">
										<button
											type="submit"
											className="bg-nude-dark text-white px-4 py-2 rounded-2xl font-semibold hover:bg-logo transition-all"
										>
											Enregistrer
										</button>
										<button
											type="button"
											className="text-nude-dark underline px-4 py-2"
											onClick={() => setShowAddressMenu(false)}
										>
											Annuler
										</button>
									</div>
								</form>
							)}

							{/* Affichage des adresses locales ajoutées */}
							{localAddresses.length > 0 && (
								<div className="mt-4 flex flex-col gap-2">
									{localAddresses.map((addr) => (
										<div key={addr.id} className="flex items-center gap-3">
											<span
												className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors bg-nude-dark`}
											/>
											<div className="flex-1 bg-beige-light border border-nude-dark/30 rounded-lg p-4 max-w-md">
												<div className="text-logo font-semibold">
													{addr.lastName} {addr.firstName}
												</div>
												<div className="text-nude-dark">{addr.street}</div>
												<div className="text-nude-dark">
													{addr.zipCode} {addr.city}
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Livraison */}
							<div className="bg-[#d9c4b5]/35 rounded-2xl shadow-lg p-6 mb-8 mt-12">
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
											className="sr-only"
										/>
										<span
											className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${selectedDelivery === "domicile" ? "bg-nude-dark" : "bg-white"}`}
										></span>
										<span>À domicile (Colissimo)</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="delivery"
											value="relay"
											checked={selectedDelivery === "relay"}
											onChange={() => setSelectedDelivery("relay")}
											className="sr-only"
										/>
										<span
											className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${selectedDelivery === "relay" ? "bg-nude-dark" : "bg-white"}`}
										></span>
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
							<div className="bg-[#d9c4b5]/35 rounded-2xl shadow-lg p-6 mt-8 mb-6">
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
											className="sr-only"
										/>
										<span
											className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${selectedPayment === "cb" ? "bg-nude-dark" : "bg-white"}`}
										></span>
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
												className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#b49982]"
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
												className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#b49982]"
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
													className="border rounded px-2 py-1 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#b49982]"
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
													className="border rounded px-2 py-1 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#b49982]"
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
											className="sr-only"
										/>
										<span
											className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center transition-colors ${selectedPayment === "paypal" ? "bg-nude-dark" : "bg-white"}`}
										></span>
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
									{cartItems.map((item) => (
										<div
											key={item.id}
											className="flex items-center gap-3 border-b pb-2 last:border-b-0 last:pb-0"
										>
											<img
												src={item.image}
												alt={item.name}
												className="w-12 h-12 object-cover rounded"
											/>
											<div className="flex-1">
												<div className="text-base font-medium">{item.name}</div>
												<div className="text-sm text-gray-500">
													{item.color} - Taille {item.size} - Qté:{" "}
													{item.quantity}
												</div>
											</div>
											<div className="text-sm font-semibold">
												{(item.price * item.quantity).toFixed(2)} €
											</div>
										</div>
									))}
								</div>
								<div className="flex justify-between text-gray-600">
									<span>Sous-total HT</span>
									<span>{subtotalHT.toFixed(2)}€</span>
								</div>
								<div className="flex justify-between text-gray-600">
									<span>TVA (20%)</span>
									<span>{tva.toFixed(2)}€</span>
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
										🎉 Plus que {(50 - (subtotalHT + tva)).toFixed(2)}€ pour la
										livraison gratuite !
									</div>
								)}
								<div className="border-t border-gray-200 pt-4">
									<div className="flex justify-between text-xl font-semibold text-logo">
										<span>Total TTC</span>
										<span>{totalTTC.toFixed(2)}€</span>
									</div>
								</div>
							</div>

							{/* Bouton commander */}
							<button
								className={`w-[80%] md:w-[60%] lg:w-full 2xl:w-[80%] py-3 px-6 rounded-2xl text-base font-semibold transition-all duration-300 text-center block mt-4 cursor-pointer
    ${selectedPayment === "paypal" ? "bg-[#0750B4] hover:bg-[#063a80] text-white" : "bg-nude-dark border-2 text-white hover:bg-rose-dark hover:text-nude-dark hover:border-nude-dark"}`}
								onClick={() => {
									if (!selectedAddressId) {
										alert("Merci de sélectionner votre adresse de livraison.");
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
								className="w-full mt-3 py-2 rounded-2xl ring-1 ring-nude-dark text-nude-dark font-semibold bg-nude-light hover:bg-nude-dark hover:text-nude-light hover:border-nude-light transition cursor-pointer"
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
