"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";

interface OrderTrackingModalProps {
	order: {
		id: string;
		orderNumber: string;
		status: string;
		trackingNumber?: string;
		carrier?: string;
		notes?: string;
		customerEmail: string;
		customerName: string;
	} | null;
	onClose: () => void;
	onUpdate: (orderId: string, data: any) => Promise<void>;
}

const CARRIERS = [
	{ value: "colissimo", label: "Colissimo" },
	{ value: "chronopost", label: "Chronopost" },
	{ value: "mondial-relay", label: "Mondial Relay" },
	{ value: "dpd", label: "DPD" },
	{ value: "ups", label: "UPS" },
	{ value: "fedex", label: "FedEx" },
	{ value: "autre", label: "Autre" },
];

const STATUS_OPTIONS = [
	{ value: "PENDING", label: "En préparation" },
	{ value: "SHIPPED", label: "Expédiée" },
	{ value: "DELIVERED", label: "Livrée" },
	{ value: "CANCELLED", label: "Annulée" },
];

export default function OrderTrackingModal({
	order,
	onClose,
	onUpdate,
}: OrderTrackingModalProps) {
	const [formData, setFormData] = useState({
		status: order?.status || "PENDING",
		trackingNumber: order?.trackingNumber || "",
		carrier: order?.carrier || "",
		notes: order?.notes || "",
		sendEmail: true,
	});
	const [loading, setLoading] = useState(false);

	// Composant Select personnalisé avec menu stylisé
	function CustomSelect({
		value,
		onChange,
		options,
		placeholder,
		label,
	}: {
		value: string;
		onChange: (value: string) => void;
		options: { value: string; label: string }[];
		placeholder: string;
		label: string;
	}) {
		const [isOpen, setIsOpen] = useState(false);

		const selectedOption = options.find((option) => option.value === value);

		return (
			<div className="relative">
				<label className="block text-sm font-medium text-nude-dark mb-2">
					{label}
				</label>
				<div className="relative">
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="w-full px-3 py-2 rounded-xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors bg-white cursor-pointer text-left flex items-center justify-between"
					>
						<span
							className={selectedOption ? "text-nude-dark" : "text-gray-500"}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<FaChevronDown
							className={`w-4 h-4 text-nude-dark transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
						/>
					</button>

					{/* Menu déroulant stylisé */}
					{isOpen && (
						<div className="absolute z-50 w-full mt-2 bg-white border-2 border-nude-medium rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-hide">
							{options.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
									className={`w-full px-3 py-2 text-left hover:bg-nude-light transition-colors first:rounded-t-xl last:rounded-b-xl ${
										value === option.value
											? "bg-nude-medium text-nude-dark font-medium"
											: "text-nude-dark hover:text-nude-dark-2"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Overlay pour fermer le menu en cliquant ailleurs */}
				{isOpen && (
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</div>
		);
	}

	if (!order) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await onUpdate(order.id, {
				...formData,
				sendEmail: formData.sendEmail,
			});
			toast.success("Informations de suivi mises à jour");
			onClose();
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			toast.error("Erreur lors de la mise à jour");
		} finally {
			setLoading(false);
		}
	};

	const getTrackingUrl = (carrier: string, trackingNumber: string) => {
		if (!trackingNumber) return "";

		switch (carrier) {
			case "colissimo":
				return `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;
			case "chronopost":
				return `https://www.chronopost.fr/tracking-colis?listeNumerosLT=${trackingNumber}`;
			case "mondial-relay":
				return `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${trackingNumber}`;
			case "dpd":
				return `https://www.dpd.fr/tracer/${trackingNumber}`;
			case "ups":
				return `https://www.ups.com/track?tracknum=${trackingNumber}`;
			case "fedex":
				return `https://www.fedex.com/fr-fr/tracking.html?tracknumbers=${trackingNumber}`;
			default:
				return "";
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
				<CardHeader className="pb-4">
					<CardTitle className="text-xl font-bold text-logo">
						Suivi de livraison - #{order.orderNumber}
					</CardTitle>
					<p className="text-sm text-gray-600">
						{order.customerName} ({order.customerEmail})
					</p>
				</CardHeader>

				<CardContent className="pb-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Statut */}
						<CustomSelect
							value={formData.status}
							onChange={(value) => setFormData({ ...formData, status: value })}
							options={STATUS_OPTIONS}
							placeholder="Sélectionner un statut"
							label="Statut de la commande"
						/>

						{/* Transporteur */}
						<CustomSelect
							value={formData.carrier}
							onChange={(value) => setFormData({ ...formData, carrier: value })}
							options={[
								{ value: "", label: "Sélectionner un transporteur" },
								...CARRIERS,
							]}
							placeholder="Sélectionner un transporteur"
							label="Transporteur"
						/>

						{/* Numéro de suivi */}
						<div>
							<label className="block text-sm font-medium text-nude-dark mb-2">
								Numéro de suivi
							</label>
							<input
								type="text"
								value={formData.trackingNumber}
								onChange={(e) =>
									setFormData({ ...formData, trackingNumber: e.target.value })
								}
								placeholder="Ex: 1A2B3C4D5E6F"
								className="w-full px-3 py-2 rounded-xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors"
							/>
						</div>

						{/* Lien de suivi (si disponible) */}
						{formData.trackingNumber && formData.carrier && (
							<div className="bg-blue-50 rounded-xl p-3">
								<p className="text-sm font-medium text-blue-800 mb-2">
									Lien de suivi :
								</p>
								<a
									href={getTrackingUrl(
										formData.carrier,
										formData.trackingNumber
									)}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 text-sm break-all"
								>
									{getTrackingUrl(formData.carrier, formData.trackingNumber)}
								</a>
							</div>
						)}

						{/* Notes */}
						<div>
							<label className="block text-sm font-medium text-nude-dark mb-2">
								Notes internes
							</label>
							<textarea
								value={formData.notes}
								onChange={(e) =>
									setFormData({ ...formData, notes: e.target.value })
								}
								placeholder="Notes pour l'équipe..."
								rows={3}
								className="w-full px-3 py-2 rounded-xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors resize-none"
							/>
						</div>

						{/* Option email */}
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="sendEmail"
								checked={formData.sendEmail}
								onChange={(e) =>
									setFormData({ ...formData, sendEmail: e.target.checked })
								}
								className="rounded border-nude-medium text-nude-dark focus:ring-nude-dark"
							/>
							<label htmlFor="sendEmail" className="text-sm text-nude-dark">
								Envoyer un email de notification au client
							</label>
						</div>

						{/* Boutons */}
						<div className="flex gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="flex-1"
								disabled={loading}
							>
								Annuler
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-rose-dark-2 hover:bg-rose-dark"
								disabled={loading}
							>
								{loading ? "Mise à jour..." : "Enregistrer"}
							</Button>
						</div>
					</form>
				</CardContent>
			</div>
		</div>
	);
}
