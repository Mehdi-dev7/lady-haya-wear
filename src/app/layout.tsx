import StudioWrapper from "@/components/StudioWrapper";
import { FavoritesProvider } from "@/lib/FavoritesContext";
import { CartProvider } from "@/lib/CartContext";
import type { Metadata } from "next";
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
				<FavoritesProvider>
					<CartProvider>
						<StudioWrapper>{children}</StudioWrapper>
					</CartProvider>
				</FavoritesProvider>
			</body>
		</html>
	);
}
