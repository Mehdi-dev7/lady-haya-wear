"use client";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<Loader />}>
			<ResetPasswordContent />
		</Suspense>
	);
}

function ResetPasswordContent() {
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token") || "";

	const validatePassword = (pwd: string) => {
		if (pwd.length < 8)
			return "Le mot de passe doit contenir au moins 8 caractères.";
		if (!/[A-Z]/.test(pwd))
			return "Le mot de passe doit contenir une majuscule.";
		if (!/[0-9]/.test(pwd)) return "Le mot de passe doit contenir un chiffre.";
		return "";
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (!password || !confirm) {
			setError("Veuillez remplir les deux champs.");
			return;
		}
		if (password !== confirm) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}
		const pwdError = validatePassword(password);
		if (pwdError) {
			setError(pwdError);
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, password }),
			});
			const data = await res.json();
			if (!res.ok || data.error) {
				setError(data.error || "Erreur lors de la réinitialisation.");
			} else {
				toast.success("Mot de passe réinitialisé avec succès !");
				router.push("/login");
			}
		} catch (err) {
			setError("Erreur réseau ou serveur.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="min-h-screen flex items-center justify-center bg-beige-light px-4 py-12">
			<form
				onSubmit={handleSubmit}
				className="bg-rose-light-2 rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6"
			>
				<h1 className="text-5xl  text-logo font-alex-brush mb-2 text-center">
					Nouveau mot de passe
				</h1>
				<input
					type="password"
					placeholder="Nouveau mot de passe"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full border border-nude-dark/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
				/>
				<input
					type="password"
					placeholder="Confirmer le mot de passe"
					value={confirm}
					onChange={(e) => setConfirm(e.target.value)}
					className="w-full border border-nude-dark/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9c4b5] bg-beige-light text-logo placeholder-nude-dark"
				/>
				{error && (
					<div className="text-red-500 text-sm text-center">{error}</div>
				)}
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-logo hover:bg-nude-dark text-white font-semibold px-8 py-3 rounded-full shadow btn-hover transition-all duration-200 cursor-pointer"
				>
					{loading ? "Enregistrement..." : "Valider"}
				</button>
			</form>
		</section>
	);
}
