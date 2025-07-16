export default function AccountPage() {
	return (
		<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 py-12 min-h-screen flex items-center justify-center bg-beige-light animate-fade-in-up">
			<div className="w-full max-w-2xl bg-white rounded-[30px] shadow-lg border border-nude-dark/30 p-8 md:p-12">
				<h1 className="text-4xl md:text-5xl font-alex-brush text-logo mb-8 text-center">
					Mon compte
				</h1>
				<form className="space-y-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<label className="block text-sm font-medium text-nude-dark mb-1">
								Prénom
							</label>
							<input
								type="text"
								name="firstName"
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
								placeholder="Votre prénom"
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium text-nude-dark mb-1">
								Nom
							</label>
							<input
								type="text"
								name="lastName"
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
								placeholder="Votre nom"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-nude-dark mb-1">
							Email
						</label>
						<input
							type="email"
							name="email"
							className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
							placeholder="Votre email"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-nude-dark mb-1">
							Téléphone
						</label>
						<input
							type="tel"
							name="phone"
							className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
							placeholder="Votre numéro de téléphone"
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-nude-dark mb-1">
								Adresse de facturation
							</label>
							<input
								type="text"
								name="billingAddress"
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
								placeholder="Adresse de facturation"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-nude-dark mb-1">
								Adresse de livraison
							</label>
							<input
								type="text"
								name="shippingAddress"
								className="w-full border border-nude-dark/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nude-dark bg-beige-light text-logo placeholder-nude-dark"
								placeholder="Adresse de livraison"
							/>
						</div>
					</div>
					<div className="pt-4 text-center">
						<button
							type="submit"
							className="bg-logo hover:bg-nude-dark text-white font-semibold px-10 py-3 rounded-full shadow btn-hover transition-all duration-200"
						>
							Sauvegarder
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
