import Link from "next/link";

export default function ProductNotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-beige-light to-rose-light-2 flex items-center justify-center px-4">
			<div className="text-center max-w-2xl">
				<div className="text-8xl mb-6">🛍️</div>
				<h1 className="text-4xl lg:text-5xl font-alex-brush text-logo mb-4">
					Produit introuvable
				</h1>
				<p className="text-lg text-nude-dark mb-8">
					Le produit que vous recherchez n'existe pas ou a été supprimé.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/collections"
						className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
					>
						Voir toutes les collections
					</Link>
					<Link
						href="/"
						className="rounded-2xl w-max ring-1 ring-nude-dark text-nude-dark py-3 px-6 text-sm hover:bg-nude-dark hover:text-[#f8ede4] transition-all duration-300"
					>
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</div>
	);
}
