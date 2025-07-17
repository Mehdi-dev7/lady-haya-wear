"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Adresse = {
	nom: string;
	ligne1: string;
	ligne2: string;
	codePostal: string;
	ville: string;
};

type AdresseModalProps = {
	open: boolean;
	onClose: () => void;
	onSave: (a: Adresse) => void;
	initial: Adresse | null;
};

function AdresseModal({ open, onClose, onSave, initial }: AdresseModalProps) {
	const [form, setForm] = useState<Adresse>(
		initial || {
			nom: "",
			ligne1: "",
			ligne2: "",
			codePostal: "",
			ville: "",
		}
	);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSave(form);
		onClose();
	};

	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-nude-light rounded-2xl shadow-lg p-8 w-full max-w-lg relative animate-fade-in-up">
				<button
					className="absolute top-4 right-4 text-logo text-2xl font-bold hover:text-nude-dark"
					onClick={onClose}
					type="button"
				>
					×
				</button>
				<h2 className="text-2xl font-bold text-logo mb-6 text-center">
					{initial ? "Modifier l'adresse" : "Ajouter une adresse"}
				</h2>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<input
						type="text"
						name="nom"
						placeholder="Nom complet"
						value={form.nom}
						onChange={handleChange}
						className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 bg-beige-light text-logo placeholder-nude-dark"
						required
					/>
					<input
						type="text"
						name="ligne1"
						placeholder="Ligne d'adresse 1"
						value={form.ligne1}
						onChange={handleChange}
						className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 bg-beige-light text-logo placeholder-nude-dark"
						required
					/>
					<input
						type="text"
						name="ligne2"
						placeholder="Ligne d'adresse 2 (facultatif)"
						value={form.ligne2}
						onChange={handleChange}
						className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 bg-beige-light text-logo placeholder-nude-dark"
					/>
					<div className="flex gap-4">
						<input
							type="text"
							name="codePostal"
							placeholder="Code postal"
							value={form.codePostal}
							onChange={handleChange}
							className="flex-1 border border-nude-dark/40 rounded-lg px-4 py-2 bg-beige-light text-logo placeholder-nude-dark"
							required
						/>
						<input
							type="text"
							name="ville"
							placeholder="Ville"
							value={form.ville}
							onChange={handleChange}
							className="flex-1 border border-nude-dark/40 rounded-lg px-4 py-2 bg-beige-light text-logo placeholder-nude-dark"
							required
						/>
					</div>
					<div className="pt-4 text-center">
						<button
							type="submit"
							className="bg-logo hover:bg-nude-dark text-white font-semibold px-8 py-2 rounded-full shadow btn-hover transition-all duration-200"
						>
							Valider
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function AccountPage() {
	const [fields, setFields] = useState({
		nom: "",
		email: "",
		telephone: "",
		password: "",
	});
	const [editing, setEditing] = useState({
		nom: fields.nom === "",
		email: fields.email === "",
		telephone: fields.telephone === "",
		password: fields.password === "",
	});
	const [adresse, setAdresse] = useState<null | any>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [providers, setProviders] = useState<string[]>([]);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		// Récupération des providers (déjà présent)
		fetch("/api/user/account")
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data.providers)) setProviders(data.providers);
				// Récupération des infos utilisateur
				if (data.user) {
					setFields((prev) => ({
						...prev,
						nom: data.user.nom || "",
						email: data.user.email || "",
						telephone: data.user.telephone || "",
					}));
					setEditing({
						nom: false,
						email: false,
						telephone: false,
						password: false,
					});
				}
			});
	}, []);

	// Charger l'adresse principale à l'ouverture
	useEffect(() => {
		fetch("/api/user/account/address")
			.then((res) => res.json())
			.then((data) => {
				if (data.address) {
					setAdresse({
						nom: data.address.firstName || "",
						ligne1: data.address.street || "",
						ligne2: data.address.company || "",
						codePostal: data.address.zipCode || "",
						ville: data.address.city || "",
					});
				}
			});
	}, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFields({ ...fields, [e.target.name]: e.target.value });
	};

	const handleEdit = (field: keyof typeof fields) => {
		if (field === "password" && providers.includes("google")) return;
		setEditing({ ...editing, [field]: true });
	};

	const handleSave = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setEditing({
			nom: fields.nom === "",
			email: fields.email === "",
			telephone: fields.telephone === "",
			password: fields.password === "",
		});
		try {
			const res = await fetch("/api/user/account", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nom: fields.nom,
					email: fields.email,
					telephone: fields.telephone,
				}),
			});
			if (res.ok) {
				toast.success("Modifications enregistrées !");
			} else {
				const data = await res.json();
				toast.error(data.error || "Erreur lors de la sauvegarde");
			}
		} catch (err) {
			toast.error("Erreur réseau ou serveur");
		}
	};

	// Sauvegarde de l'adresse depuis la modale
	const handleSaveAdresse = async (a: Adresse) => {
		try {
			const res = await fetch("/api/user/account/address", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(a),
			});
			if (res.ok) {
				const data = await res.json();
				setAdresse({
					nom: data.address.firstName || "",
					ligne1: data.address.street || "",
					ligne2: data.address.company || "",
					codePostal: data.address.zipCode || "",
					ville: data.address.city || "",
				});
				toast.success("Adresse enregistrée !");
			} else {
				const data = await res.json();
				toast.error(data.error || "Erreur lors de la sauvegarde de l'adresse");
			}
		} catch (err) {
			toast.error(
				"Erreur réseau ou serveur lors de la sauvegarde de l'adresse"
			);
		}
	};

	return (
		<>
			<ToastContainer position="top-center" />
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 min-h-screen flex items-center justify-center bg-beige-light animate-fade-in-up">
				<AdresseModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onSave={handleSaveAdresse}
					initial={adresse}
				/>
				<div className="w-full max-w-xl bg-nude-light rounded-[30px] shadow-lg border border-nude-dark/30 p-8 md:p-12 mt-8">
					<h1 className="text-5xl md:text-6xl font-alex-brush text-logo mb-8 text-center">
						Mon compte
					</h1>
					<form className="space-y-6" onSubmit={handleSave}>
						{message && (
							<div className="text-center text-logo font-semibold mb-4">
								{message}
							</div>
						)}
						{/* Nom */}
						<div>
							<label className="block text-lg font-semibold text-logo mb-2">
								Nom & Prénom
							</label>
							<div className="flex gap-2 items-center">
								<input
									type="text"
									name="nom"
									placeholder="Votre nom"
									value={fields.nom}
									onChange={handleChange}
									disabled={!editing.nom}
									className="flex-1 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
								/>
								{!editing.nom && (
									<button
										type="button"
										className="bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200"
										onClick={() => handleEdit("nom")}
									>
										Modifier
									</button>
								)}
							</div>
						</div>
						{/* Email */}
						<div>
							<label className="block text-lg font-semibold text-logo mb-2">
								Email
							</label>
							<div className="flex gap-2 items-center">
								<input
									type="email"
									name="email"
									placeholder="Votre email"
									value={fields.email}
									onChange={handleChange}
									disabled={!editing.email}
									className="flex-1 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
								/>
								{!editing.email && (
									<button
										type="button"
										className="bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200"
										onClick={() => handleEdit("email")}
									>
										Modifier
									</button>
								)}
							</div>
						</div>
						{/* Téléphone */}
						<div>
							<label className="block text-lg font-semibold text-logo mb-2">
								Téléphone
							</label>
							<div className="flex gap-2 items-center">
								<input
									type="text"
									name="telephone"
									placeholder="Votre numéro de téléphone"
									value={fields.telephone}
									onChange={handleChange}
									disabled={!editing.telephone}
									className="flex-1 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
								/>
								{!editing.telephone && (
									<button
										type="button"
										className="bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200"
										onClick={() => handleEdit("telephone")}
									>
										Modifier
									</button>
								)}
							</div>
						</div>
						{/* Adresse */}
						<div>
							<label className="block text-lg font-semibold text-logo mb-2">
								Adresse
							</label>
							{adresse ? (
								<div className="bg-beige-light border border-nude-dark/30 rounded-lg p-4 flex flex-col gap-2 mb-2">
									<div className="text-logo font-semibold">{adresse.nom}</div>
									<div className="text-nude-dark">{adresse.ligne1}</div>
									{adresse.ligne2 && (
										<div className="text-nude-dark">{adresse.ligne2}</div>
									)}
									<div className="text-nude-dark">
										{adresse.codePostal} {adresse.ville}
									</div>
									<button
										type="button"
										className="mt-2 bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200 self-end cursor-pointer"
										onClick={() => setModalOpen(true)}
									>
										Modifier l'adresse
									</button>
								</div>
							) : (
								<button
									type="button"
									className="bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200 cursor-pointer"
									onClick={() => setModalOpen(true)}
								>
									Ajouter une adresse
								</button>
							)}
						</div>
						{/* Mot de passe */}
						{!providers.includes("google") && (
							<div>
								<label className="block text-lg font-semibold text-logo mb-2">
									Mot de passe
								</label>
								<div className="flex gap-2 items-center">
									<input
										type="password"
										name="password"
										placeholder="********"
										value={fields.password}
										onChange={handleChange}
										disabled={!editing.password}
										className="flex-1 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
									/>
									{!editing.password && (
										<button
											type="button"
											className="bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200"
											onClick={() => handleEdit("password")}
										>
											Modifier
										</button>
									)}
								</div>
							</div>
						)}
						{/* DEBUG providers */}
						<div className="text-xs text-nude-dark mb-2">
							providers: {JSON.stringify(providers)}
						</div>
						<div className="pt-4 text-center">
							<button
								type="submit"
								className="bg-logo hover:bg-nude-dark text-white font-semibold px-10 py-3 rounded-full shadow btn-hover transition-all duration-200 cursor-pointer"
							>
								Sauvegarder
							</button>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}
