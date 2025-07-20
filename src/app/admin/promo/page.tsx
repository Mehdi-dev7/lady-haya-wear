"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PromoCode {
	id: string;
	code: string;
	type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
	value: number;
	minAmount?: number;
	maxUses?: number;
	usedCount: number;
	validFrom: string;
	validUntil: string;
	active: boolean;
}

export default function PromoAdminPage() {
	const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
	const [formData, setFormData] = useState({
		code: "",
		type: "PERCENTAGE" as const,
		value: 0,
		minAmount: 0,
		maxUses: 0,
		validFrom: new Date().toISOString().split("T")[0],
		validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		active: true,
	});

	useEffect(() => {
		fetchPromoCodes();
	}, []);

	const fetchPromoCodes = async () => {
		try {
			const res = await fetch("/api/admin/promo");
			const data = await res.json();
			setPromoCodes(data.promoCodes || []);
		} catch (error) {
			toast.error("Erreur lors du chargement");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const url = editingCode
				? `/api/admin/promo/${editingCode.id}`
				: "/api/admin/promo";
			const method = editingCode ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				toast.success(editingCode ? "Code promo modifié" : "Code promo créé");
				setShowForm(false);
				setEditingCode(null);
				resetForm();
				fetchPromoCodes();
			} else {
				const data = await res.json();
				toast.error(data.error || "Erreur");
			}
		} catch (error) {
			toast.error("Erreur serveur");
		}
	};

	const resetForm = () => {
		setFormData({
			code: "",
			type: "PERCENTAGE",
			value: 0,
			minAmount: 0,
			maxUses: 0,
			validFrom: new Date().toISOString().split("T")[0],
			validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0],
			active: true,
		});
	};

	const editCode = (code: PromoCode) => {
		setEditingCode(code);
		setFormData({
			code: code.code,
			type: code.type,
			value: code.value,
			minAmount: code.minAmount || 0,
			maxUses: code.maxUses || 0,
			validFrom: new Date(code.validFrom).toISOString().split("T")[0],
			validUntil: new Date(code.validUntil).toISOString().split("T")[0],
			active: code.active,
		});
		setShowForm(true);
	};

	const toggleActive = async (id: string, active: boolean) => {
		try {
			const res = await fetch(`/api/admin/promo/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ active }),
			});

			if (res.ok) {
				toast.success(`Code ${active ? "activé" : "désactivé"}`);
				fetchPromoCodes();
			}
		} catch (error) {
			toast.error("Erreur");
		}
	};

	if (loading) return <div>Chargement...</div>;

	return (
		<div className="min-h-screen bg-beige-light p-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-alex-brush text-logo">
						Gestion des codes promo
					</h1>
					<button
						onClick={() => {
							setShowForm(true);
							setEditingCode(null);
							resetForm();
						}}
						className="bg-nude-dark text-white px-6 py-2 rounded-lg hover:bg-rose-dark transition-colors"
					>
						Nouveau code
					</button>
				</div>

				{/* Formulaire */}
				{showForm && (
					<div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
						<h2 className="text-xl font-semibold mb-4">
							{editingCode ? "Modifier le code" : "Créer un nouveau code"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-1">Code</label>
									<input
										type="text"
										value={formData.code}
										onChange={(e) =>
											setFormData({
												...formData,
												code: e.target.value.toUpperCase(),
											})
										}
										className="w-full border rounded-lg px-3 py-2"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">Type</label>
									<select
										value={formData.type}
										onChange={(e) =>
											setFormData({ ...formData, type: e.target.value as any })
										}
										className="w-full border rounded-lg px-3 py-2"
									>
										<option value="PERCENTAGE">Pourcentage</option>
										<option value="FIXED">Montant fixe</option>
										<option value="FREE_SHIPPING">Livraison gratuite</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">
										{formData.type === "PERCENTAGE" ? "Pourcentage" : "Montant"}
									</label>
									<input
										type="number"
										value={formData.value}
										onChange={(e) =>
											setFormData({
												...formData,
												value: parseFloat(e.target.value),
											})
										}
										className="w-full border rounded-lg px-3 py-2"
										required
										min="0"
										step={formData.type === "PERCENTAGE" ? "1" : "0.01"}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">
										Montant minimum
									</label>
									<input
										type="number"
										value={formData.minAmount}
										onChange={(e) =>
											setFormData({
												...formData,
												minAmount: parseFloat(e.target.value),
											})
										}
										className="w-full border rounded-lg px-3 py-2"
										min="0"
										step="0.01"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">
										Utilisations max
									</label>
									<input
										type="number"
										value={formData.maxUses}
										onChange={(e) =>
											setFormData({
												...formData,
												maxUses: parseInt(e.target.value),
											})
										}
										className="w-full border rounded-lg px-3 py-2"
										min="0"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">
										Date de début
									</label>
									<input
										type="date"
										value={formData.validFrom}
										onChange={(e) =>
											setFormData({ ...formData, validFrom: e.target.value })
										}
										className="w-full border rounded-lg px-3 py-2"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">
										Date de fin
									</label>
									<input
										type="date"
										value={formData.validUntil}
										onChange={(e) =>
											setFormData({ ...formData, validUntil: e.target.value })
										}
										className="w-full border rounded-lg px-3 py-2"
										required
									/>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="active"
									checked={formData.active}
									onChange={(e) =>
										setFormData({ ...formData, active: e.target.checked })
									}
								/>
								<label htmlFor="active">Actif</label>
							</div>
							<div className="flex gap-4">
								<button
									type="submit"
									className="bg-nude-dark text-white px-6 py-2 rounded-lg hover:bg-rose-dark transition-colors"
								>
									{editingCode ? "Modifier" : "Créer"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowForm(false);
										setEditingCode(null);
										resetForm();
									}}
									className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
								>
									Annuler
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Liste des codes */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Code
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Type
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Valeur
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Utilisations
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Statut
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{promoCodes.map((code) => (
								<tr key={code.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{code.code}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{code.type === "PERCENTAGE"
											? "Pourcentage"
											: code.type === "FIXED"
												? "Montant fixe"
												: "Livraison gratuite"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{code.type === "PERCENTAGE"
											? `${code.value}%`
											: code.type === "FIXED"
												? `${code.value}€`
												: "Gratuit"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{code.usedCount} / {code.maxUses || "∞"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
												code.active
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{code.active ? "Actif" : "Inactif"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex gap-2">
											<button
												onClick={() => editCode(code)}
												className="text-indigo-600 hover:text-indigo-900"
											>
												Modifier
											</button>
											<button
												onClick={() => toggleActive(code.id, !code.active)}
												className={`${
													code.active
														? "text-red-600 hover:text-red-900"
														: "text-green-600 hover:text-green-900"
												}`}
											>
												{code.active ? "Désactiver" : "Activer"}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
