"use client";

import Loader from "@/components/Loader";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Adresse = {
	civility: "M." | "Mme";
	prenom: string;
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
			civility: "M.",
			prenom: "",
			nom: "",
			ligne1: "",
			ligne2: "",
			codePostal: "",
			ville: "",
		}
	);
	useEffect(() => {
		if (open) {
			setForm(
				initial || {
					civility: "M.",
					prenom: "",
					nom: "",
					ligne1: "",
					ligne2: "",
					codePostal: "",
					ville: "",
				}
			);
		}
	}, [initial, open]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSave(form);
		onClose();
	};

	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-nude-light rounded-2xl shadow-lg p-4 sm:p-8 w-11/12 max-w-xs sm:max-w-lg relative animate-fade-in-up">
				<button
					className="absolute top-4 right-4 text-logo text-2xl font-bold hover:text-nude-dark cursor-pointer"
					onClick={onClose}
					type="button"
				>
					×
				</button>
				<h2 className="text-2xl font-bold text-logo mb-6 text-center">
					{initial ? "Modifier l'adresse" : "Ajouter une adresse"}
				</h2>
				<form className="space-y-4" onSubmit={handleSubmit}>
					{/* Civilité */}
					<div className="flex gap-6 mb-2">
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="civility"
								value="M."
								checked={form.civility === "M."}
								onChange={() => setForm({ ...form, civility: "M." })}
								className="hidden"
							/>
							<span
								className={`w-3 h-3 rounded-full border-2 border-nude-dark flex items-center justify-center ${form.civility === "M." ? "bg-nude-dark" : "bg-white"}`}
							></span>
							<span className="text-nude-dark text-sm">M.</span>
						</label>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="civility"
								value="Mme"
								checked={form.civility === "Mme"}
								onChange={() => setForm({ ...form, civility: "Mme" })}
								className="hidden"
							/>
							<span
								className={`w-3 h-3 rounded-full border-2 border-nude-dark flex items-center justify-center ${form.civility === "Mme" ? "bg-nude-dark" : "bg-white"}`}
							></span>
							<span className="text-nude-dark text-sm">Mme</span>
						</label>
					</div>
					<input
						type="text"
						name="nom"
						placeholder="Nom"
						value={form.nom || ""}
						onChange={handleChange}
						className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
						required
					/>
					<input
						type="text"
						name="prenom"
						placeholder="Prénom"
						value={form.prenom || ""}
						onChange={handleChange}
						className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
						required
					/>
					<input
						type="text"
						name="ligne1"
						placeholder="Ligne d'adresse 1"
						value={form.ligne1 || ""}
						onChange={handleChange}
						className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
						required
					/>
					<input
						type="text"
						name="ligne2"
						placeholder="Ligne d'adresse 2 (facultatif)"
						value={form.ligne2 || ""}
						onChange={handleChange}
						className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
					/>
					<div className="flex gap-4">
						<input
							type="text"
							name="codePostal"
							placeholder="Code postal"
							value={form.codePostal || ""}
							onChange={handleChange}
							className="w-1/2 min-w-0 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							required
						/>
						<input
							type="text"
							name="ville"
							placeholder="Ville"
							value={form.ville || ""}
							onChange={handleChange}
							className="w-1/2 min-w-0 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
							required
						/>
					</div>
					<div className="pt-4 text-center">
						<button
							type="submit"
							className="bg-logo hover:bg-nude-dark text-white font-semibold px-8 py-2 rounded-full shadow btn-hover transition-all duration-200 cursor-pointer"
						>
							Valider
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function PasswordModal({
	open,
	onClose,
	onSave,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (current: string, next: string) => void;
}) {
	const [current, setCurrent] = useState("");
	const [next, setNext] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNext, setShowNext] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open) {
			setCurrent("");
			setNext("");
			setConfirm("");
			setShowCurrent(false);
			setShowNext(false);
			setShowConfirm(false);
			setLoading(false);
		}
	}, [open]);

	const validatePassword = (pwd: string) => {
		return (
			/[A-Z]/.test(pwd) &&
			/[a-z]/.test(pwd) &&
			/[0-9]/.test(pwd) &&
			pwd.length >= 8
		);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (next !== confirm) {
			toast.error("Les mots de passe ne correspondent pas");
			return;
		}
		if (!validatePassword(next)) {
			toast.error(
				"Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
			);
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/user/account/password", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword: current, newPassword: next }),
			});
			const data = await res.json();
			if (!res.ok || data.error) {
				toast.error(data.error || "Erreur lors du changement de mot de passe");
			} else {
				toast.success("Mot de passe modifié avec succès");
				onClose();
			}
		} catch (err) {
			toast.error("Erreur réseau ou serveur");
		} finally {
			setLoading(false);
		}
	};

	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-nude-light rounded-2xl shadow-lg p-4 sm:p-8 w-11/12 max-w-xs sm:max-w-md relative animate-fade-in-up">
				<button
					className="absolute top-4 right-4 text-logo text-2xl font-bold hover:text-nude-dark cursor-pointer"
					onClick={onClose}
					type="button"
				>
					×
				</button>
				<h2 className="text-2xl font-bold text-logo mb-6 text-center">
					Modifier le mot de passe
				</h2>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="relative">
						<input
							type={showCurrent ? "text" : "password"}
							name="current"
							placeholder="Mot de passe actuel"
							value={current}
							onChange={(e) => setCurrent(e.target.value)}
							className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark pr-10"
							required
						/>
						{showCurrent ? (
							<IoEyeSharp
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-nude-dark cursor-pointer"
								onClick={() => setShowCurrent((v) => !v)}
								title="Masquer"
							/>
						) : (
							<FaRegEyeSlash
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-nude-dark cursor-pointer"
								onClick={() => setShowCurrent((v) => !v)}
								title="Afficher"
							/>
						)}
					</div>
					<div className="relative">
						<input
							type={showNext ? "text" : "password"}
							name="next"
							placeholder="Nouveau mot de passe"
							value={next}
							onChange={(e) => setNext(e.target.value)}
							className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark pr-10"
							required
						/>
						{showNext ? (
							<IoEyeSharp
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-nude-dark cursor-pointer"
								onClick={() => setShowNext((v) => !v)}
								title="Masquer"
							/>
						) : (
							<FaRegEyeSlash
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-nude-dark cursor-pointer"
								onClick={() => setShowNext((v) => !v)}
								title="Afficher"
							/>
						)}
					</div>
					<div className="relative">
						<input
							type={showConfirm ? "text" : "password"}
							name="confirm"
							placeholder="Confirmer le nouveau mot de passe"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark pr-10"
							required
						/>
						{showConfirm ? (
							<IoEyeSharp
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-nude-dark cursor-pointer"
								onClick={() => setShowConfirm((v) => !v)}
								title="Masquer"
							/>
						) : (
							<FaRegEyeSlash
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-nude-dark cursor-pointer"
								onClick={() => setShowConfirm((v) => !v)}
								title="Afficher"
							/>
						)}
					</div>
					<div className="pt-4 text-center">
						<button
							type="submit"
							className="bg-logo hover:bg-nude-dark text-white font-semibold px-8 py-2 rounded-full shadow btn-hover transition-all duration-200 cursor-pointer"
							disabled={loading}
						>
							{loading ? "Enregistrement..." : "Valider"}
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
		civility: "M.",
		prenom: "",
	});
	const [editing, setEditing] = useState({
		nom: fields.nom === "",
		prenom: fields.prenom === "",
		email: fields.email === "",
		telephone: fields.telephone === "",
		password: fields.password === "",
	});
	const [adresse, setAdresse] = useState<null | any>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [providers, setProviders] = useState<string[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [passwordModalOpen, setPasswordModalOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	// Ajout d'un state pour les erreurs de validation
	const [errors, setErrors] = useState({ nom: "", prenom: "", telephone: "" });
	// Ajout d'un state pour les champs touchés
	const [touched, setTouched] = useState({
		nom: false,
		prenom: false,
		telephone: false,
	});
	const [loading, setLoading] = useState(true);

	const nomInputRef = useRef<HTMLInputElement>(null);
	const emailInputRef = useRef<HTMLInputElement>(null);
	const telInputRef = useRef<HTMLInputElement>(null);

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
						civility: data.user.civility || "M.",
						prenom: data.user.prenom || "",
					}));
					setEditing({
						nom: false,
						prenom: false,
						email: false,
						telephone: false,
						password: false,
					});
				}
				setLoading(false);
			});
	}, []);

	// Charger l'adresse principale à l'ouverture
	useEffect(() => {
		fetch("/api/user/account/address")
			.then((res) => res.json())
			.then((data) => {
				if (data.address) {
					setAdresse({
						nom: data.address.lastName || "",
						prenom: data.address.firstName || "",
						civility:
							data.address.civility === "MR"
								? "M."
								: data.address.civility === "MME"
									? "Mme"
									: fields.civility || "M.",
						ligne1: data.address.street || "",
						ligne2: data.address.company || "",
						codePostal: data.address.zipCode || "",
						ville: data.address.city || "",
					});
				}
			});
	}, [fields.civility]);

	if (loading) return <Loader fullPage />;

	// Fonction de capitalisation
	function capitalize(str: string) {
		return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
	}

	// Fonction de validation nom/prénom
	function validateNom(nom: string) {
		const trimmed = nom.trim();
		if (!trimmed) return "Le nom est requis.";
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,20}$/.test(trimmed))
			return "Le nom doit contenir uniquement des lettres, espaces, tirets ou apostrophes (2-20 caractères).";
		return "";
	}

	// Fonction de validation téléphone
	function validateTel(tel: string) {
		const onlyDigits = tel.replace(/\D/g, "");
		if (!onlyDigits) return "Le numéro est requis.";
		if (!/^\d{10,15}$/.test(onlyDigits))
			return "Le numéro doit contenir entre 10 et 15 chiffres.";
		return "";
	}

	// Fonction de formatage téléphone (FR : espace tous les 2 chiffres)
	function formatTel(tel: string) {
		const onlyDigits = tel.replace(/\D/g, "");
		return onlyDigits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
	}

	// Handler de changement
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let newValue = value;
		let newErrors = { ...errors };
		if (name === "nom") {
			newValue = newValue.replace(/\s{2,}/g, " "); // pas de double espace
			newErrors.nom = validateNom(newValue);
		}
		if (name === "prenom") {
			newValue = newValue.replace(/\s{2,}/g, " "); // pas de double espace
			newErrors.prenom = validateNom(newValue);
		}
		if (name === "telephone") {
			newValue = formatTel(newValue);
			newErrors.telephone = validateTel(newValue);
		}
		setFields({ ...fields, [name]: newValue });
		setErrors(newErrors);
	};

	// Handler de blur pour trim/capitalisation
	const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let newValue = value.trim();
		if (name === "nom") newValue = capitalize(newValue);
		if (name === "prenom") newValue = capitalize(newValue);
		if (name === "telephone") newValue = formatTel(newValue);
		setFields({ ...fields, [name]: newValue });
		// Revalider au blur
		let newErrors = { ...errors };
		if (name === "nom") newErrors.nom = validateNom(newValue);
		if (name === "prenom") newErrors.prenom = validateNom(newValue);
		if (name === "telephone") newErrors.telephone = validateTel(newValue);
		setErrors(newErrors);
		setEditing({ ...editing, [name]: false });
		setTouched({ ...touched, [name]: true });
	};

	const handleEdit = (field: keyof typeof fields) => {
		if (field === "password" && providers.includes("google")) return;
		setEditing({ ...editing, [field]: true });
		setTimeout(() => {
			if (field === "nom") nomInputRef.current?.focus();
			if (field === "prenom") emailInputRef.current?.focus();
			if (field === "email") emailInputRef.current?.focus();
			if (field === "telephone") telInputRef.current?.focus();
		}, 0);
	};

	// Dans handleSave, marquer tous les champs comme touchés avant validation
	const handleSave = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setTouched({ nom: true, prenom: true, telephone: true });
		setEditing({
			nom: false,
			prenom: false,
			email: false,
			telephone: false,
			password: false,
		});
		try {
			const res = await fetch("/api/user/account", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nom: fields.nom,
					email: fields.email,
					telephone: fields.telephone,
					civility: fields.civility,
					prenom: fields.prenom,
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
				body: JSON.stringify({
					nom: a.nom,
					prenom: a.prenom,
					civility: a.civility,
					ligne1: a.ligne1,
					ligne2: a.ligne2,
					codePostal: a.codePostal,
					ville: a.ville,
				}),
			});
			if (res.ok) {
				const data = await res.json();
				setAdresse({
					nom: data.address.lastName || "",
					prenom: data.address.firstName || "",
					civility:
						data.address.civility === "MR"
							? "M."
							: data.address.civility === "MME"
								? "Mme"
								: "",
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

	// Ajoute la fonction de gestion de la sauvegarde du mot de passe
	const handleSavePassword = async (current: string, next: string) => {
		// Ici tu pourras brancher l'appel API
		// toast.success("Mot de passe modifié (simulation)"); // This line is removed
	};

	return (
		<>
			<ToastContainer position="top-center" autoClose={3000} />
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 min-h-screen flex items-center justify-center bg-beige-light animate-fade-in-up">
				<AdresseModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onSave={handleSaveAdresse}
					initial={
						adresse || {
							nom: fields.nom || "",
							prenom: fields.prenom || "",
							civility: fields.civility || "M.",
							ligne1: "",
							ligne2: "",
							codePostal: "",
							ville: "",
						}
					}
				/>
				<PasswordModal
					open={passwordModalOpen}
					onClose={() => setPasswordModalOpen(false)}
					onSave={handleSavePassword}
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
						{/* Nom & Prénom avec civilité */}
						<div>
							{/* Civilité */}
							<div className="flex gap-6 mb-4">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="civility"
										value="M."
										checked={fields.civility === "M."}
										onChange={() => setFields({ ...fields, civility: "M." })}
										className="hidden"
									/>
									<span
										className={`w-3 h-3 rounded-full border-2 border-nude-dark flex items-center justify-center ${fields.civility === "M." ? "bg-nude-dark" : "bg-white"}`}
									></span>
									<span className="text-nude-dark text-sm">M.</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="civility"
										value="Mme"
										checked={fields.civility === "Mme"}
										onChange={() => setFields({ ...fields, civility: "Mme" })}
										className="hidden"
									/>
									<span
										className={`w-3 h-3 rounded-full border-2 border-nude-dark flex items-center justify-center ${fields.civility === "Mme" ? "bg-nude-dark" : "bg-white"}`}
									></span>
									<span className="text-nude-dark text-sm">Mme</span>
								</label>
							</div>
							{/* Section nom */}
							<div className="mb-2">
								<label className="block text-lg font-semibold text-logo mb-2">
									Nom
								</label>
								<div className="flex gap-2 items-center">
									<div className="flex-1">
										<input
											ref={nomInputRef}
											type="text"
											name="nom"
											placeholder="Votre nom"
											value={fields.nom}
											onChange={handleChange}
											onBlur={handleBlur}
											disabled={!editing.nom}
											maxLength={20}
											className="border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark w-full"
										/>
										{touched.nom && errors.nom && (
											<div className="text-xs text-red-500 mt-1">
												{errors.nom}
											</div>
										)}
									</div>
									{!editing.nom && (
										<>
											<button
												type="button"
												className="hidden md:inline-block bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200 cursor-pointer"
												onClick={() => handleEdit("nom")}
											>
												Modifier
											</button>
											<CiEdit
												className="md:hidden text-2xl text-nude-dark cursor-pointer flex-shrink-0"
												onClick={() => handleEdit("nom")}
												title="Modifier"
											/>
										</>
									)}
								</div>
							</div>
							{/* Section prénom */}
							<div className="mb-2">
								<label className="block text-lg font-semibold text-logo mb-2">
									Prénom
								</label>
								<div className="flex gap-2 items-center">
									<div className="flex-1">
										<input
											type="text"
											name="prenom"
											placeholder="Votre prénom"
											value={fields.prenom || ""}
											onChange={handleChange}
											onBlur={handleBlur}
											disabled={!editing.prenom}
											maxLength={20}
											className="border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark w-full"
										/>
										{touched.prenom && errors.prenom && (
											<div className="text-xs text-red-500 mt-1">
												{errors.prenom}
											</div>
										)}
									</div>
									{!editing.prenom && (
										<>
											<button
												type="button"
												className="hidden md:inline-block bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200 cursor-pointer"
												onClick={() => handleEdit("prenom")}
											>
												Modifier
											</button>
											<CiEdit
												className="md:hidden text-2xl text-nude-dark cursor-pointer flex-shrink-0"
												onClick={() => handleEdit("prenom")}
												title="Modifier"
											/>
										</>
									)}
								</div>
							</div>
						</div>
						{/* Email */}
						<div>
							<label className="block text-lg font-semibold text-logo mb-2">
								Email
							</label>
							<div className="flex gap-2 items-center">
								<input
									ref={emailInputRef}
									type="email"
									name="email"
									placeholder="Votre email"
									value={fields.email}
									onChange={handleChange}
									onBlur={() => setEditing({ ...editing, email: false })}
									disabled={!editing.email}
									className="flex-1 border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
								/>
								{!editing.email && (
									<>
										<button
											type="button"
											className="hidden md:inline-block bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200 cursor-pointer"
											onClick={() => handleEdit("email")}
										>
											Modifier
										</button>
										<CiEdit
											className="md:hidden text-2xl text-nude-dark cursor-pointer flex-shrink-0"
											onClick={() => handleEdit("email")}
											title="Modifier"
										/>
									</>
								)}
							</div>
						</div>
						{/* Téléphone */}
						<div>
							<label className="block text-lg font-semibold text-logo mb-2">
								Téléphone
							</label>
							<div className="flex gap-2 items-center">
								<div className="flex flex-col flex-1">
									<input
										ref={telInputRef}
										type="text"
										name="telephone"
										placeholder="Votre numéro de téléphone"
										value={fields.telephone}
										onChange={handleChange}
										onBlur={handleBlur}
										disabled={!editing.telephone}
										className="border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
									/>
									{touched.telephone && errors.telephone && (
										<div className="text-xs text-red-500 mt-1">
											{errors.telephone}
										</div>
									)}
								</div>
								{!editing.telephone && (
									<>
										<button
											type="button"
											className="hidden md:inline-block bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200 cursor-pointer"
											onClick={() => handleEdit("telephone")}
										>
											Modifier
										</button>
										<CiEdit
											className="md:hidden text-2xl text-nude-dark cursor-pointer flex-shrink-0"
											onClick={() => handleEdit("telephone")}
											title="Modifier"
										/>
									</>
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
									<div className="text-logo font-semibold">
										{adresse.nom} {adresse.prenom}
									</div>
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
									<div className="flex-1">
										<input
											type="password"
											name="password"
											placeholder="********"
											value={fields.password}
											onChange={handleChange}
											disabled={!editing.password}
											className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark pr-10"
										/>
									</div>
									{!editing.password && (
										<>
											<button
												type="button"
												className="hidden md:inline-block bg-nude-dark hover:bg-logo text-white font-semibold px-4 py-2 rounded shadow btn-hover transition-all duration-200 cursor-pointer"
												onClick={() => setPasswordModalOpen(true)}
											>
												Modifier
											</button>
											<CiEdit
												className="md:hidden text-2xl text-nude-dark cursor-pointer flex-shrink-0"
												onClick={() => setPasswordModalOpen(true)}
												title="Modifier"
											/>
										</>
									)}
								</div>
							</div>
						)}
						{/* DEBUG providers */}
						{/* <div className="text-xs text-nude-dark mb-2">
							providers: {JSON.stringify(providers)}
						</div> */}
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
