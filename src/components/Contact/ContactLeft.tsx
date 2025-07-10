import { motion } from "framer-motion";
import ContactForm from "./ContactForm";

export default function ContactLeft() {
	return (
		<div className="w-full">
			<motion.div
				className="mb-8"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.3, once: true }}
				transition={{ duration: 0.6 }}
			>
				<h2 className="text-3xl md:text-4xl font-alex-brush text-logo mb-6">
					Obtenir un devis
				</h2>
				<p className="text-nude-dark-2 font-balqis text-lg leading-relaxed">
					Remplissez le formulaire ci-dessous et nous vous répondrons dans les
					plus brefs délais.
				</p>
			</motion.div>
			<ContactForm />
		</div>
	);
}
