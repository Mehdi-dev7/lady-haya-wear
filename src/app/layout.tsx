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
			<body className="antialiased">
				<AuthProvider>
					<FavoritesProvider>
						<CartProvider>
							<StudioWrapper>{children}</StudioWrapper>
							<ToastContainer
								position="top-right"
								autoClose={5000}
								hideProgressBar={false}
								newestOnTop={false}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								theme="light"
							/>
						</CartProvider>
					</FavoritesProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
