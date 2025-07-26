import Link from "next/link";

export default function ServiceClientPage() {
	return (
		<div className="min-h-screen bg-rose-light-2 py-16 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4 mt-8">
						Service Client
					</h1>
					<p className="text-base lg:text-lg text-nude-dark-2">
						Notre équipe est là pour vous accompagner 7j/7
					</p>
				</div>

				{/* Contenu principal */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
					<h2 className="text-2xl font-balqis text-logo mb-6">
						Comment nous contacter ?
					</h2>

					<div className="space-y-6">
						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Horaires d'ouverture
							</h3>
							<p className="text-gray-700">
								Notre service client est disponible{" "}
								<strong>7 jours sur 7</strong> pour répondre à toutes vos
								questions et vous accompagner dans vos achats.
							</p>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Moyens de contact
							</h3>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-rose-light rounded-lg p-6">
									<h4 className="font-semibold text-nude-dark mb-3 text-lg">
										Formulaire de contact
									</h4>
									<p className="text-gray-700 mb-4">
										Remplissez notre formulaire en ligne pour nous poser vos
										questions ou signaler un problème.
									</p>
									<Link
										href="/contact"
										className="inline-block bg-logo text-nude-light px-6 py-2 rounded-md hover:bg-nude-dark-2 transition-colors"
									>
										Nous contacter
									</Link>
								</div>

								<div className="bg-beige-light rounded-lg p-6">
									<h4 className="font-semibold text-nude-dark mb-3 text-lg">
										Email
									</h4>
									<p className="text-gray-700 mb-4">
										Envoyez-nous un email directement à notre équipe support.
									</p>
									<a
										href="mailto:contact@ladyhaya.com"
										className="inline-block bg-logo text-nude-light px-6 py-2 rounded-md hover:bg-nude-dark-2 transition-colors"
									>
										contact@ladyhaya.com
									</a>
								</div>
							</div>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Types d'assistance
							</h3>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">?</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Questions sur les produits
										</h4>
										<p className="text-gray-700 text-sm">
											Taille, matière, disponibilité, conseils de style...
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">📦</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Suivi de commande
										</h4>
										<p className="text-gray-700 text-sm">
											Statut de livraison, modification d'adresse, délais...
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">↩️</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Retours et échanges
										</h4>
										<p className="text-gray-700 text-sm">
											Procédure de retour, remboursement, échange de taille...
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">💳</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Problèmes de paiement
										</h4>
										<p className="text-gray-700 text-sm">
											Erreur de transaction, remboursement, facturation...
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">🔧</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Problèmes techniques
										</h4>
										<p className="text-gray-700 text-sm">
											Difficultés sur le site, compte utilisateur, panier...
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Délais de réponse
							</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-green-500 rounded-full"></div>
									<p className="text-gray-700">
										<strong>Email :</strong> Réponse sous 24h maximum
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-green-500 rounded-full"></div>
									<p className="text-gray-700">
										<strong>Formulaire :</strong> Réponse sous 24h maximum
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-orange-500 rounded-full"></div>
									<p className="text-gray-700">
										<strong>Week-ends et jours fériés :</strong> Réponse le jour
										ouvré suivant
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Boutons d'action */}
				<div className="text-center space-y-4">
					<Link
						href="/contact"
						className="inline-block bg-logo text-nude-light px-8 py-3 rounded-md hover:bg-nude-dark-2 transition-colors mr-4"
					>
						Nous contacter maintenant
					</Link>
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
