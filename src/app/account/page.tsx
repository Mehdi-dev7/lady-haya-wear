"use client";

import { ChangeEvent, FormEvent, useState } from "react";

export default function AccountPage() {
	const [isEditing, setIsEditing] = useState(true);
	const [addresses, setAddresses] = useState({
		billing: { numero: "", rue: "", ville: "", codePostal: "" },
		shipping: { numero: "", rue: "", ville: "", codePostal: "" },
	});

	// Vérifie si au moins un champ d'adresse est rempli
	const isAddressFilled =
		Object.values(addresses.billing).some((v) => v.trim() !== "") ||
		Object.values(addresses.shipping).some((v) => v.trim() !== "");

	const handleAddressChange = (
		e: ChangeEvent<HTMLInputElement>,
		type: "billing" | "shipping"
	) => {
		setAddresses({
			...addresses,
			[type]: {
				...addresses[type],
				[e.target.name]: e.target.value,
			},
		});
	};

	const handleSave = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsEditing(false);
		// ... logique de sauvegarde
	};

	const handleEdit = () => setIsEditing(true);

	return (
		<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 min-h-screen flex items-center justify-center bg-beige-light animate-fade-in-up">
			<div className="w-full max-w-2xl bg-nude-light rounded-[30px] shadow-lg border border-nude-dark/30 p-8 md:p-12 mt-8">
				<h1 className="text-5xl md:text-6xl font-alex-brush text-logo mb-8 text-center">
					Mon compte
				</h1>
				<form className="space-y-6" onSubmit={handleSave}>
					{/* Autres champs utilisateur ici si besoin */}

					{/* Adresse de facturation */}
					<div>
						<label className="block text-lg font-semibold text-logo mb-2">
							Adresse de facturation
						</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
							<input
								type="text"
								name="numero"
								placeholder="Numéro"
								value={addresses.billing.numero}
								onChange={(e) => handleAddressChange(e, "billing")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
							<input
								type="text"
								name="rue"
								placeholder="Rue"
								value={addresses.billing.rue}
								onChange={(e) => handleAddressChange(e, "billing")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
							<input
								type="text"
								name="ville"
								placeholder="Ville"
								value={addresses.billing.ville}
								onChange={(e) => handleAddressChange(e, "billing")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
							<input
								type="text"
								name="codePostal"
								placeholder="Code postal"
								value={addresses.billing.codePostal}
								onChange={(e) => handleAddressChange(e, "billing")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
						</div>
					</div>

					{/* Adresse de livraison */}
					<div>
						<label className="block text-lg font-semibold text-logo mb-2">
							Adresse de livraison
						</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
							<input
								type="text"
								name="numero"
								placeholder="Numéro"
								value={addresses.shipping.numero}
								onChange={(e) => handleAddressChange(e, "shipping")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
							<input
								type="text"
								name="rue"
								placeholder="Rue"
								value={addresses.shipping.rue}
								onChange={(e) => handleAddressChange(e, "shipping")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
							<input
								type="text"
								name="ville"
								placeholder="Ville"
								value={addresses.shipping.ville}
								onChange={(e) => handleAddressChange(e, "shipping")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
							<input
								type="text"
								name="codePostal"
								placeholder="Code postal"
								value={addresses.shipping.codePostal}
								onChange={(e) => handleAddressChange(e, "shipping")}
								disabled={!isEditing}
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							/>
						</div>
					</div>

					<div className="pt-4 text-center">
						{isEditing ? (
							<button
								type="submit"
								className="bg-logo hover:bg-nude-dark text-white font-semibold px-10 py-3 rounded-full shadow btn-hover transition-all duration-200 cursor-pointer"
							>
								Sauvegarder
							</button>
						) : (
							<button
								type="button"
								className="bg-nude-dark hover:bg-logo text-white font-semibold px-10 py-3 rounded-full shadow btn-hover transition-all duration-200 cursor-pointer"
								onClick={handleEdit}
								disabled={!isAddressFilled}
							>
								Éditer
							</button>
						)}
					</div>
				</form>
			</div>
		</section>
	);
}
