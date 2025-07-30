export default function PolitiqueConfidentialitePage() {
	return (
		<div className="min-h-screen bg-beige-light py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* En-tête */}
				<div className="text-center mb-12">
					<h1 className="text-4xl sm:text-5xl font-alex-brush text-logo mb-4 mt-8">
						Politique de Confidentialité
					</h1>
					<p className="text-nude-dark text-base lg:text-lg">
						Protection de vos données personnelles
					</p>
				</div>

				{/* Contenu */}
				<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
					{/* Introduction */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Introduction
						</h2>
						<div className="space-y-3 text-nude-dark">
							<p>
								Lady Haya Wear s'engage à protéger la vie privée de ses
								utilisateurs. Cette politique de confidentialité décrit comment
								nous collectons, utilisons et protégeons vos informations
								personnelles.
							</p>
							<p>
								En utilisant notre site web, vous acceptez les pratiques
								décrites dans cette politique.
							</p>
						</div>
					</section>

					{/* Responsable du traitement */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Responsable du Traitement
						</h2>
						<div className="space-y-3 text-nude-dark">
							<p>
								<strong>Lady Haya Wear</strong>
							</p>
							<p>123 Rue de la Mode, 75001 Paris, France</p>
							<p>Email : contact@ladyhaya-wear.fr</p>
							<p>Téléphone : +33 1 23 45 67 89</p>
						</div>
					</section>

					{/* Données collectées */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Données Collectées
						</h2>
						<div className="space-y-4 text-nude-dark">
							<div>
								<h3 className="text-lg font-semibold text-logo mb-2">
									Données d'identification
								</h3>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>Nom et prénom</li>
									<li>Adresse email</li>
									<li>Adresse postale</li>
									<li>Numéro de téléphone</li>
									<li>Date de naissance</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-logo mb-2">
									Données de navigation
								</h3>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>Adresse IP</li>
									<li>Type de navigateur</li>
									<li>Pages visitées</li>
									<li>Durée de visite</li>
									<li>Cookies</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-logo mb-2">
									Données de commande
								</h3>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>Historique des commandes</li>
									<li>Préférences de produits</li>
									<li>Données de paiement (traitées par nos prestataires)</li>
								</ul>
							</div>
						</div>
					</section>

					{/* Finalités du traitement */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">
							Finalités du Traitement
						</h2>
						<div className="space-y-3 text-nude-dark">
							<p>Vos données sont collectées pour les finalités suivantes :</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>Gestion de votre compte client</li>
								<li>Traitement de vos commandes</li>
								<li>Service client et support</li>
								<li>Envoi de newsletters (avec votre consentement)</li>
								<li>Amélioration de nos services</li>
								<li>Respect des obligations légales</li>
							</ul>
						</div>
					</section>

					{/* Base légale */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">Base Légale</h2>
						<div className="space-y-3 text-nude-dark">
							<p>Le traitement de vos données est fondé sur :</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>
									<strong>L'exécution du contrat :</strong> Pour traiter vos
									commandes
								</li>
								<li>
									<strong>L'intérêt légitime :</strong> Pour améliorer nos
									services
								</li>
								<li>
									<strong>Le consentement :</strong> Pour les newsletters et
									cookies
								</li>
								<li>
									<strong>L'obligation légale :</strong> Pour la comptabilité et
									la facturation
								</li>
							</ul>
						</div>
					</section>

					{/* Destinataires */}
					<section>
						<h2 className="text-xl lg:text-2xl font-balqis font-semibold text-logo mb-4">
							Destinataires des Données
						</h2>
						<div className="space-y-3 text-nude-dark">
							<p>Vos données peuvent être partagées avec :</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>Nos prestataires de paiement (Stripe, PayPal)</li>
								<li>Nos prestataires de livraison</li>
								<li>Nos prestataires techniques (hébergement, email)</li>
								<li>Les autorités compétentes (si requis par la loi)</li>
							</ul>
						</div>
					</section>

					{/* Durée de conservation */}
					<section>
						<h2 className="text-xl lg:text-2xl font-balqis font-semibold text-logo mb-4">
							Durée de Conservation
						</h2>
						<div className="space-y-3 text-nude-dark">
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>
									<strong>Données de compte :</strong> 3 ans après la dernière
									activité
								</li>
								<li>
									<strong>Données de commande :</strong> 10 ans (obligation
									comptable)
								</li>
								<li>
									<strong>Données de navigation :</strong> 13 mois maximum
								</li>
								<li>
									<strong>Newsletter :</strong> Jusqu'au désabonnement
								</li>
							</ul>
						</div>
					</section>

					{/* Vos droits */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">Vos Droits</h2>
						<div className="space-y-3 text-nude-dark">
							<p>Conformément au RGPD, vous disposez des droits suivants :</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>
									<strong>Droit d'accès :</strong> Consulter vos données
								</li>
								<li>
									<strong>Droit de rectification :</strong> Corriger vos données
								</li>
								<li>
									<strong>Droit d'effacement :</strong> Supprimer vos données
								</li>
								<li>
									<strong>Droit à la portabilité :</strong> Récupérer vos
									données
								</li>
								<li>
									<strong>Droit d'opposition :</strong> Vous opposer au
									traitement
								</li>
								<li>
									<strong>Droit de limitation :</strong> Limiter le traitement
								</li>
							</ul>
							<p className="mt-4">
								Pour exercer ces droits, contactez-nous à :
								contact@ladyhaya-wear.fr
							</p>
						</div>
					</section>

					{/* Cookies */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">Cookies</h2>
						<div className="space-y-3 text-nude-dark">
							<p>Notre site utilise des cookies pour :</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>Améliorer votre expérience de navigation</li>
								<li>Analyser le trafic du site</li>
								<li>Mémoriser vos préférences</li>
								<li>Sécuriser votre session</li>
							</ul>
							<p className="mt-4">
								Vous pouvez gérer vos préférences de cookies dans les paramètres
								de votre navigateur.
							</p>
						</div>
					</section>

					{/* Sécurité */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">Sécurité</h2>
						<div className="space-y-3 text-nude-dark">
							<p>
								Nous mettons en œuvre des mesures techniques et
								organisationnelles appropriées pour protéger vos données contre
								l'accès non autorisé, la modification, la divulgation ou la
								destruction.
							</p>
						</div>
					</section>

					{/* Contact */}
					<section>
						<h2 className="text-2xl font-balqis font-semibold text-logo mb-4">Contact</h2>
						<div className="space-y-3 text-nude-dark">
							<p>
								Pour toute question concernant cette politique de
								confidentialité :
							</p>
							<p>
								<strong>Email :</strong> contact@ladyhaya-wear.fr
							</p>
							<p>
								<strong>Téléphone :</strong> +33 1 23 45 67 89
							</p>
							<p>
								<strong>Adresse :</strong> 123 Rue de la Mode, 75001 Paris,
								France
							</p>
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
