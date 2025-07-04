import Image from "next/image";
import Link from "next/link";
import {
	FaEnvelope,
	FaInstagram,
	FaMapMarkerAlt,
	FaPhone,
	FaTwitter,
	FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-logo text-nude-light">
			{/* Contenu principal du footer */}
			<div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Logo et informations de l'entreprise */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-3 mb-4">
							<Image
								src="/assets/logo-haya.png"
								alt="Logo Lady Haya"
								width={48}
								height={48}
								className="w-12 h-12"
							/>
							<div className="text-2xl lg:text-3xl font-alex-brush font-semibold">
								Lady Haya
							</div>
						</div>
						<p className="text-sm mb-4 leading-relaxed">
							Spécialiste des vêtements élégants pour femmes musulmanes. Nous
							proposons une collection unique d&apos;abayas, kimonos, robes et
							accessoires qui allient tradition et modernité.
						</p>
						<div className="text-xs space-y-1">
							<p>SIRET : 123 456 789 00012</p>
							<p>RCS : Paris B 123 456 789</p>
						</div>
					</div>

					{/* Réseaux sociaux */}
					<div>
						<h3 className="text-lg lg:text-xl font-balqis font-semibold mb-4">
							Suivez-nous
						</h3>
						<div className="flex gap-4">
							<a
								href="https://wa.me/33123456789"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-300"
							>
								<FaWhatsapp className="text-xl" />
							</a>
							<a
								href="https://twitter.com/ladyhaya"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300"
							>
								<FaTwitter className="text-xl" />
							</a>
							<a
								href="https://instagram.com/ladyhaya"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors duration-300"
							>
								<FaInstagram className="text-xl" />
							</a>
						</div>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-lg lg:text-xl font-balqis font-semibold mb-4">
							Contact
						</h3>
						<div className="space-y-3 text-sm">
							<div className="flex items-center gap-3">
								<FaEnvelope className="text-nude-medium" />
								<a
									href="mailto:contact@ladyhaya.fr"
									className="hover:text-nude-medium transition-colors duration-300"
								>
									contact@ladyhaya.fr
								</a>
							</div>
							<div className="flex items-center gap-3">
								<FaPhone className="text-nude-medium" />
								<a
									href="tel:+33123456789"
									className="hover:text-nude-medium transition-colors duration-300"
								>
									+33 1 23 45 67 89
								</a>
							</div>
							<div className="flex items-start gap-3">
								<FaMapMarkerAlt className="text-nude-medium mt-1" />
								<address className="not-italic">
									123 Rue de la Mode
									<br />
									75001 Paris, France
								</address>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Séparateur */}
			<div className="border-t border-nude-medium/30"></div>

			{/* Mentions légales */}
			<div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-6">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="text-sm">
						© 2024 Lady Haya. Tous droits réservés.
					</div>
					<div className="flex gap-6 text-sm">
						<Link
							href="/mentions-legales"
							className="hover:text-nude-medium transition-colors duration-300"
						>
							Mentions légales
						</Link>
						<Link
							href="/politique-confidentialite"
							className="hover:text-nude-medium transition-colors duration-300"
						>
							Politique de confidentialité
						</Link>
						<Link
							href="/conditions-vente"
							className="hover:text-nude-medium transition-colors duration-300"
						>
							Conditions de vente
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
