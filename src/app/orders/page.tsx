"use client";
import Image from "next/image";
import { useState } from "react";

// Exemple de données statiques (à remplacer par les vraies données plus tard)
const commandesEnCours = [
	{
		id: "CMD20250701",
		date: "16/07/2025",
		statut: "En préparation",
		total: "89,90€",
		produits: 2,
		details: [
			{
				nom: "Robe d'été fleurie",
				image: "/public/assets/grid/img1.jpeg",
				quantite: 1,
				prix: "49,95€",
			},
			{
				nom: "Top en lin blanc",
				image: "/public/assets/grid/img2.jpeg",
				quantite: 1,
				prix: "39,95€",
			},
		],
		livraison: {
			nom: "Sophie Martin",
			rue: "12 rue des Lilas",
			codePostal: "75012",
			ville: "Paris",
		},
	},
	{
		id: "CMD20250702",
		date: "15/07/2025",
		statut: "En livraison",
		total: "49,90€",
		produits: 1,
		details: [
			{
				nom: "Jupe plissée beige",
				image: "/public/assets/grid/img3.jpeg",
				quantite: 1,
				prix: "49,90€",
			},
		],
		livraison: {
			nom: "Sophie Martin",
			rue: "12 rue des Lilas",
			codePostal: "75012",
			ville: "Paris",
		},
	},
];

const commandesHistoriques = [
	{
		id: "CMD20240612",
		date: "12/06/2024",
		statut: "Livrée",
		total: "129,90€",
		produits: 3,
		details: [
			{
				nom: "Chemisier manches courtes",
				image: "/public/assets/grid/img4.jpeg",
				quantite: 2,
				prix: "39,95€",
			},
			{
				nom: "Pantalon fluide noir",
				image: "/public/assets/grid/img5.jpeg",
				quantite: 1,
				prix: "49,90€",
			},
		],
		livraison: {
			nom: "Sophie Martin",
			rue: "12 rue des Lilas",
			codePostal: "75012",
			ville: "Paris",
		},
	},
	{
		id: "CMD20240510",
		date: "10/05/2024",
		statut: "Annulée",
		total: "59,90€",
		produits: 1,
		details: [
			{
				nom: "T-shirt coton bio",
				image: "/public/assets/grid/img6.jpeg",
				quantite: 1,
				prix: "59,90€",
			},
		],
		livraison: {
			nom: "Sophie Martin",
			rue: "12 rue des Lilas",
			codePostal: "75012",
			ville: "Paris",
		},
	},
];

// Ajoute une fonction utilitaire pour la couleur des badges
function getBadgeClass(statut: string) {
	switch (statut) {
		case "Annulée":
			return "bg-red-500 text-white";
		case "Livrée":
			return "bg-green-600 text-white";
		case "En préparation":
			return "bg-rose-dark-2 text-white";
		case "En livraison":
			return "bg-orange-400 text-white";
		default:
			return "bg-nude-dark text-white";
	}
}

