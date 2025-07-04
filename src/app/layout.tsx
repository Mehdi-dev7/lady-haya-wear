import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { FavoritesProvider } from "@/lib/FavoritesContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Lady Haya Wear",
	description: "Vêtements pour femmes musulmanes",
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
					{children}
					<Footer />
				</FavoritesProvider>
			</body>
		</html>
	);
}
