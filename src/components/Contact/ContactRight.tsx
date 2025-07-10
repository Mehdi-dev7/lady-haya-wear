import { motion } from "framer-motion";
import ContactInfo from "./ContactInfo";

export default function ContactRight() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 w-full">
			<motion.div
				initial={{ opacity: 0, y: -30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
				className="mb-8"
			>
				<div className="w-48 h-48 bg-gradient-to-br from-rose-light/30 to-nude-light/30 rounded-full flex items-center justify-center shadow-lg">
					<svg
						className="w-24 h-24 text-logo"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
					</svg>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
			>
				<h3 className="text-2xl font-alex-brush text-logo mb-6 text-center">
					Nos Coordonnées
				</h3>
				<ContactInfo />
			</motion.div>
		</div>
	);
}
