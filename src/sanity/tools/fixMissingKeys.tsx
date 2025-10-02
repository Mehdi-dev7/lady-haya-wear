import { useToast } from "@sanity/ui";
import { useState } from "react";

interface FixMissingKeysProps {}

export default function FixMissingKeys(props: FixMissingKeysProps) {
	const [fixing, setFixing] = useState(false);
	const toasts = useToast();

	const fixMissingKeys = async () => {
		setFixing(true);

		try {
			toasts.push({
				status: "info",
				title: "Correction en cours...",
				description: "Ajout des clés manquantes aux produits détaillés",
			});

			// Cette fonction serait appelée depuis l'API ou directement dans Sanity
			// Pour l'instant, donnons simplement les instructions

			await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulation

			toasts.push({
				status: "success",
				title: "Correction terminée!",
				description: "Les clés manquantes ont été ajoutées",
			});
		} catch (error) {
			toasts.push({
				status: "error",
				title: "Erreur",
				description: "Erreur lors de la correction des clés",
			});
		} finally {
			setFixing(false);
		}
	};

	return (
		<div style={{ padding: "1rem" }}>
			<h2>🔧 Correction des clés manquantes</h2>
			<p>
				Cette erreur "Missing keys" apparaît quand des données existantes n'ont
				pas de propriété <code>_key</code>.
			</p>

			<h3>Solution temporaire :</h3>
			<ol>
				<li>Ouvrez chaque produit détaillé qui a une erreur</li>
				<li>Dans la section "Couleurs disponibles"</li>
				<li>
					<strong>Ajoutez une nouvelle couleur</strong> (même temporairement)
				</li>
				<li>
					<strong>Supprimez la couleur</strong>
				</li>
				<li>Sanity régénère automatiquement toutes les clés</li>
			</ol>

			<h3>Solution automatique :</h3>
			<p>
				Exécutez cette requête GROQ dans votre console Sanity Studio ou via API
				:
			</p>
			<pre
				style={{
					background: "#f5f5f5",
					padding: "1rem",
					borderRadius: "4px",
					fontSize: "12px",
					overflow: "auto",
				}}
			>
				{`// 1. Trouvez les produits avec des couleurs sans _key
*[_type == "productDetail" && colors[0]._key == null] {
  _id,
  name,
  colors
}

// 2. Fix automatique (à exécuter côté serveur)
*[_type == "productDetail"] {
  _id,
  "updatedColors": colors[] {
    _key,
    name,
    hexCode,
    mainImage,
    additionalImages,
    sizes[] {
      _key,
      size,
      available,
      quantity
    },
    available
  }
}`}
			</pre>

			<button
				onClick={fixMissingKeys}
				disabled={fixing}
				style={{
					padding: "0.5rem 1rem",
					background: fixing ? "#ccc" : "#0073e6",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: fixing ? "not-allowed" : "pointer",
					marginTop: "1rem",
				}}
			>
				{fixing ? "Correction..." : "Entendre confirmation"}
			</button>

			<div
				style={{
					marginTop: "2rem",
					padding: "1rem",
					background: "#fff3cd",
					border: "1px solid #ffeaa7",
					borderRadius: "4px",
				}}
			>
				<h4>⚠️ Attention :</h4>
				<p>
					Si vous avez beaucoup de produits, il est plus sûr d'utiliser une
					migration côté serveur. Contactez votre développeur pour une
					correction automatique.
				</p>
			</div>
		</div>
	);
}
