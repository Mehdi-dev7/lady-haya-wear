import Link from "next/link";

export default function RetoursPage() {
	return (
		<div className="min-h-screen bg-rose-light-2 py-16 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4 mt-8">
						Retours & Échanges
					</h1>
					<p className="text-lg text-nude-dark-2">
						Votre satisfaction est notre priorité
					</p>
				</div>

				{/* Contenu principal */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
					<h2 className="text-2xl font-balqis text-logo mb-6">
						Comment procéder aux retours ?
					</h2>

					<div className="space-y-6">
						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								1. Délai de retour
							</h3>
							<p className="text-gray-700">
								Vous disposez de <strong>15 jours</strong> à compter de la
								réception de votre commande pour nous retourner un article.
							</p>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								2. Conditions de retour
							</h3>
							<ul className="text-gray-700 space-y-2">
								<li>• L'article doit être dans son état d'origine</li>
								<li>• Les étiquettes doivent être intactes</li>
								<li>• L'article ne doit pas avoir été porté ou lavé</li>
								<li>• L'emballage d'origine doit être conservé</li>
							</ul>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								3. Procédure de retour
							</h3>
							<div className="space-y-4">
								<p className="text-gray-700">
									Pour initier un retour, vous avez deux options :
								</p>

								<div className="bg-rose-light rounded-lg p-4">
									<h4 className="font-semibold text-nude-dark mb-2">
										Option 1 : Via votre espace client
									</h4>
									<p className="text-gray-700 mb-3">
										Connectez-vous à votre compte et accédez à vos commandes :
									</p>
									<Link
										href="/orders"
										className="inline-block bg-logo text-nude-light px-6 py-2 rounded-md hover:bg-nude-dark-2 transition-colors"
									>
										Voir mes commandes
									</Link>
								</div>

								<div className="bg-beige-light rounded-lg p-4">
									<h4 className="font-semibold text-nude-dark mb-2">
										Option 2 : Contactez notre service client
									</h4>
									<p className="text-gray-700 mb-3">
										Notre équipe vous accompagne dans votre démarche :
									</p>
									<Link
										href="/contact"
										className="inline-block bg-logo text-nude-light px-6 py-2 rounded-md hover:bg-nude-dark-2 transition-colors"
									>
										Contacter le service client
									</Link>
								</div>
							</div>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								4. Remboursement
							</h3>
							<p className="text-gray-700">
								Une fois le retour reçu et validé, le remboursement sera
								effectué sous <strong>5 à 10 jours ouvrés</strong>
								selon votre mode de paiement initial.
							</p>
						</div>
					</div>
				</div>

				{/* Bouton retour */}
				<div className="text-center">
					<Link
						href="/"
						className="inline-block bg-nude-dark text-white px-8 py-3 rounded-md hover:bg-nude-dark-2 transition-colors"
					>
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</div>
	);
}
