import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="text-6xl mb-6">🛍️</div>
				<h1 className="text-4xl font-alex-brush text-logo mb-4">
					Collection introuvable
				</h1>
				<p className="text-nude-dark mb-8">
					Désolé, cette collection n&apos;existe pas ou a été supprimée.
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
						Retour à l&apos;accueil
					</Link>
				</div>
			</div>
		</div>
	);
}
