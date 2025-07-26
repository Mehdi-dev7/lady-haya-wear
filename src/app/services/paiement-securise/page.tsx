import Link from "next/link";

export default function PaiementSecurisePage() {
	return (
		<div className="min-h-screen bg-rose-light-2 py-16 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4 mt-8">
						Paiement Sécurisé
					</h1>
					<p className="text-base lg:text-lg text-nude-dark-2">
						Vos données sont protégées par les plus hauts standards de sécurité
					</p>
				</div>

				{/* Contenu principal */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
					<h2 className="text-2xl font-balqis text-logo mb-6">
						Notre partenaire de confiance : Stripe
					</h2>

					<div className="space-y-6">
						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Pourquoi Stripe ?
							</h3>
							<p className="text-gray-700">
								Stripe est le leader mondial du paiement en ligne, utilisé par
								des millions d'entreprises à travers le monde. Nous avons choisi
								ce partenaire pour garantir la sécurité de vos transactions.
							</p>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Modes de paiement acceptés
							</h3>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="bg-rose-light rounded-lg p-4">
									<h4 className="font-semibold text-nude-dark mb-2">
										Cartes bancaires
									</h4>
									<ul className="text-gray-700 text-sm space-y-1">
										<li>• Visa</li>
										<li>• Mastercard</li>
										<li>• American Express</li>
										<li>• Cartes de débit et crédit</li>
									</ul>
								</div>
								<div className="bg-beige-light rounded-lg p-4">
									<h4 className="font-semibold text-nude-dark mb-2">
										Paiements numériques
									</h4>
									<ul className="text-gray-700 text-sm space-y-1">
										<li>• PayPal</li>
										<li>• Apple Pay</li>
										<li>• Google Pay</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Garanties de sécurité
							</h3>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">✓</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Chiffrement SSL/TLS
										</h4>
										<p className="text-gray-700 text-sm">
											Toutes les données sont chiffrées en transit avec les
											protocoles les plus sécurisés.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">✓</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Certification PCI DSS
										</h4>
										<p className="text-gray-700 text-sm">
											Stripe respecte les plus hauts standards de sécurité pour
											les données de cartes bancaires.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">✓</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Aucune donnée stockée
										</h4>
										<p className="text-gray-700 text-sm">
											Nous ne stockons jamais vos informations de paiement sur
											nos serveurs.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">✓</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Protection contre la fraude
										</h4>
										<p className="text-gray-700 text-sm">
											Système de détection automatique des transactions
											suspectes.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Processus de paiement
							</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold">
										1
									</div>
									<p className="text-gray-700">
										Vous sélectionnez vos articles et validez votre panier
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold">
										2
									</div>
									<p className="text-gray-700">
										Vous êtes redirigé vers la page de paiement sécurisée Stripe
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold">
										3
									</div>
									<p className="text-gray-700">
										Vous saisissez vos informations de paiement de manière
										sécurisée
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold">
										4
									</div>
									<p className="text-gray-700">
										La transaction est validée et vous recevez une confirmation
									</p>
								</div>
							</div>
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
