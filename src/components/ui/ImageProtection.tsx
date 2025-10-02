"use client";

import { useEffect } from "react";

export default function ImageProtection() {
	useEffect(() => {
		// Fonction pour bloquer les raccourcis clavier malveillants
		const handleKeyDown = (e: KeyboardEvent) => {
			// Bloquer F12 (Outils développeur)
			if (e.key === "F12") {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// Bloquer Ctrl+S (Sauvegarder)
			if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// Bloquer Ctrl+A (Tout sélectionner)
			if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// Bloquer Ctrl+C (Copier)
			if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// Bloquer Ctrl+Shift+I (Outils développeur)
			if (e.ctrlKey && e.shiftKey && e.key === "I") {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// Bloquer Ctrl+U (Code source)
			if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// Bloquer Ctrl+P (Imprimer)
			if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		};

		// Fonction pour bloquer le clic droit global
		const handleContextMenu = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			// Si l'élément est une image ou contient une image, bloquer
			if (
				target.tagName === "IMG" ||
				target.closest("img") ||
				target.closest("[data-protected]")
			) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		};

		// Fonction pour bloquer le drag global
		const handleDragStart = (e: DragEvent) => {
			const target = e.target as HTMLElement;

			if (
				target.tagName === "IMG" ||
				target.closest("img") ||
				target.closest("[data-protected]")
			) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		};

		// Fonction pour bloquer la sélection de texte sur les images
		const handleSelectStart = (e: Event) => {
			const target = e.target as HTMLElement;

			if (
				target.tagName === "IMG" ||
				target.closest("img") ||
				target.closest("[data-protected]")
			) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		};

		// Ajouter les event listeners
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("dragstart", handleDragStart);
		document.addEventListener("selectstart", handleSelectStart);

		// Fonction pour désactiver les outils développeur (partiellement)
		const disableDevTools = () => {
			if (
				typeof window !== "undefined" &&
				window.devTools &&
				typeof window.devTools.open === "function"
			) {
				window.devTools.close();
			}
		};

		// Vérifier périodiquement si les outils dev sont ouverts
		const devToolsInterval = setInterval(disableDevTools, 1000);

		// Cleanup
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("dragstart", handleDragStart);
			document.removeEventListener("selectstart", handleSelectStart);
			clearInterval(devToolsInterval);
		};
	}, []);

	// Ce composant ne rend rien, il applique juste la protection
	return null;
}
