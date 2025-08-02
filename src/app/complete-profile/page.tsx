"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CompleteProfile() {
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
				toast.success("Profil complété avec succès !");
				router.push("/?success=profile_completed");
			} else {
				toast.error(data.error || "Erreur lors de la complétion du profil");
			}
		} catch (error) {
			toast.error("Erreur lors de la complétion du profil");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
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
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
							required
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-medium focus:border-transparent"
							placeholder="votre@email.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Prénom *
						</label>
						<input
							type="text"
							required
							value={formData.firstName}
							onChange={(e) => handleInputChange("firstName", e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-medium focus:border-transparent"
							placeholder="Votre prénom"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nom *
						</label>
						<input
							type="text"
							required
							value={formData.lastName}
							onChange={(e) => handleInputChange("lastName", e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-medium focus:border-transparent"
							placeholder="Votre nom"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Téléphone
						</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) => handleInputChange("phone", e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-medium focus:border-transparent"
							placeholder="Votre numéro de téléphone"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-rose-medium text-white py-2 px-4 rounded-md hover:bg-rose-dark-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
