import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";

export default function ContactInfo() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
			className="flex flex-col gap-6 font-balqis text-nude-dark-2"
		>
			{/* Email avec lien mailto */}
			<div className="flex items-center gap-4 justify-start group">
				<div className="p-3 bg-rose-light/50 rounded-full group-hover:bg-rose-medium transition-colors duration-300">
					<HiOutlineMail className="text-2xl text-logo" />
				</div>
				<a
					href="mailto:contact@ladyhaya-wear.fr"
					target="_blank"
					className="text-lg hover:text-logo transition-all duration-300 hover:underline"
				>
					contact@ladyhaya-wear.fr
				</a>
			</div>

		</motion.div>
	);
}
