import { CheckCircle, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
	message: string;
	type: "success" | "error";
	onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(onClose, 300); // Attendre l'animation de sortie
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
				isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
			}`}
		>
			<div
				className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] ${
					type === "success"
						? "bg-green-500 text-white"
						: "bg-red-500 text-white"
				}`}
			>
				{type === "success" ? (
					<CheckCircle className="h-5 w-5 flex-shrink-0" />
				) : (
					<XCircle className="h-5 w-5 flex-shrink-0" />
				)}
				<span className="flex-1">{message}</span>
				<button
					onClick={() => {
						setIsVisible(false);
						setTimeout(onClose, 300);
					}}
					className="flex-shrink-0 hover:opacity-80 transition-opacity"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
