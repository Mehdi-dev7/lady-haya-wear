"use client";

import { motion } from "framer-motion";

interface AnimatedSectionProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}

export default function AnimatedSection({
	children,
	className = "",
	delay = 0,
}: AnimatedSectionProps) {
	return (
		<motion.section
			className={className}
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.8, delay, ease: "easeOut" }}
		>
			{children}
		</motion.section>
	);
}
