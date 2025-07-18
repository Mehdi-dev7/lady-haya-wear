"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
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
	commande: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const searchParams = useSearchParams();
	const commandeParam = searchParams.get("commande") || "";

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
		defaultValues: { commande: commandeParam },
	});

	// Si l'URL change (navigation client), on met à jour le champ commande
	// (utile si la page contact est réutilisée sans rechargement)
	React.useEffect(() => {
		setValue("commande", commandeParam);
	}, [commandeParam, setValue]);

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
					<label className="block text-nude-dark-2 text-lg mb-2 font-balqis">
						Nom & Prénom
					</label>
					<input
						type="text"
						placeholder="Votre nom & prénom"
						required
						autoComplete=""
						className={`h-14 rounded-xl bg-beige-light backdrop-blur-sm px-4 w-full border-2 border-nude-dark ${
							errors.name ? "border-red-400" : "border-nude-light"
						} focus:border-rose-200 focus:outline-none transition-all duration-300 text-lg text-gray-400 [&:-webkit-autofill]:bg-beige-light [&:-webkit-autofill]:text-gray-400 [&:-webkit-autofill]:shadow-[0_0_0_30px_#f5f5dc_inset]`}
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
					)}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ amount: 0.3, once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<label className="block text-nude-dark-2 text-lg mb-2 font-balqis">
						Email
					</label>
					<input
						type="email"
						placeholder="votre.email@exemple.com"
						autoComplete=""
						className={`h-14 rounded-xl bg-beige-light backdrop-blur-sm px-4 w-full border-2 border-nude-dark ${
							errors.email ? "border-red-400" : "border-nude-light"
						} focus:border-rose-200 focus:outline-none transition-all duration-300  text-lg text-gray-400 [&:-webkit-autofill]:bg-beige-light [&:-webkit-autofill]:text-gray-400 [&:-webkit-autofill]:shadow-[0_0_0_30px_#f5f5dc_inset]`}
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
					)}
				</motion.div>

				{/* Champ numéro de commande facultatif */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ amount: 0.3, once: true }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					<label className="block text-nude-dark-2 text-lg mb-2 font-balqis">
						Numéro de commande (facultatif)
					</label>
					<input
						type="text"
						placeholder="Ex : CMD20250701"
						autoComplete="off"
						className="h-14 rounded-xl bg-beige-light backdrop-blur-sm px-4 w-full border-2 border-nude-dark focus:border-rose-200 focus:outline-none transition-all duration-300 text-lg text-gray-400"
						{...register("commande")}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ amount: 0.3, once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<label className="block text-nude-dark-2 text-lg mb-2 font-balqis">
						Message
					</label>
					<textarea
						placeholder="Décrivez votre problème ou posez votre question..."
						rows={8}
						required
						autoComplete="off"
						className={`rounded-xl bg-beige-light backdrop-blur-sm p-4 w-full border-2 border-nude-dark ${
							errors.message ? "border-red-400" : "border-nude-light"
						} focus:border-rose-200 focus:outline-none transition-all duration-300 resize-none text-lg text-gray-400 [&:-webkit-autofill]:bg-beige-light [&:-webkit-autofill]:text-gray-400 [&:-webkit-autofill]:shadow-[0_0_0_30px_#f5f5dc_inset]`}
						{...register("message")}
					/>
					{errors.message && (
						<p className="text-red-500 text-sm mt-2">
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
						className={`w-full mt-8 rounded-xl border-2 border-nude-light bg-nude-dark hover:bg-rose-dark text-nude-light hover:text-nude-dark hover:border-nude-dark duration-300   backdrop-blur-sm h-14 text-lg cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all ${
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
