"use client";

import { useEffect } from "react";

export default function LightImageProtection() {
	useEffect(() => {
		// Fonction pour bloquer le clic droit uniquement sur les images
		const handleContextMenu = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			// Vérifier si c'est une image ou dans un conteneur protégé
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

		// Fonction pour bloquer le drag sur les images
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

		// Fonction pour bloquer Ctrl+A et Ctrl+C quand la sélection inclut des images
		const handleKeyDown = (e: KeyboardEvent) => {
			// Bloquer Ctrl+A (Tout sélectionner)
			if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
				const selection = window.getSelection();
				if (selection && selection.toString().length > 0) {
					// Si du contenu est déjà sélectionné, vérifier s'il contient des images
					const range = selection.getRangeAt(0);
					const container = range.commonAncestorContainer;
					const element =
						container.nodeType === Node.TEXT_NODE
							? container.parentElement
							: (container as Element);

					if (
						element &&
						(element.tagName === "IMG" ||
							element.querySelector("img") ||
							element.closest("[data-protected]"))
					) {
						e.preventDefault();
						e.stopPropagation();
						return false;
					}
				}
			}

			// Bloquer Ctrl+C (Copier) seulement si du contenu d'image est sélectionné
			if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
				const selection = window.getSelection();
				if (selection && selection.toString().length > 0) {
					const range = selection.getRangeAt(0);
					const container = range.commonAncestorContainer;
					const element =
						container.nodeType === Node.TEXT_NODE
							? container.parentElement
							: (container as Element);

					if (
						element &&
						(element.tagName === "IMG" ||
							element.querySelector("img") ||
							element.closest("[data-protected]"))
					) {
						e.preventDefault();
						e.stopPropagation();
						return false;
					}
				}
			}

			// Bloquer F12 (Outils développeur)
			if (e.key === "F12") {
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
		};

		// Ajouter les event listeners
		document.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("dragstart", handleDragStart);
		document.addEventListener("keydown", handleKeyDown);

		// Cleanup
		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("dragstart", handleDragStart);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return null;
}
