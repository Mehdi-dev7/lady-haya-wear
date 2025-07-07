import Footer from "@/components/Footer/Footer";
import Menu from "@/components/Menu/Menu";
import Navbar from "@/components/Navbar/Navbar";
import { FavoritesProvider } from "@/lib/FavoritesContext";
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
					<Navbar />
					<Menu />
					{children}
					<Footer />
				</FavoritesProvider>
			</body>
		</html>
	);
}
