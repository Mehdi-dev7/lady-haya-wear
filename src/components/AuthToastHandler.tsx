"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function AuthToastHandler() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const success = urlParams.get("success");
		const error = urlParams.get("error");

		// Gérer les toasts de succès
		if (success === "google_auth") {
			toast.success("Authentification Google réussie !");
			// Nettoyer l'URL
			router.replace("/");
		} else if (success === "facebook_login") {
			toast.success("Authentification Facebook réussie !");
			// Nettoyer l'URL
			router.replace("/");
		}

		// Gérer les toasts d'erreur
		if (error === "google_auth_failed") {
			toast.error("Erreur lors de l'authentification Google");
			// Nettoyer l'URL
			router.replace("/");
		} else if (error === "facebook_auth_failed") {
			toast.error("Erreur lors de l'authentification Facebook");
			// Nettoyer l'URL
			router.replace("/");
		} else if (error === "instagram_auth_failed") {
			toast.error("Erreur lors de l'authentification Instagram");
			// Nettoyer l'URL
			router.replace("/");
		} else if (error === "instagram_code_missing") {
			toast.error("Code d'autorisation Instagram manquant");
			// Nettoyer l'URL
			router.replace("/");
		} else if (error === "instagram_state_invalid") {
			toast.error("Erreur de sécurité lors de l'authentification Instagram");
			// Nettoyer l'URL
			router.replace("/");
		} else if (error === "instagram_callback_failed") {
			toast.error("Erreur lors de l'authentification Instagram");
			// Nettoyer l'URL
			router.replace("/");
		}
	}, [router]);

	return null; // Ce composant ne rend rien
}
