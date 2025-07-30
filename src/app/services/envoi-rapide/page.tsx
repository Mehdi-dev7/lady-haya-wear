import Link from "next/link";

export default function EnvoiRapidePage() {
	return (
		<div className="min-h-screen bg-rose-light-2 py-8 md:py-16 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
			<div className="w-full max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8 md:mb-12">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-alex-brush text-logo mb-3 md:mb-4 mt-12 md:mt-8">
						Envoi Rapide
					</h1>
					<p className="text-sm md:text-base lg:text-lg text-nude-dark-2">
						Livraison en 24-48h avec nos partenaires de confiance
					</p>
				</div>

				{/* Contenu principal */}
				<div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
					<h2 className="text-xl md:text-2xl font-balqis font-semibold text-logo mb-4 md:mb-6">
						Nos options de livraison
					</h2>

					<div className="space-y-4 md:space-y-6">
						<div className="border-l-4 border-nude-dark pl-4 md:pl-6">
							<h3 className="text-base md:text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Livraison gratuite dès 60€
							</h3>
							<p className="text-gray-700 text-sm md:text-base">
								Profitez de la livraison gratuite sur toutes vos commandes à
								partir de 60€ d'achat. Une offre valable sur tous nos modes de
								livraison.
							</p>
						</div>

						<div className="border-l-4 border-nude-dark pl-4 md:pl-6">
							<h3 className="text-base md:text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Modes de livraison disponibles
							</h3>
							<div className="space-y-4 md:space-y-6">
								{/* Mondial Relay */}
								<div className="bg-rose-light rounded-lg p-4 md:p-6">
									<div className="flex items-start justify-between mb-3 md:mb-4">
										<div>
											<h4 className="font-semibold text-nude-dark text-sm md:text-base lg:text-lg mb-2">
												Mondial Relay - Point Relais
											</h4>
											<p className="text-gray-700 text-xs md:text-sm mb-3">
												Livraison en point relais partout en France
											</p>
										</div>
										<div className="text-right">
											<div className="text-lg md:text-xl lg:text-2xl font-bold text-logo">
												Gratuit
											</div>
											<div className="text-xs md:text-sm text-gray-500">
												dès 60€
											</div>
										</div>
									</div>
									<div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Délai :</strong> 24-48h
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Suivi :</strong> Numéro de suivi par email/SMS
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Conservation :</strong> 14 jours en point relais
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Plus de 6000 points relais</strong> en France
										</div>
									</div>
								</div>

								{/* Colissimo */}
								<div className="bg-beige-light rounded-lg p-4 md:p-6">
									<div className="flex items-start justify-between mb-3 md:mb-4">
										<div>
											<h4 className="font-semibold text-nude-dark text-sm md:text-base lg:text-lg mb-2">
												Colissimo - Domicile
											</h4>
											<p className="text-gray-700 text-xs md:text-sm mb-3">
												Livraison à domicile avec signature
											</p>
										</div>
										<div className="text-right">
											<div className="text-lg md:text-xl lg:text-2xl font-bold text-logo">
												Gratuit
											</div>
											<div className="text-xs md:text-sm text-gray-500">
												dès 60€
											</div>
										</div>
									</div>
									<div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Délai :</strong> 24-48h
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Signature :</strong> Requise à la réception
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Suivi :</strong> Numéro de suivi détaillé
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<strong>Relance :</strong> 2 passages automatiques
										</div>
									</div>
								</div>

								{/* Chronopost Express */}
								<div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 md:p-6 border-2 border-blue-200">
									<div className="flex items-start justify-between mb-3 md:mb-4">
										<div>
											<h4 className="font-semibold text-nude-dark text-sm md:text-base lg:text-lg mb-2">
												Chronopost Express
											</h4>
											<p className="text-gray-700 text-xs md:text-sm mb-3">
												Livraison express en 24h garantie
											</p>
										</div>
										<div className="text-right">
											<div className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600">
												+8€
											</div>
											<div className="text-xs md:text-sm text-gray-500">
												supplément
											</div>
										</div>
									</div>
									<div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
											<strong>Délai :</strong> 24h garantie
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
											<strong>Livraison :</strong> Avant 13h le lendemain
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
											<strong>Signature :</strong> Obligatoire
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
											<strong>Suivi :</strong> En temps réel
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Processus de livraison
							</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-7 h-7 md:w-8 md:h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
										1
									</div>
									<p className="text-gray-700 text-sm md:text-base">
										Votre commande est préparée et expédiée sous 24h
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-7 h-7 md:w-8 md:h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
										2
									</div>
									<p className="text-gray-700 text-sm md:text-base">
										Vous recevez un email avec le numéro de suivi
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-7 h-7 md:w-8 md:h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
										3
									</div>
									<p className="text-gray-700 text-sm md:text-base">
										Suivez votre colis en temps réel
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-7 h-7 md:w-8 md:h-8 bg-logo text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
										4
									</div>
									<p className="text-gray-700 text-sm md:text-base">
										Réception de votre commande
									</p>
								</div>
							</div>
						</div>

						<div className="border-l-4 border-nude-dark pl-6">
							<h3 className="text-lg lg:text-xl font-semibold text-nude-dark mb-2">
								Informations importantes
							</h3>
							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">!</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Adresse de livraison
										</h4>
										<p className="text-gray-700 text-sm">
											Assurez-vous que votre adresse de livraison est complète
											et exacte pour éviter tout retard.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">!</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Disponibilité
										</h4>
										<p className="text-gray-700 text-sm">
											Les livraisons sont effectuées du lundi au vendredi. Les
											commandes passées le week-end sont expédiées le lundi.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<span className="text-white text-xs">!</span>
									</div>
									<div>
										<h4 className="font-semibold text-nude-dark">
											Suivi de commande
										</h4>
										<p className="text-gray-700 text-sm">
											Vous pouvez suivre votre commande depuis votre espace
											client ou via le lien reçu par email.
										</p>
									</div>
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
						Question sur la livraison ?
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
