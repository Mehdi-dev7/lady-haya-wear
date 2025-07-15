"use client";

import ContactLeft from "@/components/Contact/ContactLeft";
import ContactRight from "@/components/Contact/ContactRight";
import DebugMigration from "@/components/DebugMigration";
import { motion } from "framer-motion";

export default function Contact() {
	return (
		<section className="bg-beige-light min-h-screen">
			<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-32 pb-16">
				<DebugMigration />
			</div>
			<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-32 pb-16">
				{/* Header avec titre élégant */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-alex-brush text-logo mb-4">
						Contactez-nous
					</h1>
					<p className="text-lg md:text-xl text-nude-dark  max-w-2xl mx-auto">
						Nous sommes là pour vous accompagner dans votre style. N'hésitez pas
						à nous contacter pour toute question.
					</p>
				</motion.div>

				{/* Conteneur principal avec design élégant */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
					className="rounded-3xl shadow-2xl overflow-hidden"
				>

					{/* Contenu principal */}
					<div className="flex flex-col lg:flex-row min-h-[600px]">
						{/* Section gauche - Formulaire */}
						<div className="lg:w-[60%] p-8 lg:p-12 b backdrop-blur-sm bg-[#d9c4b5]/35">
							<ContactLeft />
						</div>

						{/* Section droite - Informations */}
						<div className="lg:w-[40%] p-8 lg:p-12 bg-rose-light-2 backdrop-blur-sm">
							<ContactRight />
						</div>
					</div>
				</motion.div>

				{/* Section supplémentaire avec informations */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
					className="mt-16 text-center"
				>
					<div className="bg-rose-light-2 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
						<h3 className="text-3xl font-alex-brush text-logo mb-4">
							Notre Engagement
						</h3>
						<p className="text-nude-dark leading-relaxed max-w-3xl mx-auto">
							Chez Lady Haya Wear, nous nous engageons à vous offrir une
							expérience personnalisée et des vêtements de qualité qui reflètent
							votre style unique. Notre équipe est dédiée à vous accompagner
							dans chaque étape de votre parcours mode.
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