function CommandeModal({
	commande,
	onClose,
}: {
	commande: any;
	onClose: () => void;
}) {
	if (!commande) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-lg relative animate-fade-in-up">
				<button
					className="absolute top-4 right-4 text-logo text-2xl font-bold hover:text-nude-dark cursor-pointer"
					onClick={onClose}
					type="button"
				>
					×
				</button>
				<h2 className="text-2xl font-bold text-logo mb-2 text-center">
					Commande #{commande.id}
				</h2>
				<div className="text-center text-nude-dark text-sm mb-2">
					Date : {commande.date}
				</div>
				{/* Bloc nom et adresse de livraison */}
				<div className="bg-beige-light rounded-lg p-4 mb-4 text-sm text-nude-dark-2">
					<div className="font-semibold text-logo mb-1">Livraison à :</div>
					<div>{commande.livraison?.nom}</div>
					<div>{commande.livraison?.rue}</div>
					<div>
						{commande.livraison?.codePostal} {commande.livraison?.ville}
					</div>
				</div>
				<div className="flex flex-wrap gap-4 mb-4 justify-center">
					{commande.details.map((prod: any, idx: number) => (
						<div key={idx} className="flex flex-col items-center w-28">
							<div className="w-20 h-20 relative mb-2">
								<Image
									src={prod.image}
									alt={prod.nom}
									fill
									className="object-cover rounded-lg"
								/>
							</div>
							<div className="text-xs text-logo font-semibold text-center">
								{prod.nom}
							</div>
							<div className="text-xs text-nude-dark-2">x{prod.quantite}</div>
							<div className="text-xs text-nude-dark font-bold">
								{prod.prix}
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-between items-center mb-4">
					<span className="font-semibold text-nude-dark">Statut :</span>
					<span
						className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(commande.statut)}`}
					>
						{commande.statut}
					</span>
				</div>
				<div className="flex justify-between items-center mb-6">
					<span className="font-semibold text-nude-dark">Total :</span>
					<span className="font-bold text-logo">{commande.total}</span>
				</div>
				<button
					className="w-full bg-rose-dark-2 hover:bg-rose-dark text-white font-semibold py-2 rounded-full transition-all duration-200 cursor-pointer"
					onClick={() =>
						(window.location.href = `/contact?commande=${commande.id}`)
					}
				>
					Signaler un souci
				</button>
			</div>
		</div>
	);
}

export default function OrdersPage() {
	const [modalCommande, setModalCommande] = useState<any>(null);
	return (
		<section className="px-4 mt-8 md:mt-16 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 min-h-screen bg-beige-light animate-fade-in-up">
			<CommandeModal
				commande={modalCommande}
				onClose={() => setModalCommande(null)}
			/>
			<div className="w-full max-w-3xl mx-auto">
				<h1 className="text-5xl md:text-6xl font-alex-brush text-logo mb-10 text-center">
					Mes commandes
				</h1>

				{/* Commandes en cours */}
				<div className="mb-12">
					<h2 className="text-2xl font-semibold text-nude-dark mb-6">
						En cours
					</h2>
					{commandesEnCours.length === 0 ? (
						<p className="text-nude-dark-2 text-center">
							Aucune commande en cours.
						</p>
					) : (
						<div className="space-y-6">
							{commandesEnCours.map((cmd) => (
								<div
									key={cmd.id}
									className="flex flex-col md:flex-row items-center justify-between bg-rose-light-2 border-l-4 border-rose-dark-2 rounded-xl shadow p-6 gap-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
									onClick={() => setModalCommande(cmd)}
								>
									<div className="flex-1">
										<div className="font-semibold text-logo text-lg mb-1">
											Commande #{cmd.id}
										</div>
										<div className="text-nude-dark text-sm mb-1">
											Date : {cmd.date}
										</div>
										<div className="text-nude-dark-2 text-sm">
											{cmd.produits} produit(s)
										</div>
									</div>
									<div className="flex flex-col items-end gap-2 min-w-[120px]">
										<span className="text-rose-dark-2 font-bold text-lg">
											{cmd.total}
										</span>
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(cmd.statut)}`}
										>
											{cmd.statut}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Historique des commandes */}
				<div>
					<h2 className="text-2xl font-semibold text-nude-dark mb-6">
						Historique
					</h2>
					{commandesHistoriques.length === 0 ? (
						<p className="text-nude-dark-2 text-center">
							Aucune commande passée.
						</p>
					) : (
						<div className="space-y-6">
							{commandesHistoriques.map((cmd) => (
								<div
									key={cmd.id}
									className="flex flex-col md:flex-row items-center justify-between bg-nude-light border-l-4 border-nude-dark rounded-xl shadow p-6 gap-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
									onClick={() => setModalCommande(cmd)}
								>
									<div className="flex-1">
										<div className="font-semibold text-logo text-lg mb-1">
											Commande #{cmd.id}
										</div>
										<div className="text-nude-dark text-sm mb-1">
											Date : {cmd.date}
										</div>
										<div className="text-nude-dark-2 text-sm">
											{cmd.produits} produit(s)
										</div>
									</div>
									<div className="flex flex-col items-end gap-2 min-w-[120px]">
										<span className="text-nude-dark font-bold text-lg">
											{cmd.total}
										</span>
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(cmd.statut)}`}
										>
											{cmd.statut}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
