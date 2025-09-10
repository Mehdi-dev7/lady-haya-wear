"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function Newsletter() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !email.includes("@")) {
			toast.error("Veuillez entrer une adresse email valide");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Merci pour votre inscription ! 🎉");
				setEmail("");
			} else {
				toast.error(data.error || "Erreur lors de l'inscription");
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de l'inscription");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section
			className="relative h-[60vh] sm:h-[55vh] md:h-[50vh] lg:h-[48vh] xl:h-[48vh] 2xl:h-[38vh] overflow-hidden"
			style={{
				backgroundImage: "url(/assets/grid/newsletter.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center 100%",
				backgroundAttachment: "fixed",
				backgroundRepeat: "no-repeat",
			}}
		>
			{/* Overlay pour améliorer la lisibilité */}
			<div className="absolute inset-0 bg-white/50"></div>

			{/* Contenu de la newsletter - reste dans l'image */}
			<div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
				<h2 className="text-5xl lg:text-6xl font-alex-brush text-logo mt-8 mb-6 lg:mb-0 drop-shadow-lg">
					Newsletter
				</h2>

				<div className="bg-nude-light/80 backdrop-blur-xl rounded-3xl p-1 max-w-sm xl:max-w-md shadow-2xl mx-auto lg:ml-auto lg:mr-24 2xl:mr-54 border-2 border-rose-dark">
					<div className="bg-beige-light/60 backdrop-blur-sm rounded-3xl p-6">
						<div className="text-center mb-6">
							<div className="w-14 h-14 bg-logo/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border-2 border-rose-dark">
								<svg
									className="w-8 h-8 text-rose-dark"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<p className="text-rose-light font-light text-base leading-relaxed drop-shadow-sm">
								Découvrez nos dernières créations en avant-première
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="relative">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="votre@email.com"
									className="w-full p-4 rounded-2xl bg-rose-light-2 backdrop-blur-sm border-2 border-nude-medium text-logo placeholder-nude-dark focus:outline-none focus:border-rose-dark-2 focus:bg-rose-light focus:ring-2 focus:ring-rose-dark-2 transition-all duration-300 text-center"
									disabled={isLoading}
									required
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="group w-full bg-gradient-to-r from-logo to-nude-dark hover:from-nude-dark hover:to-logo text-beige-light py-4 rounded-2xl backdrop-blur-sm border-2 border-logo hover:border-nude-dark transition-all duration-500 font-light tracking-wide shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="group-hover:scale-105 transition-transform duration-300 inline-block">
									{isLoading ? "Inscription..." : "Rejoindre la communauté ✨"}
								</span>
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
