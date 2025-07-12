export default function GuideTaillesPage() {
	return (
		<div className="min-h-screen bg-beige-light">
			{/* Header */}
			<div className="bg-gradient-to-r from-rose-light-2 to-rose-light py-16 mt-16">
				<div className="container mx-auto px-4">
					<h1 className="text-4xl md:text-5xl font-bold text-nude-dark-2 text-center mb-4 font-alex-brush">
						Guide des Tailles
					</h1>
					<p className="text-lg text-nude-dark text-center max-w-2xl mx-auto">
						Découvrez comment mesurer correctement et choisir la taille parfaite
						pour vos vêtements Lady Haya Wear
					</p>
				</div>
			</div>

			{/* Contenu principal */}
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					{/* Section Comment mesurer */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-nude-dark-2 mb-8 text-center font-balqis">
							Comment mesurer ?
						</h2>

						<div className="grid md:grid-cols-2 gap-8">
							{/* Instructions de mesure */}
							<div className="bg-white p-6 rounded-2xl shadow-lg border border-nude-light">
								<h3 className="text-xl font-semibold text-nude-dark-2 mb-4">
									📏 Instructions de mesure
								</h3>
								<ul className="space-y-3 text-nude-dark">
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">1.</span>
										<span>Utilisez un mètre ruban souple</span>
									</li>
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">2.</span>
										<span>Mesurez-vous en sous-vêtements</span>
									</li>
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">3.</span>
										<span>Ne serrez pas trop le mètre ruban</span>
									</li>
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">4.</span>
										<span>Notez vos mesures en centimètres</span>
									</li>
								</ul>
							</div>

							{/* Mesures à prendre */}
							<div className="bg-white p-6 rounded-2xl shadow-lg border border-nude-light">
								<h3 className="text-xl font-semibold text-nude-dark-2 mb-4">
									📐 Mesures à prendre
								</h3>
								<ul className="space-y-3 text-nude-dark">
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">•</span>
										<span>
											<strong>Tour de poitrine :</strong> Au niveau le plus
											large
										</span>
									</li>
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">•</span>
										<span>
											<strong>Tour de taille :</strong> Au niveau du nombril
										</span>
									</li>
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">•</span>
										<span>
											<strong>Tour de hanches :</strong> Au niveau le plus large
										</span>
									</li>
									<li className="flex items-start">
										<span className="text-rose-dark-2 font-bold mr-2">•</span>
										<span>
											<strong>Longueur :</strong> De l'épaule au point désiré
										</span>
									</li>
								</ul>
							</div>
						</div>
					</section>

					{/* Tableau des tailles */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-nude-dark-2 mb-8 text-center font-balqis">
							Tableau des Tailles
						</h2>

						<div className="overflow-x-auto">
							<table className="w-full border-collapse bg-white rounded-2xl shadow-lg border border-nude-light">
								<thead>
									<tr className="bg-rose-light">
										<th className="border border-nude-light px-4 py-3 text-left font-semibold text-nude-dark-2">
											Taille
										</th>
										<th className="border border-nude-light px-4 py-3 text-left font-semibold text-nude-dark-2">
											Tour de Poitrine
										</th>
										<th className="border border-nude-light px-4 py-3 text-left font-semibold text-nude-dark-2">
											Tour de Taille
										</th>
										<th className="border border-nude-light px-4 py-3 text-left font-semibold text-nude-dark-2">
											Tour de Hanches
										</th>
										<th className="border border-nude-light px-4 py-3 text-left font-semibold text-nude-dark-2">
											Hauteur
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="hover:bg-rose-light-2 transition-colors">
										<td className="border border-nude-light px-4 py-3 font-medium text-rose-dark-2">
											XS
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											80-84 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											60-64 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											88-92 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											1,50-1,60 m
										</td>
									</tr>
									<tr className="hover:bg-rose-light-2 transition-colors">
										<td className="border border-nude-light px-4 py-3 font-medium text-rose-dark-2">
											S
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											84-88 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											64-68 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											92-96 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											1,55-1,65 m
										</td>
									</tr>
									<tr className="hover:bg-rose-light-2 transition-colors">
										<td className="border border-nude-light px-4 py-3 font-medium text-rose-dark-2">
											M
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											88-92 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											68-72 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											96-100 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											1,60-1,70 m
										</td>
									</tr>
									<tr className="hover:bg-rose-light-2 transition-colors">
										<td className="border border-nude-light px-4 py-3 font-medium text-rose-dark-2">
											L
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											92-96 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											72-76 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											100-104 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											1,65-1,75 m
										</td>
									</tr>
									<tr className="hover:bg-rose-light-2 transition-colors">
										<td className="border border-nude-light px-4 py-3 font-medium text-rose-dark-2">
											XL
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											96-100 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											76-80 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											104-108 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											1,70-1,80 m
										</td>
									</tr>
									<tr className="hover:bg-rose-light-2 transition-colors">
										<td className="border border-nude-light px-4 py-3 font-medium text-rose-dark-2">
											XXL
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											100-104 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											80-84 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											108-112 cm
										</td>
										<td className="border border-nude-light px-4 py-3 text-nude-dark">
											1,75-1,85 m
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					{/* Conseils */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-nude-dark-2 mb-8 text-center font-balqis">
							Conseils pour bien choisir
						</h2>

						<div className="grid md:grid-cols-3 gap-6">
							<div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-nude-light hover:shadow-xl transition-shadow">
								<div className="text-4xl mb-4">🎯</div>
								<h3 className="text-xl font-semibold text-nude-dark-2 mb-3">
									Mesurez-vous
								</h3>
								<p className="text-nude-dark">
									Prenez le temps de bien mesurer toutes les parties de votre
									corps pour un ajustement parfait.
								</p>
							</div>

							<div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-nude-light hover:shadow-xl transition-shadow">
								<div className="text-4xl mb-4">📏</div>
								<h3 className="text-xl font-semibold text-nude-dark-2 mb-3">
									Comparez
								</h3>
								<p className="text-nude-dark">
									Comparez vos mesures avec notre tableau pour trouver la taille
									qui vous correspond le mieux.
								</p>
							</div>

							<div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-nude-light hover:shadow-xl transition-shadow">
								<div className="text-4xl mb-4">💡</div>
								<h3 className="text-xl font-semibold text-nude-dark-2 mb-3">
									En cas de doute
								</h3>
								<p className="text-nude-dark">
									Si vous hésitez entre deux tailles, privilégiez la plus grande
									pour plus de confort.
								</p>
							</div>
						</div>
					</section>

					{/* Contact */}
					<section className="text-center bg-gradient-to-r from-rose-light-2 to-rose-light p-8 rounded-2xl shadow-lg border border-nude-light">
						<h2 className="text-2xl font-bold text-nude-dark-2 mb-4 font-balqis">
							Besoin d'aide ?
						</h2>
						<p className="text-nude-dark mb-6">
							Notre équipe est là pour vous aider à choisir la taille parfaite.
						</p>
						<a
							href="/contact"
							className="inline-block bg-rose-dark-2 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-rose-dark transition-colors shadow-lg hover:shadow-xl"
						>
							Nous contacter
						</a>
					</section>
				</div>
			</div>
		</div>
	);
}
