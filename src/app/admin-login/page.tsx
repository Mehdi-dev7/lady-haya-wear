"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
			// Ici vous ajouteriez la logique de connexion admin
			console.log("Tentative de connexion admin:", formData);

			// Simulation d'une requête
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirection vers le dashboard après connexion réussie
			window.location.href = "/dashboard";
		} catch (err) {
			setError("Identifiants incorrects");
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo et titre */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
						<Lock className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
					<p className="text-gray-600 mt-2">
						Connexion à l'espace d'administration
					</p>
				</div>

				{/* Formulaire de connexion */}
				<Card className="shadow-xl">
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Connexion</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
									<AlertCircle className="h-4 w-4 text-red-600" />
									<span className="text-sm text-red-600">{error}</span>
								</div>
							)}

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Email
								</label>
								<Input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="admin@ladyhaya.com"
									required
									className="w-full"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Mot de passe
								</label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										value={formData.password}
										onChange={handleInputChange}
										placeholder="••••••••"
										required
										className="w-full pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-gray-400" />
										) : (
											<Eye className="h-4 w-4 text-gray-400" />
										)}
									</button>
								</div>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										<span>Connexion...</span>
									</div>
								) : (
									"Se connecter"
								)}
							</Button>
						</form>

						<div className="mt-6 text-center">
							<Link
								href="/"
								className="text-sm text-blue-600 hover:text-blue-500"
							>
								← Retour à la boutique
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Informations de sécurité */}
				<div className="mt-6 text-center">
					<p className="text-xs text-gray-500">
						Accès réservé aux administrateurs autorisés
					</p>
				</div>
			</div>
		</div>
	);
}
