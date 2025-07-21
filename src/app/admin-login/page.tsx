"use client";

import Loader from "@/components/Loader";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function AdminLoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/admin/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				// Connexion réussie
				window.location.href = "/dashboard";
			} else {
				setError(data.error || "Identifiants incorrects");
			}
		} catch (err) {
			setError("Erreur de connexion");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="min-h-screen bg-beige-light flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo et titre */}
				<div className="flex flex-row items-center">
					<div className="inline-flex items-center justify-center w-16 h-16 ml-20 bg-nude-dark rounded-full mb-6 shadow-lg">
						<Lock className="h-8 w-8 text-beige-light" />
					</div>
					<h1 className="text-4xl font-alex-brush text-logo ml-6 mb-2">
						Lady Haya
					</h1>
				</div>
				<div className="flex flex-col items-center">
					<p className="text-xl font-semibold text-nude-dark mb-1">
						Espace Administration
					</p>
					<p className="text-nude-dark-2">Connexion sécurisée</p>
				</div>

				{/* Formulaire de connexion */}
				<div className="bg-nude-light rounded-2xl shadow-xl p-8 border-2 border-nude-medium">
					<div className="text-center mb-6">
						<h2 className="text-2xl font-bold text-logo">Connexion Admin</h2>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="flex items-center space-x-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
								<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
								<span className="text-sm text-red-600 font-medium">
									{error}
								</span>
							</div>
						)}

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-semibold text-nude-dark mb-2"
							>
								Adresse email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="Votre email"
								required
								className="w-full px-4 py-3 rounded-xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text bg-white"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-semibold text-nude-dark mb-2"
							>
								Mot de passe
							</label>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Votre mot de passe"
									required
									className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-nude-medium focus:border-nude-dark focus:outline-none transition-colors cursor-text bg-white"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
								>
									{showPassword ? (
										<Eye className="h-5 w-5 text-nude-dark-2 hover:text-nude-dark transition-colors" />
									) : (
										<EyeOff className="h-5 w-5 text-nude-dark-2 hover:text-nude-dark transition-colors" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-nude-dark text-beige-light py-3 px-6 rounded-xl font-semibold hover:bg-nude-dark-2 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
						>
							{isLoading ? (
								<div className="flex items-center justify-center space-x-3">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-beige-light"></div>
									<span>Connexion en cours...</span>
								</div>
							) : (
								"Se connecter"
							)}
						</button>
					</form>

					<div className="mt-8 text-center">
						<Link
							href="/"
							className="text-sm text-nude-dark hover:text-logo transition-colors font-medium"
						>
							← Retour à la boutique
						</Link>
					</div>
				</div>

				{/* Informations de sécurité */}
				<div className="mt-8 text-center">
					<p className="text-xs text-nude-dark-2">
						Accès réservé aux administrateurs autorisés
					</p>
				</div>
			</div>
		</div>
	);
}
