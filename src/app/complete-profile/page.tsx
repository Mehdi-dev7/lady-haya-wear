"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

function CompleteProfileContent() {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		phone: "",
	});
	const [tempAuthData, setTempAuthData] = useState<any>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const provider = searchParams.get("provider");

	useEffect(() => {
		// Récupérer les données temporaires du cookie
		const getTempAuthData = async () => {
			try {
				const response = await fetch("/api/auth/temp-data");
				if (response.ok) {
					const data = await response.json();
					setTempAuthData(data);

					// Pré-remplir le formulaire avec les données Instagram
					if (data.instagramUsername) {
						const formattedName = data.instagramUsername
							.replace(/[._]/g, " ")
							.split(" ")
							.map(
								(word: string) =>
									word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
							)
							.join(" ");

						setFormData((prev) => ({
							...prev,
							firstName: formattedName,
						}));
					}
				} else {
					toast.error("Session expirée. Veuillez vous reconnecter.");
					router.push("/login");
				}
			} catch (error) {
				console.error("Erreur lors de la récupération des données:", error);
				router.push("/login");
			}
		};

		getTempAuthData();
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validation du numéro de téléphone - format français
		if (
			formData.phone &&
			!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone)
		) {
			toast.error(
				"Veuillez entrer un numéro de téléphone français valide (ex: 06 12 34 56 78)"
			);
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/auth/complete-profile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					provider,
					tempAuthData,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.updated) {
					toast.success("Profil mis à jour avec succès !");
				} else {
					toast.success("Profil complété avec succès !");
				}
				// Redirection vers l'accueil avec un délai pour laisser le toast s'afficher
				console.log("Redirection vers l'accueil dans 1.5 secondes...");
				setTimeout(() => {
					console.log("Redirection vers l'accueil maintenant...");
					router.push("/");
				}, 1500);
			} else {
				// Gestion spécifique des erreurs
				if (response.status === 409) {
					toast.error(
						"Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter avec ce compte."
					);
				} else if (response.status === 401) {
					toast.error("Session expirée. Veuillez vous reconnecter.");
					router.push("/login");
				} else {
					toast.error(data.error || "Erreur lors de la complétion du profil");
				}
			}
		} catch (error) {
			console.error("Erreur lors de la soumission:", error);
			toast.error("Erreur de connexion. Veuillez réessayer.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		// Validation spéciale pour le téléphone
		if (name === "phone") {
			// Permettre le format téléphone français
			if (value === "" || /^[0-9\s.\-+()]*$/.test(value)) {
				setFormData((prev) => ({ ...prev, [name]: value }));
			}
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	if (!tempAuthData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#fae4e4]/75">
				<div className="bg-white p-8 rounded-lg shadow-lg">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-medium mx-auto"></div>
					<p className="text-center mt-4 text-gray-600">Chargement...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#fae4e4]/75 px-4">
			<div className="bg-nude-light p-8 rounded-lg shadow-lg w-full max-w-md">
				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold text-logo mb-2">
						Complétez votre profil
					</h1>
					<p className="text-gray-600">
						Connecté via {provider === "instagram" ? "Instagram" : provider}
					</p>
					{tempAuthData?.instagramUsername && (
						<p className="text-sm text-gray-500 mt-1">
							@{tempAuthData.instagramUsername}
						</p>
					)}
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email *
						</label>
						<input
							type="email"
							name="email"
							required
							value={formData.email}
							onChange={handleInputChange}
							className="border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark w-full"
							placeholder="votre@email.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Prénom *
						</label>
						<input
							type="text"
							name="firstName"
							required
							value={formData.firstName}
							onChange={handleInputChange}
							className="border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark w-full"
							placeholder="Votre prénom"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nom *
						</label>
						<input
							type="text"
							name="lastName"
							required
							value={formData.lastName}
							onChange={handleInputChange}
							className="border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark w-full"
							placeholder="Votre nom"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Téléphone
						</label>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleInputChange}
							className="border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark w-full"
							placeholder="06 12 34 56 78"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-rose-medium text-white py-2 px-4 rounded-md hover:bg-rose-dark-2 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Création du profil..." : "Créer mon profil"}
					</button>
				</form>

				<div className="mt-4 text-center">
					<p className="text-xs text-gray-500">
						* Champs obligatoires pour la livraison et la communication
					</p>
				</div>
			</div>
		</div>
	);
}

export default function CompleteProfile() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-[#fae4e4]/75">
					<div className="bg-white p-8 rounded-lg shadow-lg">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-medium mx-auto"></div>
						<p className="text-center mt-4 text-gray-600">Chargement...</p>
					</div>
				</div>
			}
		>
			<CompleteProfileContent />
		</Suspense>
	);
}
