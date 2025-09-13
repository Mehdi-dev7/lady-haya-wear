import { motion } from "framer-motion";

// Animations de base réutilisables
export const fadeInUp = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.8, ease: "easeOut" }
};

export const fadeInDown = {
	initial: { opacity: 0, y: -50 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.8, ease: "easeOut" }
};

export const fadeInLeft = {
	initial: { opacity: 0, x: -50 },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.8, ease: "easeOut" }
};

export const fadeInRight = {
	initial: { opacity: 0, x: 50 },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.8, ease: "easeOut" }
};

export const scaleIn = {
	initial: { opacity: 0, scale: 0.8 },
	animate: { opacity: 1, scale: 1 },
	transition: { duration: 0.6, ease: "easeOut" }
};

export const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1
		}
	}
};

export const staggerItem = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" }
};

// Animations au scroll
export const scrollAnimation = {
	initial: { opacity: 0, y: 50 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.3 },
	transition: { duration: 0.8, ease: "easeOut" }
};

export const scrollAnimationLeft = {
	initial: { opacity: 0, x: -50 },
	whileInView: { opacity: 1, x: 0 },
	viewport: { once: true, amount: 0.3 },
	transition: { duration: 0.8, ease: "easeOut" }
};

export const scrollAnimationRight = {
	initial: { opacity: 0, x: 50 },
	whileInView: { opacity: 1, x: 0 },
	viewport: { once: true, amount: 0.3 },
	transition: { duration: 0.8, ease: "easeOut" }
};

// Animations d'interaction
export const hoverScale = {
	whileHover: { scale: 1.05 },
	whileTap: { scale: 0.95 },
	transition: { duration: 0.2 }
};

export const hoverLift = {
	whileHover: { y: -5 },
	transition: { duration: 0.2 }
};

export const hoverRotate = {
	whileHover: { rotate: 5 },
	transition: { duration: 0.2 }
};

// Composants animés prêts à l'emploi
export const AnimatedDiv = ({ children, className = "", ...props }: any) => (
	<motion.div className={className} {...scrollAnimation} {...props}>
		{children}
	</motion.div>
);

export const AnimatedSection = ({ children, className = "", ...props }: any) => (
	<motion.section className={className} {...scrollAnimation} {...props}>
		{children}
	</motion.section>
);

export const AnimatedH1 = ({ children, className = "", ...props }: any) => (
	<motion.h1 
		className={className} 
		initial={{ opacity: 0, y: 30 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.8, ease: "easeOut" }}
		{...props}
	>
		{children}
	</motion.h1>
);

export const AnimatedH2 = ({ children, className = "", ...props }: any) => (
	<motion.h2 
		className={className} 
		initial={{ opacity: 0, y: 30 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
		{...props}
	>
		{children}
	</motion.h2>
);

export const AnimatedP = ({ children, className = "", ...props }: any) => (
	<motion.p 
		className={className} 
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
		{...props}
	>
		{children}
	</motion.p>
);

// Animation pour les listes avec stagger
export const StaggerList = ({ children, className = "", ...props }: any) => (
	<motion.div 
		className={className} 
		variants={staggerContainer}
		initial="initial"
		animate="animate"
		{...props}
	>
		{children}
	</motion.div>
);

export const StaggerItem = ({ children, className = "", ...props }: any) => (
	<motion.div 
		className={className} 
		variants={staggerItem}
		{...props}
	>
		{children}
	</motion.div>
);
