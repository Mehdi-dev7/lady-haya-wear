"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

// Schéma de validation avec Zod
const contactSchema = z.object({
	name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
	email: z.string().email("Veuillez entrer une adresse email valide"),
	message: z
		.string()
		.min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
	});

	const onSubmit = async (data: ContactFormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Message envoyé avec succès !");
				reset();
			} else {
				toast.error(
					result.error ||
						"Erreur lors de l'envoi du message. Veuillez réessayer."
				);
			}
		} catch (error) {
			console.error("Erreur lors de l'envoi:", error);
			toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full">
			<motion.form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-6 w-full"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ amount: 0.3, once: true }}
				transition={{ duration: 0.5 }}
			>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ amount: 0.3, once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<label className="block text-nude-dark-2 font-balqis text-lg mb-2">
						Nom ou Société
					</label>
					<input
						type="text"
						placeholder="Votre nom ou le nom de votre société"
						required
						className={`h-14 rounded-xl bg-white/80 backdrop-blur-sm px-4 w-full border-2 ${
							errors.name ? "border-red-400" : "border-nude-light"
						} focus:border-logo focus:outline-none transition-all duration-300 font-balqis text-lg`}
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-2 font-balqis">
							{errors.name.message}
						</p>
					)}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ amount: 0.3, once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<label className="block text-nude-dark-2 font-balqis text-lg mb-2">
						Email
					</label>
					<input
						type="email"
						placeholder="votre.email@exemple.com"
						className={`h-14 rounded-xl bg-white/80 backdrop-blur-sm px-4 w-full border-2 ${
							errors.email ? "border-red-400" : "border-nude-light"
						} focus:border-logo focus:outline-none transition-all duration-300 font-balqis text-lg`}
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-2 font-balqis">
							{errors.email.message}
						</p>
					)}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ amount: 0.3, once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<label className="block text-nude-dark-2 font-balqis text-lg mb-2">
						Message
					</label>
					<textarea
						placeholder="Décrivez votre projet ou posez votre question..."
						rows={8}
						required
						className={`rounded-xl bg-white/80 backdrop-blur-sm p-4 w-full border-2 ${
							errors.message ? "border-red-400" : "border-nude-light"
						} focus:border-logo focus:outline-none transition-all duration-300 resize-none font-balqis text-lg`}
						{...register("message")}
					/>
					{errors.message && (
						<p className="text-red-500 text-sm mt-2 font-balqis">
							{errors.message.message}
						</p>
					)}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ amount: 0.3, once: true }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<button
						type="submit"
						disabled={isSubmitting}
						className={`w-full mt-8 rounded-xl border-2 border-logo hover:bg-logo hover:text-white duration-300 bg-white/80 backdrop-blur-sm h-14 font-balqis text-xl cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all ${
							isSubmitting ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
					</button>
				</motion.div>
			</motion.form>
		</div>
	);
}
