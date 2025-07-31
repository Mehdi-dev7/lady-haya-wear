"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { Copy, Edit, Plus, Ticket, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PromosPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const typeMenuRef = useRef<HTMLDivElement>(null);
	const [newPromo, setNewPromo] = useState({
		code: "",
		discount: "",
		type: "Pourcentage",
		validFrom: "",
		validTo: "",
		maxUsage: "",
		minAmount: "",
	});

	// Fermeture de la modale au clic extérieur
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				setIsModalOpen(false);
			}
		};

		if (isModalOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isModalOpen]);

	// Fermeture du menu de type au clic extérieur
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				typeMenuRef.current &&
				!typeMenuRef.current.contains(event.target as Node)
			) {
				setIsTypeMenuOpen(false);
			}
		};

		if (isTypeMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isTypeMenuOpen]);

	// Charger les codes promo depuis l'API
	const loadPromos = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/admin/promo");
			if (response.ok) {
				const data = await response.json();
				setPromos(data);
			} else {
				console.error("Erreur lors du chargement des codes promo");
			}
		} catch (error) {
			console.error("Erreur lors du chargement des codes promo:", error);
		} finally {
			setLoading(false);
		}
	};

	// Charger les données au montage du composant
	useEffect(() => {
		loadPromos();
	}, []);

	// Données des promotions
	const [promos, setPromos] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Active":
				return "bg-green-100 text-green-800";
			case "Expirée":
				return "bg-red-100 text-red-800";
			case "Inactive":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const copyToClipboard = (code: string) => {
		navigator.clipboard.writeText(code);
		setToast({
			message: "Code copié dans le presse-papiers !",
			type: "success",
		});
	};

	const handleDeletePromo = async (id: string) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce code de promotion ?")) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/promo/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				// Recharger la liste
				await loadPromos();
				setToast({
					message: "Code de promotion supprimé avec succès !",
					type: "success",
				});
			} else {
				const errorData = await response.json();
				setToast({ message: `Erreur : ${errorData.error}`, type: "error" });
			}
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			setToast({
				message: "Erreur lors de la suppression du code promo",
				type: "error",
			});
		}
	};

	const handleEditPromo = async (id: string) => {
		try {
			const response = await fetch(`/api/admin/promo/${id}`);
			if (response.ok) {
				const promoData = await response.json();

				// Remplir le formulaire avec les données existantes
				setNewPromo({
					code: promoData.code,
					discount: promoData.discount,
					type: promoData.type,
					validFrom: promoData.validFrom,
					validTo: promoData.validTo,
					maxUsage: promoData.maxUsage,
					minAmount: promoData.minAmount || "",
				});

				setEditingId(id);
				setIsEditing(true);
				setIsModalOpen(true);
			} else {
				setToast({
					message: "Erreur lors du chargement du code promo",
					type: "error",
				});
			}
		} catch (error) {
			console.error("Erreur lors du chargement:", error);
			setToast({
				message: "Erreur lors du chargement du code promo",
				type: "error",
			});
		}
	};

	const resetForm = () => {
		setNewPromo({
			code: "",
			discount: "",
			type: "Pourcentage",
			validFrom: "",
			validTo: "",
			maxUsage: "",
			minAmount: "",
		});
		setIsEditing(false);
		setEditingId(null);
	};

	const handleCreatePromo = async () => {
		try {
			// Validation des champs obligatoires
			if (
				!newPromo.code ||
				!newPromo.discount ||
				!newPromo.validFrom ||
				!newPromo.validTo
			) {
				setToast({
					message:
						"Veuillez remplir le code, le montant, la date de début et la date de fin",
					type: "error",
				});
				return;
			}

			// Validation des dates
			if (newPromo.validTo < newPromo.validFrom) {
				setToast({
					message:
						"La date de fin ne peut pas être antérieure à la date de début",
					type: "error",
				});
				return;
			}

			// Préparer les données pour l'API
			const promoData = {
				code: newPromo.code.toUpperCase(),
				discount:
					newPromo.type === "Pourcentage"
						? `${newPromo.discount}%`
						: `€${newPromo.discount}`,
				type: newPromo.type,
				validFrom: newPromo.validFrom,
				validTo: newPromo.validTo,
				maxUsage: newPromo.maxUsage ? parseInt(newPromo.maxUsage) : null,
				minAmount: newPromo.minAmount ? parseFloat(newPromo.minAmount) : null,
			};

			let response;
			if (isEditing && editingId) {
				// Modification
				response = await fetch(`/api/admin/promo/${editingId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(promoData),
				});
			} else {
				// Création
				response = await fetch("/api/admin/promo", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(promoData),
				});
			}

			if (response.ok) {
				// Recharger la liste complète
				await loadPromos();

				// Fermer la modale
				setIsModalOpen(false);

				// Réinitialiser le formulaire
				resetForm();

				// Notification de succès
				setToast({
					message: isEditing
						? "Code de promotion modifié avec succès !"
						: "Code de promotion créé avec succès !",
					type: "success",
				});
			} else {
				const error = await response.json();
				setToast({
					message: `Erreur: ${error.message || "Impossible de traiter le code promo"}`,
					type: "error",
				});
			}
		} catch (error) {
			console.error("Erreur lors du traitement:", error);
			setToast({
				message: isEditing
					? "Erreur lors de la modification du code promo"
					: "Erreur lors de la création du code promo",
				type: "error",
			});
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="space-y-6">
			{/* En-tête */}
			<div>
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-logo">
							Promotions
						</h1>
						<p className="text-nude-dark mt-1 text-sm sm:text-base">
							Gérez vos codes de réduction et promotions
						</p>
					</div>
				</div>
				<div className="flex justify-end mt-4">
					<Button
						onClick={() => {
							resetForm();
							setIsModalOpen(true);
						}}
						className="flex items-center space-x-1 sm:space-x-2 bg-nude-dark text-beige-light hover:bg-nude-dark-2 cursor-pointer hover:scale-102 transition-all duration-300 px-2 py-1 sm:px-4 sm:py-2"
					>
						<Plus className="h-3 w-3 sm:h-4 sm:w-4" />
						<span className="text-sm sm:text-base">Nouvelle promotion</span>
					</Button>
				</div>
			</div>

			{/* Statistiques dynamiques basées sur les vraies données */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardContent className="p-4 sm:p-5 bg-[#d9c4b5]/45 border border-rose-medium">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Promotions actives
								</p>
								<p className="text-xl sm:text-2xl font-bold text-gray-900">
									{promos.filter((p) => p.status === "Active").length}
								</p>
							</div>
							<Ticket className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-5 bg-[#d9c4b5]/45 border border-rose-medium">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Utilisations totales
								</p>
								<p className="text-xl sm:text-2xl font-bold text-gray-900">
									{promos.reduce((total, p) => total + p.usage, 0)}
								</p>
							</div>
							<div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
								<span className="text-blue-600 font-bold text-sm">
									{promos.reduce((total, p) => total + p.usage, 0)}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-5 bg-[#d9c4b5]/45 border border-rose-medium">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total des promotions
								</p>
								<p className="text-xl sm:text-2xl font-bold text-gray-900">
									{promos.length}
								</p>
							</div>
							<div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
								<span className="text-purple-600 font-bold text-sm">
									{promos.length}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Liste des promotions */}
			<Card>
				<CardHeader className="pb-2 sm:pb-6">
					<CardTitle className="text-nude-dark text-base sm:text-lg">
						Codes de réduction
					</CardTitle>
				</CardHeader>
				<CardContent className="p-2 sm:p-6">
					{loading ? (
						<div className="text-center py-6 sm:py-8">
							<div className="text-gray-500">Chargement des codes promo...</div>
						</div>
					) : (
						<div className="space-y-2 sm:space-y-4">
							{promos.map((promo) => (
								<div
									key={promo.id}
									className="border border-gray-200 rounded-lg p-2 sm:p-4 hover:bg-gray-50 transition-colors"
								>
									{/* En-tête mobile - Code et réduction */}
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
										{/* Code et réduction */}
										<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
											{/* Code */}
											<div className="flex items-center gap-2">
												<span className="font-mono font-bold text-base sm:text-lg text-blue-600">
													{promo.code}
												</span>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(promo.code)}
													className="h-6 w-6 p-0 hover:bg-blue-50"
												>
													<Copy className="h-3 w-3" />
												</Button>
											</div>

											{/* Réduction */}
											<div className="flex items-center gap-2">
												<span className="text-base sm:text-lg font-bold text-green-600">
													-{promo.discount}
												</span>
												<span className="text-xs sm:text-sm text-gray-500">
													({promo.type})
												</span>
											</div>
										</div>

										{/* Statut et actions */}
										<div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
											{/* Statut */}
											<span
												className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(promo.status)}`}
											>
												{promo.status}
											</span>

											{/* Actions */}
											<div className="flex items-center gap-1 sm:gap-2">
												<Button
													variant="outline"
													size="sm"
													className="text-green-600 hover:text-green-700 cursor-pointer h-8 w-8 sm:h-9 sm:w-9 p-0"
													onClick={() => handleEditPromo(promo.id)}
												>
													<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="text-red-600 hover:text-red-700 cursor-pointer h-8 w-8 sm:h-9 sm:w-9 p-0"
													onClick={() => handleDeletePromo(promo.id)}
												>
													<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
												</Button>
											</div>
										</div>
									</div>

									{/* Informations détaillées */}
									<div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 text-xs sm:text-sm">
											{/* Utilisations */}
											<div className="text-gray-600">
												{promo.usage}/{promo.maxUsage || "∞"} utilisations
											</div>

											{/* Dates */}
											<div className="text-gray-500">
												{promo.validFrom} - {promo.validTo}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Modal pour créer une nouvelle promotion */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div
						ref={modalRef}
						className="bg-nude-light rounded-2xl shadow-lg w-11/12 max-w-md sm:max-w-lg max-h-[90vh] flex flex-col animate-fade-in-up"
					>
						{/* En-tête de la modale */}
						<div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
							<button
								className="absolute top-4 right-4 text-logo text-2xl font-bold hover:text-nude-dark cursor-pointer"
								onClick={() => setIsModalOpen(false)}
								type="button"
							>
								×
							</button>
							<h2 className="text-xl sm:text-2xl font-bold text-logo text-center pr-8">
								{isEditing ? "Modifier la promotion" : "Nouvelle promotion"}
							</h2>
						</div>

						{/* Contenu scrollable */}
						<div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
							<form
								className="space-y-4"
								onSubmit={(e) => {
									e.preventDefault();
									handleCreatePromo();
								}}
							>
								{/* Code de promotion */}
								<div>
									<label className="block text-sm font-medium text-nude-dark mb-2">
										Code de promotion *
									</label>
									<input
										type="text"
										value={newPromo.code}
										onChange={(e) =>
											setNewPromo({ ...newPromo, code: e.target.value })
										}
										className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text"
										placeholder="Ex: ETE2024"
									/>
								</div>

								{/* Type de réduction */}
								<div>
									<label className="block text-sm font-medium text-nude-dark mb-2">
										Type de réduction *
									</label>
									<div className="relative" ref={typeMenuRef}>
										<button
											type="button"
											onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
											className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-pointer text-left flex items-center justify-between"
										>
											<span className="text-nude-dark">
												{newPromo.type === "Pourcentage"
													? "Pourcentage (%)"
													: "Montant fixe (€)"}
											</span>
											<svg
												className={`w-5 h-5 text-nude-dark transition-transform duration-200 ${isTypeMenuOpen ? "rotate-180" : ""}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>

										{/* Menu déroulant */}
										{isTypeMenuOpen && (
											<div className="absolute z-50 w-full mt-2 bg-white border-2 border-nude-medium rounded-2xl shadow-lg">
												<button
													type="button"
													onClick={() => {
														setNewPromo({ ...newPromo, type: "Pourcentage" });
														setIsTypeMenuOpen(false);
													}}
													className={`w-full px-4 py-3 text-left hover:bg-rose-light-2 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
														newPromo.type === "Pourcentage"
															? "bg-nude-medium text-black font-medium"
															: "text-black"
													}`}
												>
													Pourcentage (%)
												</button>
												<button
													type="button"
													onClick={() => {
														setNewPromo({ ...newPromo, type: "Montant fixe" });
														setIsTypeMenuOpen(false);
													}}
													className={`w-full px-4 py-3 text-left hover:bg-rose-light-2 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
														newPromo.type === "Montant fixe"
															? "bg-nude-medium text-black font-medium"
															: "text-black"
													}`}
												>
													Montant fixe (€)
												</button>
											</div>
										)}

										{/* Overlay pour fermer le menu en cliquant ailleurs */}
										{isTypeMenuOpen && (
											<div
												className="fixed inset-0 z-40"
												onClick={() => setIsTypeMenuOpen(false)}
											/>
										)}
									</div>
								</div>

								{/* Montant */}
								<div>
									<label className="block text-sm font-medium text-nude-dark mb-2">
										Montant de la réduction *
									</label>
									<input
										type="number"
										value={newPromo.discount}
										onChange={(e) =>
											setNewPromo({ ...newPromo, discount: e.target.value })
										}
										className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text"
										placeholder={
											newPromo.type === "Pourcentage" ? "Ex: 20" : "Ex: 10"
										}
										min="0"
										step={newPromo.type === "Pourcentage" ? "1" : "0.01"}
									/>
								</div>

								{/* Date de début */}
								<div>
									<label className="block text-sm font-medium text-nude-dark mb-2">
										Date de début *
									</label>
									<input
										type="date"
										value={newPromo.validFrom}
										min={new Date().toISOString().split("T")[0]}
										onChange={(e) =>
											setNewPromo({ ...newPromo, validFrom: e.target.value })
										}
										className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text"
									/>
									{newPromo.validFrom &&
										newPromo.validFrom <
											new Date().toISOString().split("T")[0] && (
											<p className="text-red-500 text-sm mt-1">
												La date de début ne peut pas être dans le passé
											</p>
										)}
								</div>

								{/* Date de fin */}
								<div>
									<label className="block text-sm font-medium text-nude-dark mb-2">
										Date de fin *
									</label>
									<input
										type="date"
										value={newPromo.validTo}
										min={newPromo.validFrom || undefined}
										onChange={(e) =>
											setNewPromo({ ...newPromo, validTo: e.target.value })
										}
										className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text"
									/>
									{newPromo.validFrom &&
										newPromo.validTo &&
										newPromo.validTo < newPromo.validFrom && (
											<p className="text-red-500 text-sm mt-1">
												La date de fin ne peut pas être antérieure à la date de
												début
											</p>
										)}
								</div>

								{/* Nombre maximum d'utilisations */}
								<div>
									<label className="block text-sm font-medium text-nude-dark mb-2">
										Nombre maximum d'utilisations
									</label>
									<input
										type="number"
										value={newPromo.maxUsage}
										onChange={(e) =>
											setNewPromo({ ...newPromo, maxUsage: e.target.value })
										}
										className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text"
										placeholder="Ex: 100"
										min="1"
									/>
								</div>

								{/* Montant minimum d'achat */}
								<div>
									<label className="block text-sm font-medium text-nude-dark mb-2">
										Montant minimum d'achat (optionnel)
									</label>
									<input
										type="number"
										value={newPromo.minAmount}
										onChange={(e) =>
											setNewPromo({ ...newPromo, minAmount: e.target.value })
										}
										className="w-full px-4 py-3 rounded-2xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text"
										placeholder="Ex: 100 (promo applicable à partir de 100€)"
										min="0"
										step="0.01"
									/>
									<p className="text-xs text-gray-500 mt-1">
										La promotion ne s'appliquera que si le montant du panier est
										supérieur ou égal à cette valeur
									</p>
								</div>

								{/* Boutons */}
								<div className="flex gap-3 mt-6">
									<Button
										type="button"
										onClick={() => setIsModalOpen(false)}
										variant="outline"
										className="flex-1 cursor-pointer"
									>
										Annuler
									</Button>
									<Button
										type="submit"
										className="flex-1 bg-nude-dark text-beige-light hover:bg-nude-dark-2 cursor-pointer"
									>
										{isEditing ? "Modifier" : "Créer"}
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Toast notifications */}
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
		</div>
	);
}
