"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();
	const router = useRouter();

	const toggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	// Vérifier l'authentification admin
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch("/api/admin/auth");
				if (response.ok) {
					setIsAuthenticated(true);
				} else {
					// Non authentifié, rediriger vers login
					router.push("/admin-login");
				}
			} catch (error) {
				console.error(
					"Erreur lors de la vérification d'authentification:",
					error
				);
				router.push("/admin-login");
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	// Fermer la sidebar sur mobile lors du changement de route
	useEffect(() => {
		setIsSidebarCollapsed(true);
	}, [pathname]);

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/admin/logout", {
				method: "POST",
			});

			if (response.ok) {
				window.location.href = "/admin-login";
			}
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
		}
	};

	// Afficher le loader pendant la vérification d'authentification
	if (isLoading) {
		return <Loader />;
	}

	// Si pas authentifié, ne rien afficher (redirection en cours)
	if (!isAuthenticated) {
		return <Loader />;
	}

	return (
		<div className="flex h-screen bg-beige-light">
			{/* Sidebar - cachée sur mobile */}
			<div className="hidden md:block">
				<Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
			</div>

			{/* Sidebar mobile - overlay */}
			<div
				className={`
        fixed inset-0 z-50 md:hidden
        ${isSidebarCollapsed ? "hidden" : "block"}
      `}
			>
				<div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm"
					onClick={toggleSidebar}
				/>
				<div className="fixed left-0 top-0 h-full">
					<Sidebar isCollapsed={false} onToggle={toggleSidebar} />
				</div>
			</div>

			{/* Contenu principal */}
			<div className="flex-1 flex flex-col overflow-hidden h-full">
				{/* Header */}
				<div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
					{/* Menu mobile */}
					<button
						onClick={toggleSidebar}
						className="md:hidden p-2 rounded-md text-nude-dark hover:text-nude-dark-2 hover:bg-rose-light-2 cursor-pointer"
					>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 12h18M3 6h18M3 18h18"
							/>
						</svg>
					</button>

					{/* Titre du dashboard */}
					<div className="hidden md:block">
						<h1 className="text-xl font-semibold text-nude-dark">
							Dashboard Admin
						</h1>
					</div>

					{/* Bouton de déconnexion */}
					<Button
						onClick={handleLogout}
						variant="outline"
						size="sm"
						className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
					>
						<LogOut className="h-4 w-4" />
						<span className="hidden sm:inline">Déconnexion</span>
					</Button>
				</div>

				{/* Contenu */}
				<main className="flex-1 overflow-y-auto p-6 h-full">{children}</main>
			</div>
		</div>
	);
}
