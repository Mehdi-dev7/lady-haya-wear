import { motion } from "framer-motion";
import { Suspense } from "react";
import Loader from "../Loader";
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
				<h2 className="text-3xl md:text-4xl font-semibold font-balqis text-logo mb-6">
					Formulaire de contact
				</h2>
				<p className="text-nude-dark text-lg leading-relaxed">
					Remplissez le formulaire ci-dessous et nous vous répondrons dans les
					plus brefs délais.
				</p>
			</motion.div>
			<Suspense fallback={<Loader />}>
				<ContactForm />
			</Suspense>
		</div>
	);
}
