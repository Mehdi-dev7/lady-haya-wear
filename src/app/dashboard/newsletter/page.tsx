"use client";

import Loader from "@/components/Loader";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Subscriber {
	id: string;
	email: string;
	name?: string;
	subscribedAt: string;
	isActive: boolean;
}

interface NewsletterCampaign {
	id: string;
	subject: string;
	content: string;
	type: "promo" | "new_product" | "general";
	sentAt?: string;
	recipientCount: number;
	status: "draft" | "sent" | "scheduled";
}

export default function NewsletterManagement() {
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"campaigns" | "subscribers" | "create"
	>("campaigns");

	// État pour créer une nouvelle campagne
	const [newCampaign, setNewCampaign] = useState({
		subject: "",
		content: "",
		type: "general" as "general" | "promo" | "new_product",
		scheduleDate: "",
	});
	const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
	const typeMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchData();
	}, []);

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

	const fetchData = async () => {
		try {
			const [subscribersRes, campaignsRes] = await Promise.all([
				fetch("/api/admin/newsletter/subscribers"),
				fetch("/api/admin/newsletter/campaigns"),
			]);

			if (subscribersRes.ok) {
				const subscribersData = await subscribersRes.json();
				setSubscribers(subscribersData);
			}

			if (campaignsRes.ok) {
				const campaignsData = await campaignsRes.json();
				setCampaigns(campaignsData);
			}
		} catch (error) {
			console.error("Erreur lors du chargement:", error);
			toast.error("Erreur lors du chargement des données");
		} finally {
			setLoading(false);
		}
	};

	const sendCampaign = async (campaignId?: string) => {
		try {
			const payload = campaignId ? { campaignId } : newCampaign;
			const response = await fetch("/api/admin/newsletter/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				toast.success("Newsletter envoyée avec succès !");
				if (!campaignId) {
					// Reset form si c'est une nouvelle campagne
					setNewCampaign({
						subject: "",
						content: "",
						type: "general",
						scheduleDate: "",
					});
				}
				fetchData();
			} else {
				throw new Error("Erreur lors de l'envoi");
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de l'envoi de la newsletter");
		}
	};

	const saveDraft = async () => {
		try {
			const response = await fetch("/api/admin/newsletter/campaigns", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...newCampaign, status: "draft" }),
			});

			if (response.ok) {
				toast.success("Brouillon sauvegardé !");
				fetchData();
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la sauvegarde");
		}
	};

	const removeSubscriber = async (subscriberId: string) => {
		try {
			const response = await fetch(
				`/api/admin/newsletter/subscribers/${subscriberId}`,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				toast.success("Abonné supprimé");
				fetchData();
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la suppression");
		}
	};

	const getTemplateContent = (type: string) => {
		const templates = {
			promo: {
				subject: "🎉 Offre spéciale Lady Haya Wear !",
				content: `Chère cliente,

Nous avons une offre exceptionnelle pour vous !

[DÉTAILS DE LA PROMOTION]

Profitez de cette offre limitée dans le temps.

Cordialement,
L'équipe Lady Haya Wear`,
			},
			new_product: {
				subject: "✨ Nouvelle collection disponible !",
				content: `Chère cliente,

Découvrez notre nouvelle collection qui vient d'arriver !

[DÉTAILS DES NOUVEAUX PRODUITS]

Soyez parmi les premières à découvrir nos dernières créations.

Cordialement,
L'équipe Lady Haya Wear`,
			},
			general: {
				subject: "Newsletter Lady Haya Wear",
				content: `Chère cliente,

[VOTRE MESSAGE PERSONNALISÉ]

Merci de votre fidélité.

Cordialement,
L'équipe Lady Haya Wear`,
			},
		};
		return templates[type as keyof typeof templates];
	};

	const useTemplate = (type: "general" | "promo" | "new_product") => {
		const template = getTemplateContent(type);
		setNewCampaign((prev) => ({
			...prev,
			subject: template.subject,
			content: template.content,
			type: type,
		}));
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-logo mb-2">
					Gestion Newsletter
				</h1>
				<p className="text-nude-dark">
					Gérez vos campagnes d'emailing et vos abonnés
				</p>
			</div>

			{/* Statistiques rapides */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white rounded-lg p-6 shadow-md border border-rose-light">
					<h3 className="text-lg font-semibold text-logo mb-2">
						Abonnés actifs
					</h3>
					<p className="text-3xl font-bold text-nude-dark">
						{subscribers.filter((s) => s.isActive).length}
					</p>
				</div>
				<div className="bg-white rounded-lg p-6 shadow-md border border-rose-light">
					<h3 className="text-lg font-semibold text-logo mb-2">
						Campagnes envoyées
					</h3>
					<p className="text-3xl font-bold text-nude-dark">
						{campaigns.filter((c) => c.status === "sent").length}
					</p>
				</div>
				<div className="bg-white rounded-lg p-6 shadow-md border border-rose-light">
					<h3 className="text-lg font-semibold text-logo mb-2">Brouillons</h3>
					<p className="text-3xl font-bold text-nude-dark">
						{campaigns.filter((c) => c.status === "draft").length}
					</p>
				</div>
			</div>

			{/* Onglets */}
			<div className="mb-6">
				<nav className="flex space-x-8">
					{[
						{ id: "campaigns", label: "Campagnes" },
						{ id: "create", label: "Créer une campagne" },
						{ id: "subscribers", label: "Abonnés" },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
								activeTab === tab.id
									? "border-logo text-logo"
									: "border-transparent text-nude-dark hover:text-logo hover:border-rose-light"
							}`}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Contenu des onglets */}
			{activeTab === "campaigns" && (
				<div className="bg-white rounded-lg shadow-md">
					<div className="p-6">
						<h2 className="text-xl font-semibold text-logo mb-4">
							Historique des campagnes
						</h2>
						<div className="space-y-4">
							{campaigns.length === 0 ? (
								<p className="text-nude-dark text-center py-8">
									Aucune campagne pour le moment
								</p>
							) : (
								campaigns.map((campaign) => (
									<div
										key={campaign.id}
										className="border border-rose-light rounded-lg p-4"
									>
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-semibold text-logo">
													{campaign.subject}
												</h3>
												<p className="text-sm text-nude-dark mt-1">
													Type: {campaign.type} • {campaign.recipientCount}{" "}
													destinataires
												</p>
												{campaign.sentAt && (
													<p className="text-xs text-nude-dark-2 mt-1">
														Envoyé le{" "}
														{new Date(campaign.sentAt).toLocaleDateString(
															"fr-FR"
														)}
													</p>
												)}
											</div>
											<div className="flex items-center gap-2">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														campaign.status === "sent"
															? "bg-green-100 text-green-800"
															: campaign.status === "draft"
																? "bg-yellow-100 text-yellow-800"
																: "bg-blue-100 text-blue-800"
													}`}
												>
													{campaign.status === "sent"
														? "Envoyé"
														: campaign.status === "draft"
															? "Brouillon"
															: "Programmé"}
												</span>
												{campaign.status === "draft" && (
													<button
														onClick={() => sendCampaign(campaign.id)}
														className="px-3 py-1 bg-logo text-white rounded text-sm hover:bg-nude-dark transition-colors cursor-pointer"
													>
														Envoyer
													</button>
												)}
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}

			{activeTab === "create" && (
				<div className="bg-white rounded-lg shadow-md">
					<div className="p-6">
						<h2 className="text-xl font-semibold text-logo mb-4">
							Créer une nouvelle campagne
						</h2>

						{/* Templates rapides */}
						<div className="mb-6">
							<h3 className="text-lg font-medium text-nude-dark mb-3">
								Templates rapides
							</h3>
							<div className="flex gap-3">
								<button
									onClick={() => useTemplate("promo")}
									className="px-4 py-2 border border-rose-light rounded-lg hover:bg-rose-light transition-colors cursor-pointer"
								>
									🎉 Promotion
								</button>
								<button
									onClick={() => useTemplate("new_product")}
									className="px-4 py-2 border border-rose-light rounded-lg hover:bg-rose-light transition-colors cursor-pointer"
								>
									✨ Nouveau produit
								</button>
								<button
									onClick={() => useTemplate("general")}
									className="px-4 py-2 border border-rose-light rounded-lg hover:bg-rose-light transition-colors cursor-pointer"
								>
									📧 Général
								</button>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-nude-dark mb-1">
									Objet de l'email
								</label>
								<input
									type="text"
									value={newCampaign.subject}
									onChange={(e) =>
										setNewCampaign((prev) => ({
											...prev,
											subject: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-rose-light rounded-lg focus-ring-logo"
									placeholder="Entrez l'objet de votre email..."
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-nude-dark mb-1">
									Type de campagne
								</label>
								<div className="relative" ref={typeMenuRef}>
									<button
										type="button"
										onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
										className="w-full px-3 py-2 border border-rose-light rounded-lg focus-ring-logo cursor-pointer text-left flex items-center justify-between"
									>
										<span className="text-nude-dark">
											{newCampaign.type === "general"
												? "Général"
												: newCampaign.type === "promo"
													? "Promotion"
													: "Nouveau produit"}
										</span>
										<svg
											className={`w-5 h-5 text-nude-dark transition-transform duration-200 ${
												isTypeMenuOpen ? "rotate-180" : ""
											}`}
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
										<div className="absolute z-50 w-full mt-2 bg-white border border-rose-light rounded-lg shadow-lg">
											<button
												type="button"
												onClick={() => {
													setNewCampaign((prev) => ({
														...prev,
														type: "general" as const,
													}));
													setIsTypeMenuOpen(false);
												}}
												className={`w-full px-3 py-2 text-left hover:bg-rose-light transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
													newCampaign.type === "general"
														? "bg-rose-light text-logo font-medium"
														: "text-nude-dark"
												}`}
											>
												📧 Général
											</button>
											<button
												type="button"
												onClick={() => {
													setNewCampaign((prev) => ({
														...prev,
														type: "promo" as const,
													}));
													setIsTypeMenuOpen(false);
												}}
												className={`w-full px-3 py-2 text-left hover:bg-rose-light transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
													newCampaign.type === "promo"
														? "bg-rose-light text-logo font-medium"
														: "text-nude-dark"
												}`}
											>
												🎉 Promotion
											</button>
											<button
												type="button"
												onClick={() => {
													setNewCampaign((prev) => ({
														...prev,
														type: "new_product" as const,
													}));
													setIsTypeMenuOpen(false);
												}}
												className={`w-full px-3 py-2 text-left hover:bg-rose-light transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
													newCampaign.type === "new_product"
														? "bg-rose-light text-logo font-medium"
														: "text-nude-dark"
												}`}
											>
												✨ Nouveau produit
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

							<div>
								<label className="block text-sm font-medium text-nude-dark mb-1">
									Contenu de l'email
								</label>
								<textarea
									value={newCampaign.content}
									onChange={(e) =>
										setNewCampaign((prev) => ({
											...prev,
											content: e.target.value,
										}))
									}
									rows={10}
									className="w-full px-3 py-2 border border-rose-light rounded-lg focus-ring-logo"
									placeholder="Rédigez votre message..."
								/>
							</div>

							<div className="flex gap-4">
								<button
									onClick={saveDraft}
									className="px-6 py-2 border border-logo text-logo rounded-lg hover:bg-rose-light transition-colors cursor-pointer"
								>
									Sauvegarder brouillon
								</button>
								<button
									onClick={() => sendCampaign()}
									className="px-6 py-2 bg-logo text-white rounded-lg hover:bg-nude-dark transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
									disabled={!newCampaign.subject || !newCampaign.content}
								>
									Envoyer maintenant
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{activeTab === "subscribers" && (
				<div className="bg-white rounded-lg shadow-md">
					<div className="p-6">
						<h2 className="text-xl font-semibold text-logo mb-4">
							Liste des abonnés
						</h2>
						<div className="overflow-x-auto">
							<table className="min-w-full">
								<thead>
									<tr className="border-b border-rose-light">
										<th className="text-left py-2 text-nude-dark font-medium">
											Email
										</th>
										<th className="text-left py-2 text-nude-dark font-medium">
											Nom
										</th>
										<th className="text-left py-2 text-nude-dark font-medium">
											Date d'inscription
										</th>
										<th className="text-left py-2 text-nude-dark font-medium">
											Statut
										</th>
										<th className="text-left py-2 text-nude-dark font-medium">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{subscribers.map((subscriber) => (
										<tr
											key={subscriber.id}
											className="border-b border-rose-light/50"
										>
											<td className="py-3">{subscriber.email}</td>
											<td className="py-3">{subscriber.name || "-"}</td>
											<td className="py-3">
												{new Date(subscriber.subscribedAt).toLocaleDateString(
													"fr-FR"
												)}
											</td>
											<td className="py-3">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														subscriber.isActive
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{subscriber.isActive ? "Actif" : "Inactif"}
												</span>
											</td>
											<td className="py-3">
												<button
													onClick={() => removeSubscriber(subscriber.id)}
													className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
												>
													Supprimer
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{subscribers.length === 0 && (
								<p className="text-nude-dark text-center py-8">
									Aucun abonné pour le moment
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
