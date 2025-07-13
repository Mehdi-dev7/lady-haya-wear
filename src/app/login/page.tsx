"use client";

import { useState } from "react";

export default function Login() {
	const [isActive, setIsActive] = useState(false);

	const handleRegisterClick = () => {
		setIsActive(true);
	};

	const handleLoginClick = () => {
		setIsActive(false);
	};

	return (
		<>
			<style jsx>{`
				@media screen and (max-width: 650px) {
					.login-container {
						height: calc(100vh - 40px);
					}

					.form-box {
						bottom: 0;
						width: 100%;
						height: 70%;
					}

					.login-container.active .form-box {
						right: 0;
						bottom: 30%;
					}

					.toggle-bg {
						left: 0;
						top: -270%;
						width: 100%;
						height: 300%;
						border-radius: 20vw;
					}

					.login-container.active .toggle-bg {
						left: 0;
						top: 70%;
					}

					.toggle-panel {
						width: 100%;
						height: 30%;
					}

					.toggle-left {
						top: 0;
					}

					.login-container.active .toggle-left {
						left: 0;
						top: -30%;
					}

					.toggle-right {
						right: 0;
						bottom: -30%;
					}

					.login-container.active .toggle-right {
						bottom: 0;
					}
				}

				@media screen and (max-width: 400px) {
					.form-box {
						padding: 20px;
					}

					.toggle-panel h1 {
						font-size: 30px;
					}
				}

				/* Approche simplifiée avec opacity */
				.form-box {
					transition: opacity 0.3s ease-in-out 1.2s !important;
				}

				.form-box.login {
					opacity: 1 !important;
					pointer-events: auto !important;
				}

				.login-container.active .form-box.login {
					opacity: 0 !important;
					transition-delay: 0s !important;
					pointer-events: none !important;
				}

				.form-box.register {
					opacity: 0 !important;
					transition-delay: 0s !important;
					pointer-events: none !important;
				}

				.login-container.active .form-box.register {
					opacity: 1 !important;
					transition-delay: 0.6s !important;
					pointer-events: auto !important;
				}

				.toggle-panel.toggle-left {
					transition: 1.2s ease-in-out !important;
				}

				.login-container.active .toggle-panel.toggle-left {
					transition-delay: 0.2s !important;
				}

				.toggle-panel.toggle-right {
					transition-delay: 0.2s !important;
				}

				.login-container.active .toggle-panel.toggle-right {
					transition-delay: 0.6s !important;
				}

				.toggle-bg {
					transition: 1.2s ease-in-out !important;
				}
			`}</style>
			<section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 bg-rose-light-2 py-16 min-h-screen flex items-center justify-center">
				<div
					className={`login-container relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-lg overflow-hidden ${isActive ? "active" : ""}`}
				>
					{/* Login Form */}
					<div
						className={`form-box login absolute right-0 w-1/2 h-full bg-white flex items-center text-logo text-center p-10 z-10 ${
							isActive ? "right-1/2" : ""
						}`}
					>
						<form onSubmit={(e) => e.preventDefault()} className="w-full">
							<h1 className="text-5xl lg:text-6xl text-logo font-alex-brush -mt-2 mb-2">
								Login
							</h1>
							<div className="relative my-8">
								<input
									type="text"
									placeholder="Username"
									required
									className="w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border border-rose-medium outline-none text-base text-logo font-medium placeholder-nude-dark focus:border-rose-dark-2 focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300"
								/>
								<i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
							</div>
							<div className="relative my-8">
								<input
									type="password"
									placeholder="Password"
									required
									className="w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border border-rose-medium outline-none text-base text-logo font-medium placeholder-nude-dark focus:border-rose-dark-2 focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300"
								/>
								<i className="bx bxs-lock absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
							</div>
							<div className="-mt-4 mb-4">
								<a
									href="#"
									className="text-sm text-nude-dark no-underline hover:text-logo transition-colors duration-300"
								>
									Forgot Password?
								</a>
							</div>
							<button
								type="submit"
								className="w-full h-11 bg-rose-medium rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-rose-dark-2 transition-all duration-300 hover:scale-105"
							>
								Login
							</button>
							<p className="text-sm my-4 text-nude-dark">
								or login with social platforms
							</p>
							<div className="flex justify-center gap-4 mt-5">
								<a
									href="#"
									className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-dark-2 hover:text-white hover:border-rose-dark-2 hover:-translate-y-0.5"
								>
									<i className="bx bxl-google"></i>
								</a>

								<a
									href="#"
									className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-dark-2 hover:text-white hover:border-rose-dark-2 hover:-translate-y-0.5"
								>
									<i className="bx bxl-instagram"></i>
								</a>
							</div>
						</form>
					</div>

					{/* Register Form */}
					<div
						className={`form-box register absolute right-0 w-1/2 h-full bg-white flex items-center text-logo text-center p-10 z-10 ${
							isActive ? "right-1/2" : "right-[-100%]"
						}`}
					>
						<form onSubmit={(e) => e.preventDefault()} className="w-full">
							<h1 className="text-5xl lg:text-6xl text-logo font-alex-brush -mt-2 mb-2">
								Register
							</h1>
							<div className="relative my-8">
								<input
									type="text"
									placeholder="Username"
									required
									className="w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border border-rose-medium outline-none text-base text-logo font-medium placeholder-nude-dark focus:border-rose-dark-2 focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300"
								/>
								<i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
							</div>
							<div className="relative my-8">
								<input
									type="email"
									placeholder="Email"
									required
									className="w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border border-rose-medium outline-none text-base text-logo font-medium placeholder-nude-dark focus:border-rose-dark-2 focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300"
								/>
								<i className="bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
							</div>
							<div className="relative my-8">
								<input
									type="password"
									placeholder="Password"
									required
									className="w-full py-3 px-5 pr-12 bg-rose-light-2 rounded-lg border border-rose-medium outline-none text-base text-logo font-medium placeholder-nude-dark focus:border-rose-dark-2 focus:ring-2 focus:ring-rose-dark-2 focus:ring-opacity-50 transition-all duration-300"
								/>
								<i className="bx bxs-lock absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-nude-dark"></i>
							</div>
							<button
								type="submit"
								className="w-full h-11 bg-rose-medium rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-rose-dark-2 transition-all duration-300 hover:scale-105"
							>
								Register
							</button>
							<p className="text-sm my-4 text-nude-dark">
								or register with social platforms
							</p>
							<div className="flex justify-center gap-4 mt-5">
								<a
									href="#"
									className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-dark-2 hover:text-white hover:border-rose-dark-2 hover:-translate-y-0.5"
								>
									<i className="bx bxl-google"></i>
								</a>

								<a
									href="#"
									className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-dark-2 hover:text-white hover:border-rose-dark-2 hover:-translate-y-0.5"
								>
									<i className="bx bxl-instagram"></i>
								</a>
							</div>
						</form>
					</div>

					{/* Toggle Box */}
					<div className="absolute w-full h-full">
						<div
							className={`toggle-bg absolute w-full h-full bg-rose-dark-2 rounded-[150px] z-20 ${isActive ? "left-1/2" : "-left-[250%]"}`}
						></div>
						<div
							className={`toggle-panel toggle-left absolute w-1/2 h-full bg-rose-dark-2 text-white flex flex-col justify-center items-center z-20 rounded-r-[150px] ${isActive ? "-left-1/2" : "left-0"}`}
						>
							<h1 className="text-4xl font-alex-brush mb-4 text-beige-light">
								Hello, Welcome Back!
							</h1>
							<p className="mb-5 text-beige-light">Don't have an account?</p>
							<button
								className="w-40 h-11 bg-transparent border-2 border-white rounded-lg shadow-none text-beige-light font-semibold hover:bg-white hover:text-rose-dark-2 transition-all duration-300 hover:scale-105 cursor-pointer"
								onClick={handleRegisterClick}
							>
								Register
							</button>
						</div>
						<div
							className={`toggle-panel toggle-right absolute w-1/2 h-full bg-rose-dark-2 text-white flex flex-col justify-center items-center z-20 rounded-l-[150px] ${isActive ? "right-0" : "-right-1/2"}`}
						>
							<h1 className="text-4xl font-alex-brush mb-4 text-beige-light">
								Hello, Friend!
							</h1>
							<p className="mb-5 text-beige-light">Already have an account?</p>
							<button
								className="w-40 h-11 bg-transparent border-2 border-white rounded-lg shadow-none text-beige-light font-semibold hover:bg-white hover:text-rose-dark-2 transition-all duration-300 hover:scale-105 cursor-pointer"
								onClick={handleLoginClick}
							>
								Login
							</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
