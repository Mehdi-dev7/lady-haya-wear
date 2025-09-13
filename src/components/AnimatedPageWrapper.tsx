"use client";

import { motion } from "framer-motion";

interface AnimatedPageWrapperProps {
	children: React.ReactNode;
}

export default function AnimatedPageWrapper({
	children,
}: AnimatedPageWrapperProps) {
	return (
		<motion.div
			className="w-full"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			{children}
		</motion.div>
	);
}
