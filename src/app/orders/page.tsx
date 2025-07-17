// Exemple de données statiques (à remplacer par les vraies données plus tard)
const commandesEnCours = [
	{
		id: "CMD20250701",
		date: "16/07/2025",
		statut: "En préparation",
		total: "89,90€",
		produits: 2,
	},
	{
		id: "CMD20250702",
		date: "15/07/2025",
		statut: "En livraison",
		total: "49,90€",
		produits: 1,
	},
];

const commandesHistoriques = [
	{
		id: "CMD20240612",
		date: "12/06/2024",
		statut: "Livrée",
		total: "129,90€",
		produits: 3,
	},
	{
		id: "CMD20240510",
		date: "10/05/2024",
		statut: "Annulée",
		total: "59,90€",
		produits: 1,
	},
];

export default function OrdersPage() {
	return (
		<section className="px-4 mt-8 md:mt-16 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 min-h-screen bg-beige-light animate-fade-in-up">
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
									className="flex flex-col md:flex-row items-center justify-between bg-rose-light-2 border-l-4 border-rose-dark-2 rounded-xl shadow p-6 gap-4 hover:shadow-lg transition-all duration-200"
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
										<span className="inline-block px-3 py-1 rounded-full bg-rose-dark-2 text-white text-xs font-semibold">
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
									className="flex flex-col md:flex-row items-center justify-between bg-nude-light border-l-4 border-nude-dark rounded-xl shadow p-6 gap-4 hover:shadow-lg transition-all duration-200"
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
											className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cmd.statut === "Livrée" ? "bg-nude-dark text-white" : "bg-rose-dark-2 text-white"}`}
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
