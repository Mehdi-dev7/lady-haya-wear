"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UnsubscribePage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const [isLoading, setIsLoading] = useState(false);
	const [isUnsubscribed, setIsUnsubscribed] = useState(false);

	const handleUnsubscribe = async () => {
		if (!email) {
			toast.error("Email manquant");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("/api/newsletter/unsubscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				setIsUnsubscribed(true);
				toast.success("Désabonnement réussi");
			} else {
				toast.error("Erreur lors du désabonnement");
			}
		} catch (error) {
			toast.error("Erreur lors du désabonnement");
		} finally {
			setIsLoading(false);
		}
	};

	if (isUnsubscribed) {
		return (
			<div className="min-h-screen bg-beige-light flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
					<div className="text-green-500 text-6xl mb-4">✓</div>
					<h1 className="text-2xl font-bold text-gray-800 mb-4">
						Désabonnement réussi
					</h1>
					<p className="text-gray-600 mb-6">
						Vous ne recevrez plus nos newsletters.
					</p>
					<a
						href="/"
						className="bg-nude-dark text-white px-6 py-3 rounded-lg hover:bg-nude-medium transition-colors"
					>
						Retour à l'accueil
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-beige-light flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
				<div className="text-nude-dark text-6xl mb-4">📧</div>
				<h1 className="text-2xl font-bold text-gray-800 mb-4">
					Se désabonner
				</h1>
				{email && (
					<p className="text-gray-600 mb-6">
						Voulez-vous vous désabonner de la newsletter pour{" "}
						<strong>{email}</strong> ?
					</p>
				)}
				<div className="space-y-4">
					<button
						onClick={handleUnsubscribe}
						disabled={isLoading || !email}
						className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
					>
						{isLoading ? "Désabonnement..." : "Se désabonner"}
					</button>
					<a
						href="/"
						className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
					>
						Annuler
					</a>
				</div>
			</div>
		</div>
	);
}
