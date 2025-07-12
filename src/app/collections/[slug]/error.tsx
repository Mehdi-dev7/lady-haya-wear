"use client";

import Link from "next/link";

export default function CollectionError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
			<div className="text-center max-w-2xl mx-auto">
				{/* Icône d'erreur */}
				<div className="text-8xl mb-8">👗</div>

				{/* Titre */}
				<h1 className="text-4xl md:text-5xl font-alex-brush text-nude-dark-2 mb-6">
					Collection introuvable
				</h1>

				{/* Message d'erreur */}
				<p className="text-lg text-nude-dark mb-8">
					Nous n'avons pas pu charger cette collection. Il se peut que la
					collection ait été supprimée ou que le lien soit incorrect.
				</p>

				{/* Détails techniques (optionnel) */}
				{process.env.NODE_ENV === "development" && (
					<details className="mb-8 text-left bg-white p-4 rounded-2xl border border-nude-light">
						<summary className="cursor-pointer text-nude-dark-2 font-semibold mb-2">
							Détails techniques
						</summary>
						<pre className="text-sm text-gray-600 overflow-auto">
							{error.message}
						</pre>
					</details>
				)}

				{/* Boutons d'action */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={reset}
						className="bg-rose-dark-2 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-rose-dark transition-colors shadow-lg hover:shadow-xl"
					>
						Réessayer
					</button>

					<Link
						href="/collections"
						className="ring-2 ring-nude-dark text-nude-dark px-8 py-3 rounded-2xl font-semibold hover:bg-nude-dark hover:text-white transition-colors"
					>
						Voir toutes les collections
					</Link>
				</div>

				{/* Alternatives */}
				<div className="mt-12 p-6 bg-rose-light-2 rounded-2xl">
					<p className="text-nude-dark mb-4">
						Découvrez nos autres collections :
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link
							href="/allProducts"
							className="inline-block bg-nude-dark text-white px-6 py-2 rounded-xl font-medium hover:bg-nude-dark-2 transition-colors"
						>
							Tous nos produits
						</Link>
						<Link
							href="/"
							className="inline-block bg-nude-dark text-white px-6 py-2 rounded-xl font-medium hover:bg-nude-dark-2 transition-colors"
						>
							Retour à l'accueil
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
