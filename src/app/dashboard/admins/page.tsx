"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Admin {
	id: string;
	email: string;
	name: string;
	role: "SUPER_ADMIN" | "ADMIN" | "MANAGER";
	isActive: boolean;
	lastLoginAt: string | null;
	createdAt: string;
}

export default function AdminsPage() {
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
		role: "ADMIN" as "SUPER_ADMIN" | "ADMIN" | "MANAGER",
	});

	// Charger les admins
	const loadAdmins = async () => {
		try {
			const response = await fetch("/api/admin/admins");
			if (response.ok) {
				const data = await response.json();
				setAdmins(data);
			}
		} catch (error) {
			console.error("Erreur lors du chargement des admins:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAdmins();
	}, []);

	// Réinitialiser le formulaire
	const resetForm = () => {
		setFormData({
			email: "",
			password: "",
			name: "",
			role: "ADMIN",
		});
		setShowAddForm(false);
		setEditingAdmin(null);
	};

	// Ajouter un admin
	const handleAddAdmin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/admin/admins", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Administrateur ajouté avec succès !");
				resetForm();
				loadAdmins();
			} else {
				toast.error(`Erreur: ${data.error}`);
			}
		} catch (error) {
			console.error("Erreur lors de l'ajout:", error);
			toast.error("Erreur lors de l'ajout de l'administrateur");
		}
	};

	// Modifier un admin
	const handleEditAdmin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!editingAdmin) return;

		try {
			const response = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Administrateur modifié avec succès !");
				resetForm();
				loadAdmins();
			} else {
				toast.error(`Erreur: ${data.error}`);
			}
		} catch (error) {
			console.error("Erreur lors de la modification:", error);
			toast.error("Erreur lors de la modification de l'administrateur");
		}
	};

	// Supprimer un admin
	const handleDeleteAdmin = async (id: string) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/admins/${id}`, {
				method: "DELETE",
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Administrateur supprimé avec succès !");
				loadAdmins();
			} else {
				toast.error(`Erreur: ${data.error}`);
			}
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			toast.error("Erreur lors de la suppression de l'administrateur");
		}
	};

	// Commencer l'édition
	const startEdit = (admin: Admin) => {
		setEditingAdmin(admin);
		setFormData({
			email: admin.email,
			password: "", // Mot de passe vide pour modification
			name: admin.name,
			role: admin.role,
		});
	};

	const getRoleLabel = (role: string) => {
		switch (role) {
			case "SUPER_ADMIN":
				return "Super Admin";
			case "ADMIN":
				return "Administrateur";
			case "MANAGER":
				return "Manager";
			default:
				return role;
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-xl sm:text-2xl text-logo font-bold">
					Gestion des Administrateurs
				</h1>
				{admins.length < 3 && !showAddForm && !editingAdmin && (
					<div className="flex justify-end mt-4">
						<Button
							onClick={() => setShowAddForm(true)}
							className="flex items-center space-x-1 sm:space-x-2 bg-nude-dark text-beige-light hover:bg-nude-dark-2 cursor-pointer hover:scale-102 transition-all duration-300 px-2 py-1 sm:px-4 sm:py-2 mt-3 sm:mt-0"
						>
							<Plus className="h-3 w-3 sm:h-4 sm:w-4" />
							<span className="text-sm sm:text-base">
								Ajouter un administrateur
							</span>
						</Button>
					</div>
				)}
			</div>

			{/* Formulaire d'ajout/modification */}
			{(showAddForm || editingAdmin) && (
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="text-nude-dark">
							{editingAdmin
								? "Modifier l'administrateur"
								: "Ajouter un administrateur"}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={editingAdmin ? handleEditAdmin : handleAddAdmin}
							className="space-y-4"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-1">
										Email
									</label>
									<Input
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">
										{editingAdmin
											? "Nouveau mot de passe (optionnel)"
											: "Mot de passe"}
									</label>
									<Input
										type="password"
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										required={!editingAdmin}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">Nom</label>
									<Input
										type="text"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">Rôle</label>
									<select
										value={formData.role}
										onChange={(e) =>
											setFormData({ ...formData, role: e.target.value as any })
										}
										className="w-full p-2 border border-gray-300 rounded-md"
										required
									>
										<option value="SUPER_ADMIN">Super Admin</option>
										<option value="ADMIN">Administrateur</option>
										<option value="MANAGER">Manager</option>
									</select>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									type="submit"
									className="bg-nude-dark text-beige-light hover:bg-nude-dark-2 cursor-pointer hover:scale-102 transition-all duration-300"
								>
									{editingAdmin ? "Modifier" : "Ajouter"}
								</Button>
								<Button
									type="button"
									onClick={resetForm}
									className="bg-rose-light text-nude-dark hover:bg-rose-medium hover:text-logo cursor-pointer hover:scale-102 transition-all duration-300"
								>
									Annuler
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Liste des admins */}
			<Card className="shadow-lg">
				<CardHeader className="pb-2 sm:pb-6">
					<CardTitle className="text-nude-dark text-lg sm:text-xl">
						Administrateurs ({admins.length}/3)
					</CardTitle>
				</CardHeader>
				<CardContent className="p-2 sm:p-6">
					{admins.length === 0 ? (
						<div className="text-center py-6 sm:py-8">
							<p className="text-gray-500">Aucun administrateur trouvé</p>
						</div>
					) : (
						<div className="space-y-2 sm:space-y-4">
							{admins.map((admin) => (
								<div
									key={admin.id}
									className="border rounded-lg p-2 sm:p-4 hover:bg-gray-50 transition-colors"
								>
									{/* En-tête mobile - Nom et statuts */}
									<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
										{/* Informations principales */}
										<div className="flex-1 min-w-0">
											{/* Nom et badges */}
											<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
												<h3 className="font-semibold text-base sm:text-lg truncate">
													{admin.name}
												</h3>
												<div className="flex flex-wrap gap-1 sm:gap-2">
													<span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
														{getRoleLabel(admin.role)}
													</span>
													{admin.isActive ? (
														<span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
															Actif
														</span>
													) : (
														<span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
															Inactif
														</span>
													)}
												</div>
											</div>

											{/* Email */}
											<p className="text-gray-600 text-sm sm:text-base truncate">
												{admin.email}
											</p>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-end gap-1 sm:gap-2">
											<Button
												variant="outline"
												size="sm"
												className="text-green-600 hover:text-green-700 cursor-pointer h-8 w-8 sm:h-9 sm:w-9 p-0"
												onClick={() => startEdit(admin)}
											>
												<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700 cursor-pointer h-8 w-8 sm:h-9 sm:w-9 p-0"
												onClick={() => handleDeleteAdmin(admin.id)}
											>
												<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
											</Button>
										</div>
									</div>

									{/* Informations détaillées */}
									<div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 text-xs sm:text-sm">
											{/* Date de création */}
											<div className="text-gray-500">
												Créé le {new Date(admin.createdAt).toLocaleDateString()}
											</div>

											{/* Dernière connexion */}
											{admin.lastLoginAt && (
												<div className="text-gray-500">
													Dernière connexion:{" "}
													{new Date(admin.lastLoginAt).toLocaleString()}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
