import { CSRFProtection } from "@/components/Security/CSRFProtection";
import StudioWrapper from "@/components/StudioWrapper";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { FavoritesProvider } from "@/lib/FavoritesContext";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
	title: "Lady Haya Wear",
	description: "Vêtements pour femmes musulmanes",
	icons: {
		icon: "/icon.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1"
				/>
			</head>
			<body className="antialiased">
				<CSRFProtection>
					<CartProvider>
						<FavoritesProvider>
							<AuthProvider>
								<StudioWrapper>{children}</StudioWrapper>

								<ToastContainer
									position="top-right"
									autoClose={3000}
									hideProgressBar={false}
									newestOnTop={false}
									closeOnClick
									rtl={false}
									pauseOnFocusLoss
									draggable
									pauseOnHover
									theme="light"
									toastClassName="!z-[99999] !fixed !top-4 !right-4 md:!top-4 md:!right-4"
									toastStyle={{
										zIndex: 99999,
										position: "fixed",
										top: "1rem",
										right: "1rem",
									}}
								/>
							</AuthProvider>
						</FavoritesProvider>
					</CartProvider>
				</CSRFProtection>
			</body>
		</html>
	);
}
