import Image from "next/image";
import Link from "next/link";
import Menu from "../Menu/Menu";
import NavbarIcons from "../Navbar/NavbarIcons";

export default function Navbar() {
	return (
		<div className="h-18 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-42 bg-rose-light">
			{/* Mobile */}
			<div className="flex items-center justify-between h-full lg:hidden">
				<Link href="/" className="flex items-center gap-3">
					<Image
						src="/assets/logo-haya.png"
						alt="Logo"
						width={48}
						height={48}
						className="w-12 h-12"
					/>
					<div className="text-4xl tracking-wide font-alex-brush text-nude-dark-2 font-semibold">
						Lady Haya{" "}
					</div>
				</Link>
				<Menu />
			</div>
			{/* Desktop */}
			<div className="hidden lg:flex items-center h-full relative">
				{/* LEFT - Logo */}
				<Link href="/" className="flex items-center gap-3 absolute left-0">
					<Image
						src="/assets/logo-haya.png"
						alt="Logo"
						width={48}
						height={48}
						className="w-12 h-12"
					/>
					<div className="text-4xl tracking-wide font-alex-brush text-nude-dark-2 font-semibold">
						Lady Haya
					</div>
				</Link>

				{/* CENTER - Navigation (centrée par rapport à l'écran) */}
				<div className="w-full flex justify-center">
					<div className="hidden lg:flex gap-8 lg:gap-6 2xl:gap-12 lg:ml-24 xl:ml-32">
						<Link
							href="/"
							className="relative group text-nude-dark-2 text-lg transition-colors"
						>
							Collections
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-nude-dark-2 text-lg transition-colors"
						>
							Produits
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-nude-dark-2 text-lg transition-colors"
						>
							Contact
							<span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
						<Link
							href="/"
							className="relative group text-nude-dark-2 text-lg transition-colors"
						>
							Qui sommes-nous ?
							<span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-nude-dark group-hover:w-full group-hover:left-0 group-hover:transition-all group-hover:duration-300 group-hover:ease-out transition-all duration-300 ease-in"></span>
						</Link>
					</div>
				</div>

				{/* RIGHT - Icons */}
				<div className="flex items-center justify-between gap-8 absolute right-0">
					<NavbarIcons />
				</div>
			</div>
		</div>
	);
}
