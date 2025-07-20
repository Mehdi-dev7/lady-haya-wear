"use client";

import { useAuth } from "@/lib/AuthContext";
import {
	getFieldValidation,
	validateEmail,
	validateLoginPassword,
	validateRegisterForm,
} from "@/lib/validation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaInstagram, FaRegEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

export default function Login() {
	const [isActive, setIsActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");

	// États pour l'affichage des mots de passe
	const [showLoginPassword, setShowLoginPassword] = useState(false);
	const [showRegisterPassword, setShowRegisterPassword] = useState(false);

	// États pour gérer les champs touchés (pour afficher les erreurs seulement après interaction)
	const [touchedFields, setTouchedFields] = useState<{
		[key: string]: boolean;
	}>({});

	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";
	const { login } = useAuth();

	// Données du formulaire de connexion
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	// Données du formulaire d'inscription
	const [registerData, setRegisterData] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
	});

	// Erreurs de validation
	const [validationErrors, setValidationErrors] = useState<{
		[key: string]: string;
	}>({});

	// Validation en temps réel
	const handleFieldValidation = (fieldName: string, value: string) => {
		let validation;

		// Utiliser la validation appropriée selon le contexte
		if (fieldName === "password" || fieldName === "registerPassword") {
			// Validation complète pour l'inscription, simple pour la connexion
			if (fieldName === "registerPassword") {
				validation = getFieldValidation("password", value); // Utiliser la validation complète
			} else {
				validation = validateLoginPassword(value); // Validation simple pour connexion
			}
		} else {
			// Validation normale pour les autres champs
			validation = getFieldValidation(fieldName, value);
		}

		const newErrors = {
			...validationErrors,
			[fieldName]: validation.isValid ? "" : validation.message,
		};
		setValidationErrors(newErrors);

		// Retourner si le champ est valide pour la validation globale
		return validation.isValid;
	};

	// Gestion des changements de champs avec validation immédiate
	const handleFieldChange = (fieldName: string, value: string) => {
		// Mettre à jour les données
		if (fieldName === "email") {
			setLoginData({ ...loginData, email: value });
		} else if (fieldName === "password") {
			setLoginData({ ...loginData, password: value });
		} else if (fieldName === "firstName") {
			setRegisterData({ ...registerData, firstName: value });
		} else if (fieldName === "lastName") {
			setRegisterData({ ...registerData, lastName: value });
		} else if (fieldName === "registerEmail") {
			setRegisterData({ ...registerData, email: value });
		} else if (fieldName === "registerPassword") {
			setRegisterData({ ...registerData, password: value });
		}

		// Marquer le champ comme touché dès qu'on commence à taper
		setTouchedFields((prev) => ({
			...prev,
			[fieldName]: true,
		}));

		// Validation immédiate
		handleFieldValidation(fieldName, value);
	};

	useEffect(() => {
		// Gérer les messages d'erreur et de succès de l'URL
		const error = searchParams.get("error");
		const success = searchParams.get("success");

		if (error) {
			switch (error) {
				case "token_missing":
					toast.error("Token de vérification manquant");
					break;
				case "token_invalid":
					toast.error("Token de vérification invalide");
					break;
				case "token_expired":
					toast.error("Token de vérification expiré");
					break;
				case "server_error":
					toast.error("Erreur serveur");
					break;
				case "google_auth_failed":
					toast.error("Erreur lors de l'authentification Google");
					break;
				default:
					toast.error("Erreur lors de la connexion");
			}
		}

		if (success) {
			switch (success) {
				case "email_verified":
					toast.success(
						"Email vérifié avec succès ! Vous pouvez maintenant vous connecter."
					);
					break;
			}
		}
	}, [searchParams]);

	const handleRegisterClick = () => {
		setIsActive(true);
	};

	const handleLoginClick = () => {
		setIsActive(false);
	};

	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validation côté client pour la connexion
		const emailValidation = validateEmail(loginData.email);
		if (!emailValidation.isValid) {
			toast.error(emailValidation.message);
			setIsLoading(false);
			return;
		}

		try {
			const result = await login(loginData.email, loginData.password);

			if (result.success) {
				toast.success("Connexion réussie !");
				router.push(callbackUrl);
			} else {
				toast.error(result.error || "Erreur lors de la connexion");
			}
		} catch (error) {
			toast.error("Erreur lors de la connexion");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegisterSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation côté client AVANT soumission
		const validation = validateRegisterForm(registerData);
		if (!validation.isValid) {
			setValidationErrors(validation.errors);

			// Afficher TOUTES les erreurs dans le toast
			const errorMessages = Object.values(validation.errors).filter(
				(msg) => msg !== ""
			);
			if (errorMessages.length > 0) {
				toast.error(`Erreurs à corriger : ${errorMessages.join(", ")}`);
			}
			return; // Bloquer la soumission
		}

		// Vérifier qu'il n'y a plus d'erreurs de validation
		if (
			Object.keys(validationErrors).some((key) => validationErrors[key] !== "")
		) {
			toast.error("Veuillez corriger les erreurs avant de continuer");
			return; // Bloquer la soumission
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registerData),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success(
					"Inscription réussie ! Vérifiez votre email pour activer votre compte."
				);
				setRegisterData({
					email: "",
					password: "",
					firstName: "",
					lastName: "",
				});
				setValidationErrors({});
				setIsActive(false);
			} else {
				toast.error(data.error || "Erreur lors de l'inscription");
			}
		} catch (error) {
			toast.error("Erreur lors de l'inscription");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialLogin = async (provider: string) => {
		if (provider === "google") {
			// Rediriger vers l'authentification Google
			window.location.href = "/api/auth/google";
		} else {
			toast.info("Connexion sociale temporairement indisponible");
		}
	};

	// Handler pour la demande de reset password
	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!forgotEmail || !validateEmail(forgotEmail).isValid) {
			toast.error("Veuillez entrer un email valide");
			return;
		}
		setIsLoading(true);
		try {
			await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: forgotEmail }),
			});
			toast.success(
				"Si un compte existe, un email de réinitialisation a été envoyé."
			);
			setShowForgotPassword(false);
			setForgotEmail("");
		} catch (err) {
			toast.error("Erreur lors de la demande de réinitialisation");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<style jsx>{`
				.error-message {
					color: #dc2626;
					font-size: 0.875rem;
					margin-top: 0.5rem;
					font-weight: 500;
					text-align: left;
					animation: fadeIn 0.3s ease-in;
				}

				.input-error {
					border-color: #dc2626 !important;
					box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(-5px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@media screen and (max-width: 650px) {
					.login-section {
						margin-top: 2rem;
						min-height: 95vh;
					}

					.login-container {
						height: calc(95vh - 40px);
						max-height: 700px;
					}

					.form-box {
						bottom: 0;
						width: 100%;
						height: 75%;
					}

					.login-container.active .form-box {
						right: 0;
						bottom: 25%;
					}

					.toggle-bg {
						left: 0;
						top: -270%;
						width: 100%;
						height: 300%;
						border-radius: 20vw;
					}

					.toggle-panel {
						border-radius: 150px !important;
					}

					.form-box .relative {
						margin-top: 1rem;
						margin-bottom: 1rem;
					}

					.form-box h1 {
						margin-bottom: 1rem;
					}

					.form-box div:has(.forgot-password) {
						margin-top: -1rem !important;
						margin-bottom: 0.5rem !important;
					}

					.form-box button[type="submit"] {
						margin-bottom: 0.5rem !important;
					}

					.form-box .flex.justify-center {
						margin-top: 0.5rem !important;
					}

					.login-container.active .toggle-bg {
						left: 0;
						top: 70%;
					}

					.toggle-panel {
						width: 100%;
						height: 25%;
					}

					.toggle-left {
						top: 0;
					}

					.login-container.active .toggle-left {
						left: 0;
						top: -25%;
					}

					.toggle-right {
						right: 0;
						bottom: -25%;
					}

					.login-container.active .toggle-right {
						bottom: 0;
					}
				}

				@media screen and (max-width: 400px) {
					.form-box {
						padding: 20px 20px 10px 20px;
					}

					.toggle-panel h1 {
						font-size: 30px;
					}
				}

				/* Approche simplifiée avec opacity */
				.form-box {
					transition: opacity 0.3s ease-in-out 0.8s !important;
				}

				.form-box.login {
					opacity: 1 !important;
					pointer-events: auto !important;
				}

				.login-container.active .form-box.login {
					opacity: 0 !important;
					transition-delay: 0s !important;
					pointer-events: none !important;
				}

				.form-box.register {
					opacity: 0 !important;
					transition-delay: 0s !important;
					pointer-events: none !important;
				}

				.login-container.active .form-box.register {
					opacity: 1 !important;
					transition-delay: 1s !important;
					pointer-events: auto !important;
				}

				.toggle-panel.toggle-left {
					transition: 1.2s ease-in-out !important;
				}

				.login-container.active .toggle-panel.toggle-left {
					transition-delay: 0.2s !important;
				}

				.toggle-panel.toggle-right {
					transition: 1.2s ease-in-out !important;
					transition-delay: 0.2s !important;
				}

				.login-container.active .toggle-panel.toggle-right {
					transition-delay: 0.3s !important;
				}

				.toggle-bg {
					transition: 1.2s ease-in-out !important;
				}

				/* Styles pour les messages d'erreur */
				.error-message {
					color: #dc2626;
					font-size: 0.75rem;
					margin-top: 0.125rem;
					line-height: 1.2;
				}

				.input-error {
					border-color: #dc2626 !important;
				}

				.input-valid {
					border-color: #059669 !important;
				}
			`}</style>
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-16 min-h-screen flex items-center justify-center login-section bg-[#fae4e4]/75">
				<div
					className={`login-container relative w-[850px] h-[550px] bg-beige-light rounded-[30px] shadow-lg overflow-hidden ${isActive ? "active" : ""}`}
				>
					{/* Login Form */}
					<div
						className={`form-box login absolute right-0 w-1/2 h-full bg-beige-light flex items-center text-logo text-center p-10 z-10 ${
							isActive ? "right-1/2" : ""
						}`}
					>
						{!showForgotPassword ? (
							<form onSubmit={handleLoginSubmit} className="w-full">
								<h1 className="text-5xl lg:text-6xl text-logo font-alex-brush lg:-mt-2 mb-2">
									Connexion
								</h1>
								<div className="relative my-8">
									<input
										type="email"
										placeholder="Email"
										value={loginData.email}
										onChange={(e) => {
											handleFieldChange("email", e.target.value);
										}}
										required
										className={`w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border outline-none text-base text-logo font-medium placeholder-nude-dark focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300 ${
											validationErrors.email && touchedFields.email
												? "input-error border-red-500"
												: "border-rose-medium focus:border-rose-dark-2"
										}`}
									/>
									<i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
									{validationErrors.email && touchedFields.email && (
										<p className="error-message">⚠️ {validationErrors.email}</p>
									)}
								</div>
								<div className="relative my-8">
									<div className="relative">
										<input
											type={showLoginPassword ? "text" : "password"}
											placeholder="Mot de passe"
											value={loginData.password}
											onChange={(e) => {
												handleFieldChange("password", e.target.value);
											}}
											required
											className={`w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border outline-none text-base text-logo font-medium placeholder-nude-dark focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300 ${
												validationErrors.password && touchedFields.password
													? "input-error border-red-500"
													: "border-rose-medium focus:border-rose-dark-2"
											}`}
										/>
										<button
											type="button"
											onClick={() => setShowLoginPassword(!showLoginPassword)}
											className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark hover:text-logo transition-colors duration-300 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
										>
											{showLoginPassword ? <FaRegEyeSlash /> : <IoEyeSharp />}
										</button>
									</div>
									{validationErrors.password && touchedFields.password && (
										<p className="error-message">
											⚠️ {validationErrors.password}
										</p>
									)}
								</div>
								<div className="-mt-4 mb-4">
									<button
										type="button"
										className="text-sm text-nude-dark no-underline hover:text-logo transition-colors duration-300 forgot-password bg-transparent border-none p-0 cursor-pointer"
										onClick={() => setShowForgotPassword(true)}
									>
										Mot de passe oublié ?
									</button>
								</div>
								<button
									type="submit"
									disabled={
										isLoading ||
										(validationErrors.email !== "" && touchedFields.email) ||
										(validationErrors.password !== "" && touchedFields.password)
									}
									className="w-full h-11 bg-rose-medium rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-rose-dark-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? "Connexion..." : "Se connecter"}
								</button>
								<p className="text-sm my-4 text-nude-dark">
									ou se connecter avec
								</p>
								<div className="flex justify-center gap-4 mt-5">
									<button
										type="button"
										onClick={() => handleSocialLogin("google")}
										disabled={isLoading}
										className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-light-2 hover:text-logo hover:border-rose-light-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
										>
											<path
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
												fill="#4285F4"
											/>
											<path
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
												fill="#34A853"
											/>
											<path
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
												fill="#FBBC05"
											/>
											<path
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
												fill="#EA4335"
											/>
										</svg>
									</button>
									<button
										type="button"
										onClick={() =>
											toast.info("Connexion Instagram bientôt disponible")
										}
										disabled={isLoading}
										className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-light-2 hover:text-logo hover:border-rose-light-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										<FaInstagram />
									</button>
								</div>
							</form>
						) : (
							<form onSubmit={handleForgotPassword} className="w-full">
								<h1 className="text-3xl lg:text-4xl text-logo font-alex-brush mb-4">
									Réinitialiser le mot de passe
								</h1>
								<div className="relative my-8">
									<input
										type="email"
										placeholder="Votre email"
										value={forgotEmail}
										onChange={(e) => setForgotEmail(e.target.value)}
										required
										className="w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border border-rose-medium outline-none text-base text-logo font-medium placeholder-nude-dark focus:border-rose-dark-2 focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300"
									/>
									<i className="bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
								</div>
								<button
									type="submit"
									disabled={isLoading}
									className="w-full h-11 bg-rose-medium rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-rose-dark-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading
										? "Envoi..."
										: "Envoyer le lien de réinitialisation"}
								</button>
								<button
									type="button"
									className="w-full mt-4 h-11 bg-transparent border-2 border-rose-medium rounded-lg text-rose-medium font-semibold hover:bg-rose-light-2 transition-all duration-300 hover:scale-105 cursor-pointer"
									onClick={() => setShowForgotPassword(false)}
								>
									Retour à la connexion
								</button>
							</form>
						)}
					</div>

					{/* Register Form */}
					<div
						className={`form-box register absolute right-0 w-1/2 h-full bg-beige-light flex items-center text-logo text-center p-10 z-10 ${
							isActive ? "right-1/2" : "right-[-100%]"
						}`}
					>
						<form onSubmit={handleRegisterSubmit} className="w-full">
							<h1 className="text-5xl lg:text-6xl text-logo font-alex-brush -mt-2 mb-2">
								S'inscrire
							</h1>
							<div className="relative my-6">
								<input
									type="text"
									placeholder="Prénom"
									value={registerData.firstName}
									onChange={(e) => {
										handleFieldChange("firstName", e.target.value);
									}}
									className={`w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border outline-none text-base text-logo font-medium placeholder-nude-dark focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300 ${
										validationErrors.firstName && touchedFields.firstName
											? "input-error border-red-500"
											: "border-rose-medium focus:border-rose-dark-2"
									}`}
								/>
								<i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
								{validationErrors.firstName && touchedFields.firstName && (
									<p className="error-message">
										⚠️ {validationErrors.firstName}
									</p>
								)}
							</div>
							<div className="relative my-6">
								<input
									type="text"
									placeholder="Nom"
									value={registerData.lastName}
									onChange={(e) => {
										handleFieldChange("lastName", e.target.value);
									}}
									className={`w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border outline-none text-base text-logo font-medium placeholder-nude-dark focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300 ${
										validationErrors.lastName && touchedFields.lastName
											? "input-error border-red-500"
											: "border-rose-medium focus:border-rose-dark-2"
									}`}
								/>
								<i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
								{validationErrors.lastName && touchedFields.lastName && (
									<p className="error-message">
										⚠️ {validationErrors.lastName}
									</p>
								)}
							</div>
							<div className="relative my-6">
								<input
									type="email"
									placeholder="Email"
									value={registerData.email}
									onChange={(e) => {
										handleFieldChange("registerEmail", e.target.value);
									}}
									required
									className={`w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border outline-none text-base text-logo font-medium placeholder-nude-dark focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300 ${
										validationErrors.email && touchedFields.registerEmail
											? "input-error border-red-500"
											: "border-rose-medium focus:border-rose-dark-2"
									}`}
								/>
								<i className="bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
								{validationErrors.email && touchedFields.registerEmail && (
									<p className="error-message">⚠️ {validationErrors.email}</p>
								)}
							</div>
							<div className="relative my-6">
								<div className="relative">
									<input
										type={showRegisterPassword ? "text" : "password"}
										placeholder="Mot de passe"
										value={registerData.password}
										onChange={(e) => {
											handleFieldChange("registerPassword", e.target.value);
										}}
										required
										minLength={8}
										className={`w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border outline-none text-base text-logo font-medium placeholder-nude-dark focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300 ${
											validationErrors.registerPassword &&
											touchedFields.registerPassword
												? "input-error border-red-500"
												: "border-rose-medium focus:border-rose-dark-2"
										}`}
									/>
									<button
										type="button"
										onClick={() =>
											setShowRegisterPassword(!showRegisterPassword)
										}
										className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark hover:text-logo transition-colors duration-300 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
									>
										{showRegisterPassword ? <FaRegEyeSlash /> : <IoEyeSharp />}
									</button>
								</div>
								{validationErrors.registerPassword &&
									touchedFields.registerPassword && (
										<p className="error-message">
											⚠️ {validationErrors.registerPassword}
										</p>
									)}
							</div>
							<button
								type="submit"
								disabled={
									isLoading ||
									Object.keys(validationErrors).some(
										(key) => validationErrors[key] !== "" && touchedFields[key]
									)
								}
								className="w-full h-11 bg-rose-medium rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-rose-dark-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? "Inscription..." : "S'inscrire"}
							</button>
						</form>
					</div>

					{/* Toggle Box */}
					<div className="absolute w-full h-full">
						<div
							className={`toggle-bg absolute w-full h-full bg-rose-dark-2 rounded-[150px] z-20 ${isActive ? "left-1/2" : "-left-[250%]"}`}
						></div>
						<div
							className={`toggle-panel toggle-left absolute w-1/2 h-full bg-rose-dark-2 text-white flex flex-col justify-center items-center z-20 rounded-r-[150px] ${isActive ? "-left-1/2" : "left-0"}`}
						>
							<h1 className="text-4xl font-alex-brush mb-4 text-beige-light">
								Marhaban !
							</h1>
							<p className="mb-5 text-beige-light">
								Vous n'avez pas de compte ?
							</p>
							<button
								className="w-40 h-11 bg-transparent border-2 border-white rounded-lg shadow-none text-beige-light font-semibold hover:bg-white hover:text-rose-dark-2 transition-all duration-300 hover:scale-105 cursor-pointer"
								onClick={handleRegisterClick}
							>
								S'inscrire
							</button>
						</div>
						<div
							className={`toggle-panel toggle-right absolute w-1/2 h-full bg-rose-dark-2 text-white flex flex-col justify-center items-center z-20 rounded-l-[150px] ${isActive ? "right-0" : "-right-1/2"}`}
						>
							<h1 className="text-4xl font-alex-brush mb-4 text-beige-light">
								Assalam Alaykoum !
							</h1>
							<p className="mb-5 text-beige-light">
								Vous avez déjà un compte ?
							</p>
							<button
								className="w-40 h-11 bg-transparent border-2 border-white rounded-lg shadow-none text-beige-light font-semibold hover:bg-white hover:text-rose-dark-2 transition-all duration-300 hover:scale-105 cursor-pointer"
								onClick={handleLoginClick}
							>
								Se connecter
							</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
