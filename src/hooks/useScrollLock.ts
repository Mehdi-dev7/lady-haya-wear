import { useEffect } from "react";

export const useScrollLock = (isLocked: boolean) => {
	useEffect(() => {
		if (isLocked) {
			// Sauvegarder la position actuelle du scroll
			const scrollY = window.scrollY;

			// Appliquer les styles pour bloquer le scroll
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";

			// Fonction de nettoyage
			return () => {
				// Restaurer le scroll
				document.body.style.position = "";
				document.body.style.top = "";
				document.body.style.width = "";
				document.body.style.overflow = "";

				// Restaurer la position du scroll
				window.scrollTo(0, scrollY);
			};
		}
	}, [isLocked]);
};
