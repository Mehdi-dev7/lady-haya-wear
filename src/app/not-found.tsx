import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-beige-light flex items-center justify-center p-4">
			<div className="text-center max-w-md mx-auto">
				{/* Emoji principal */}
				<div className="text-8xl mb-6 animate-bounce">👗</div>

				{/* Titre */}
				<h1 className="text-4xl sm:text-5xl font-alex-brush text-logo mb-4">
					Oups ! Page introuvable
				</h1>

				{/* Sous-titre */}
				<p className="text-lg sm:text-xl text-nude-dark mb-8">
					Cette robe semble avoir disparu dans le dressing...
					<span className="block mt-2">🔍</span>
				</p>

				{/* Message d'erreur */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-rose-light">
					<div className="text-6xl mb-4">💫</div>
					<p className="text-nude-dark text-sm sm:text-base">
						La page que vous recherchez n'existe pas ou a été déplacée.
					</p>
				</div>

				{/* Boutons d'action */}
				<div className="space-y-4">
					<Link
						href="/"
						className="inline-block bg-nude-dark text-beige-light hover:bg-nude-dark-2 cursor-pointer hover:scale-105 transition-all duration-300 px-8 py-3 rounded-2xl font-medium text-lg shadow-lg"
					>
						🏠 Retour à l'accueil
					</Link>

					<div className="flex justify-center space-x-4">
						<Link
							href="/collections"
							className="inline-block bg-rose-light text-nude-dark hover:bg-rose-medium hover:text-logo cursor-pointer hover:scale-105 transition-all duration-300 px-6 py-2 rounded-xl font-medium shadow-md"
						>
							👗 Collections
						</Link>

						<Link
							href="/contact"
							className="inline-block bg-rose-light text-nude-dark hover:bg-rose-medium hover:text-logo cursor-pointer hover:scale-105 transition-all duration-300 px-6 py-2 rounded-xl font-medium shadow-md"
						>
							💬 Contact
						</Link>
					</div>
				</div>

				{/* Code d'erreur stylisé */}
				<div className="mt-8 text-center">
					<div className="inline-block bg-nude-dark text-beige-light px-4 py-2 rounded-lg font-mono text-sm">
						Erreur 404
					</div>
				</div>

				{/* Emojis décoratifs */}
				<div className="mt-8 flex justify-center space-x-4 text-2xl">
					<span className="animate-pulse">✨</span>
					<span className="animate-pulse delay-100">🌸</span>
					<span className="animate-pulse delay-200">💎</span>
					<span className="animate-pulse delay-300">✨</span>
				</div>
			</div>
		</div>
	);
}
