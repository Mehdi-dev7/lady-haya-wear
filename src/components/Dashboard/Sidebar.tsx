"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	BarChart3,
	Home,
	Mail,
	Menu,
	Package,
	Palette,
	ShoppingCart,
	Star,
	Ticket,
	UserCheck,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationBadge from "./NotificationBadge";

interface SidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
	const pathname = usePathname();
	const [notifications, setNotifications] = useState({
		orders: 0,
		reviews: 0,
	});

	// Récupérer les notifications
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				// Récupérer les commandes en préparation
				const ordersResponse = await fetch("/api/admin/orders?status=PREPARING");
				const ordersData = await ordersResponse.json();
				const ordersCount = Array.isArray(ordersData) ? ordersData.length : 0;

				// Récupérer les avis en attente
				const reviewsResponse = await fetch("/api/admin/reviews?status=PENDING");
				const reviewsData = await reviewsResponse.json();
				const reviewsCount = Array.isArray(reviewsData) ? reviewsData.length : 0;

				setNotifications({
					orders: ordersCount,
					reviews: reviewsCount,
				});
			} catch (error) {
				console.error("Erreur lors de la récupération des notifications:", error);
			}
		};

		fetchNotifications();
		
		// Actualiser toutes les 30 secondes
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	}, []);

	const navigation = [
		{
			name: "Tableau de bord",
			href: "/dashboard",
			icon: Home,
			current: pathname === "/dashboard",
			badge: null,
		},
		{
			name: "Commandes",
			href: "/dashboard/orders",
			icon: Package,
			current: pathname === "/dashboard/orders",
			badge: notifications.orders,
		},
		{
			name: "Promotions",
			href: "/dashboard/promos",
			icon: Ticket,
			current: pathname === "/dashboard/promos",
			badge: null,
		},
		{
			name: "Newsletter",
			href: "/dashboard/newsletter",
			icon: Mail,
			current: pathname === "/dashboard/newsletter",
			badge: null,
		},
		{
			name: "Avis Clients",
			href: "/dashboard/reviews",
			icon: Star,
			current: pathname === "/dashboard/reviews",
			badge: notifications.reviews,
		},
		{
			name: "Administrateurs",
			href: "/dashboard/admins",
			icon: UserCheck,
			current: pathname === "/dashboard/admins",
			badge: null,
		},
		{
			name: "Studio",
			href: "/studio",
			icon: Palette,
			current: pathname === "/studio",
			badge: null,
		},
	];

	return (
		<div
			className={cn(
				"flex flex-col bg-rose-light-2 border-r border-rose-medium transition-all duration-300 h-full",
				isCollapsed ? "w-20" : "w-64"
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-rose-medium">
				{!isCollapsed && (
					<h2 className="text-lg lg:text-2xl font-semibold text-logo">
						Dashboard
					</h2>
				)}
				<Button
					variant="ghost"
					size="icon"
					onClick={onToggle}
					className={cn(
						"text-nude-dark hover:text-logo hover:bg-rose-light-2 cursor-pointer",
						isCollapsed ? "mx-auto" : "ml-auto"
					)}
				>
					{isCollapsed ? (
						<Menu className="h-7 w-7" />
					) : (
						<X className="h-7 w-7" />
					)}
				</Button>
			</div>

			{/* Stats Quick View */}
			{!isCollapsed && (
				<div className="p-4 space-y-3 border-b border-rose-medium">
					<h3 className="text-sm lg:text-base font-medium text-nude-dark">
						Statistiques rapides
					</h3>
					<div className="space-y-2">
						<div className="flex items-center text-sm">
							<Users
								className={cn(
									"h-4 w-4 lg:h-5 lg:w-5 mr-2 text-nude-dark",
									isCollapsed && "h-8 w-8 mx-auto mr-0"
								)}
							/>
							{!isCollapsed && (
								<span className="text-nude-dark text-sm lg:text-base">
									Utilisateurs
								</span>
							)}
						</div>
						<div className="flex items-center text-sm">
							<ShoppingCart
								className={cn(
									"h-4 w-4 lg:h-5 lg:w-5 mr-2 text-nude-dark",
									isCollapsed && "h-8 w-8 mx-auto mr-0"
								)}
							/>
							{!isCollapsed && (
								<span className="text-nude-dark text-sm lg:text-base">
									Produits
								</span>
							)}
						</div>
						<div className="flex items-center text-sm">
							<BarChart3
								className={cn(
									"h-4 w-4 lg:h-5 lg:w-5 mr-2 text-nude-dark",
									isCollapsed && "h-8 w-8 mx-auto mr-0"
								)}
							/>
							{!isCollapsed && (
								<span className="text-nude-dark text-sm lg:text-base">
									Ventes
								</span>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Navigation */}
			<nav className="flex-1 p-4 space-y-2">
				{navigation.map((item, index) => {
					const Icon = item.icon;
					return (
						<div key={item.name} className="relative">
							{item.name === "Studio" ? (
								<a
									href={item.href}
									target="_blank"
									rel="noopener noreferrer"
									className={cn(
										"flex items-center px-3 py-2 text-sm lg:text-base font-medium rounded-md transition-colors",
										"text-nude-dark hover:bg-rose-medium hover:text-logo"
									)}
								>
									<Icon
										className={cn(
											"h-5 w-5",
											isCollapsed ? "mx-auto h-8 w-8" : "mr-3"
										)}
									/>
									{!isCollapsed && (
										<div className="flex items-center justify-between w-full">
											<span>{item.name}</span>
											{item.badge && <NotificationBadge count={item.badge} />}
										</div>
									)}
								</a>
							) : (
								<Link
									href={item.href}
									className={cn(
										"flex items-center px-3 py-2 text-sm lg:text-base font-medium rounded-md transition-colors",
										item.current
											? "bg-rose-medium text-logo"
											: "text-nude-dark hover:bg-rose-medium hover:text-logo"
									)}
								>
									<Icon
										className={cn(
											"h-5 w-5",
											isCollapsed ? "mx-auto h-8 w-8" : "mr-3"
										)}
									/>
									{!isCollapsed && (
										<div className="flex items-center justify-between w-full">
											<span>{item.name}</span>
											{item.badge && <NotificationBadge count={item.badge} />}
										</div>
									)}
									{isCollapsed && item.badge && (
										<NotificationBadge count={item.badge} className="absolute -top-1 -right-1" />
									)}
								</Link>
							)}
							{/* Trait sous "Administrateurs" */}
							{item.name === "Administrateurs" && !isCollapsed && (
								<div className="border-b border-rose-medium my-2"></div>
							)}
						</div>
					);
				})}
			</nav>
		</div>
	);
};

export default Sidebar;
