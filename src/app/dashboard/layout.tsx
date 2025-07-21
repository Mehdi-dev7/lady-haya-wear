"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import React, { useState } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

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
					className="fixed inset-0 bg-black bg-opacity-50"
					onClick={toggleSidebar}
				/>
				<div className="fixed left-0 top-0 h-full">
					<Sidebar isCollapsed={false} onToggle={toggleSidebar} />
				</div>
			</div>

			{/* Contenu principal */}
			<div className="flex-1 flex flex-col overflow-hidden h-full">
				{/* Header mobile */}
				<div className="md:hidden bg-white border-b border-gray-200 p-4">
					<button
						onClick={toggleSidebar}
						className="p-2 rounded-md text-nude-dark hover:text-nude-dark-2 hover:bg-rose-light-2"
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
				</div>

				{/* Contenu */}
				<main className="flex-1 overflow-y-auto p-6 h-full">{children}</main>
			</div>
		</div>
	);
}
