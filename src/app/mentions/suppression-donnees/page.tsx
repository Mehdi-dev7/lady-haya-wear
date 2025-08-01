export default function SuppressionDonneesPage() {
	return (
		<div className="min-h-screen bg-beige-light py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* En-tête */}
				<div className="text-center mb-12">
					<h1 className="text-4xl sm:text-5xl font-alex-brush text-logo mb-4 mt-8">
						Suppression des Données Utilisateur
					</h1>
					<p className="text-nude-dark text-base lg:text-lg">
						Comment supprimer vos données personnelles
					</p>
				</div>

				{/* Contenu */}
				<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
					{/* Introduction */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Votre Droit à la Suppression
						</h2>
						<div className="space-y-3 text-nude-dark">
							<p>
								Conformément au Règlement Général sur la Protection des Données (RGPD), 
								vous avez le droit de demander la suppression de vos données personnelles 
								à tout moment.
							</p>
							<p>
								Lady Haya Wear s'engage à traiter votre demande dans un délai maximum de 30 jours.
							</p>
						</div>
					</section>

					{/* Méthodes de suppression */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Comment Supprimer Vos Données
						</h2>
						<div className="space-y-6 text-nude-dark">
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
								<h3 className="text-lg font-semibold text-blue-800 mb-3">
									🖥️ Via votre compte en ligne
								</h3>
								<ol className="list-decimal list-inside space-y-2 ml-4">
									<li>Connectez-vous à votre compte sur ladyhaya-wear.fr</li>
									<li>Allez dans "Mon compte" → "Paramètres"</li>
									<li>Cliquez sur "Supprimer mon compte"</li>
									<li>Confirmez votre choix</li>
								</ol>
							</div>

							<div className="bg-green-50 border border-green-200 rounded-lg p-6">
								<h3 className="text-lg font-semibold text-green-800 mb-3">
									📧 Par email
								</h3>
								<p className="mb-3">
									Envoyez votre demande à : 
									<a href="mailto:contact@ladyhaya-wear.fr" className="text-blue-600 hover:underline">
										contact@ladyhaya-wear.fr
									</a>
								</p>
								<p className="text-sm">
									<strong>Objet recommandé :</strong> "Demande de suppression de données personnelles"
								</p>
							</div>

							<div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
								<h3 className="text-lg font-semibold text-purple-800 mb-3">
									📞 Par téléphone
								</h3>
								<p>
									Appelez le <strong>+33 1 23 45 67 89</strong> et demandez la suppression de vos données.
								</p>
							</div>
						</div>
					</section>

					{/* Informations requises */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Informations Requises
						</h2>
						<div className="space-y-3 text-nude-dark">
							<p>Pour traiter votre demande, nous avons besoin de :</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>Votre nom et prénom</li>
								<li>Votre adresse email</li>
								<li>La raison de votre demande (optionnel)</li>
								<li>Une copie de votre pièce d'identité (pour vérification)</li>
							</ul>
						</div>
					</section>

					{/* Données supprimées */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Données Qui Seront Supprimées
						</h2>
						<div className="space-y-3 text-nude-dark">
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>Vos informations personnelles (nom, email, adresse)</li>
								<li>Votre historique de commandes</li>
								<li>Vos préférences et favoris</li>
								<li>Vos données de navigation</li>
								<li>Vos cookies et sessions</li>
							</ul>
							<p className="mt-4 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-4">
								<strong>Note :</strong> Certaines données peuvent être conservées pour des obligations légales 
								(comptabilité, facturation) pendant 10 ans selon la loi française.
							</p>
						</div>
					</section>

					{/* Délai de traitement */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Délai de Traitement
						</h2>
						<div className="space-y-3 text-nude-dark">
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p>
									<strong>Délai maximum :</strong> 30 jours à compter de la réception de votre demande
								</p>
								<p className="mt-2">
									<strong>Confirmation :</strong> Vous recevrez un email de confirmation une fois la suppression effectuée
								</p>
							</div>
						</div>
					</section>

					{/* Contact */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Contact
						</h2>
						<div className="space-y-3 text-nude-dark">
							<p>Pour toute question concernant la suppression de vos données :</p>
							<div className="bg-gray-50 rounded-lg p-4">
								<p><strong>Email :</strong> contact@ladyhaya-wear.fr</p>
								<p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
								<p><strong>Adresse :</strong> 123 Rue de la Mode, 75001 Paris, France</p>
							</div>
						</div>
					</section>
				</div>

				{/* Date de mise à jour */}
				<div className="text-center mt-8">
					<p className="text-sm text-nude-dark">
						Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
					</p>
				</div>
			</div>
		</div>
	);
} 