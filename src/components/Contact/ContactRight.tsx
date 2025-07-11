import { motion } from "framer-motion";
import { FaEnvelope, FaInstagram, FaSnapchat, FaTwitter } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

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
				<div className="w-48 h-48 bg-nude-light rounded-full flex items-center justify-center shadow-lg">
					<FaEnvelope className="w-24 h-24 text-logo" />
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
			>
				<h3 className="text-3xl font-alex-brush text-logo mb-4 text-center">
					Email
				</h3>
				<div className="flex justify-center mb-8">
					<a
						href="mailto:contact@ladyhaya.fr"
						className="flex items-center gap-3 p-3 bg-nude-dark rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300"
					>
						<FaEnvelope className="text-xl text-white" />
						<span className="text-white font-medium">contact@ladyhaya.fr</span>
					</a>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
			>
				<h3 className="text-3xl font-alex-brush text-logo mb-6 text-center">
					Suivez-nous
				</h3>
				<div className="flex gap-4 justify-center flex-wrap">
					<a
						href="https://twitter.com/ladyhaya"
						target="_blank"
						rel="noopener noreferrer"
						className="p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300"
					>
						<FaTwitter className="text-xl text-white" />
					</a>
					<a
						href="https://instagram.com/ladyhaya"
						target="_blank"
						rel="noopener noreferrer"
						className="p-3 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors duration-300"
					>
						<FaInstagram className="text-xl text-white" />
					</a>
					<a
						href="https://tiktok.com/@ladyhaya"
						target="_blank"
						rel="noopener noreferrer"
						className="p-3 bg-black rounded-full hover:bg-gray-800 transition-colors duration-300"
					>
						<FaTiktok className="text-xl text-white" />
					</a>
					<a
						href="https://snapchat.com/add/ladyhaya"
						target="_blank"
						rel="noopener noreferrer"
						className="p-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors duration-300"
					>
						<FaSnapchat className="text-xl text-white" />
					</a>
				</div>
			</motion.div>
		</div>
	);
}
