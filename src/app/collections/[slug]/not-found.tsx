import Link from "next/link";

export default function CollectionNotFound() {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center">
			<div className="text-center px-4">
				<div className="text-8xl mb-6">👗</div>
				<h1 className="text-4xl font-bold text-gray-800 mb-4">
					Collection introuvable
				</h1>
				<p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
					Désolé, la collection que vous recherchez n'existe pas ou a été
					déplacée.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/collections"
						className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
					>
						Voir toutes les collections
					</Link>
					<Link
						href="/"
						className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
					>
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</div>
	);
}
