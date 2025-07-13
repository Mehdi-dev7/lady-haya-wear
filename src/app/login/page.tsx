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
					transition: opacity 0.3s ease-in-out 0.8s !important;
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
					transition-delay: 0.8s !important;
					pointer-events: auto !important;
				}

				.toggle-panel.toggle-left {
					transition: 1.2s ease-in-out !important;
				}

				.login-container.active .toggle-panel.toggle-left {
					transition-delay: 0.2s !important;
				}

				.toggle-panel.toggle-right {
					transition: 1.2s ease-in-out !important;
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
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
								</a>

								<a
									href="#"
									className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-dark-2 hover:text-white hover:border-rose-dark-2 hover:-translate-y-0.5"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
									>
										<defs>
											<radialGradient
												id="instagram-gradient-login"
												cx="0"
												cy="0"
												r="1"
												gradientUnits="userSpaceOnUse"
												gradientTransform="translate(12 12) scale(12)"
											>
												<stop offset="0%" stopColor="#F58529" />
												<stop offset="35%" stopColor="#E1306C" />
												<stop offset="100%" stopColor="#C13584" />
											</radialGradient>
										</defs>
										<path
											d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
											fill="url(#instagram-gradient-login)"
										/>
									</svg>
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
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
								</a>

								<a
									href="#"
									className="flex items-center justify-center w-11 h-11 border-2 border-rose-medium rounded-lg text-xl text-logo no-underline transition-all duration-300 hover:bg-rose-dark-2 hover:text-white hover:border-rose-dark-2 hover:-translate-y-0.5"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
									>
										<defs>
											<radialGradient
												id="instagram-gradient-register"
												cx="0"
												cy="0"
												r="1"
												gradientUnits="userSpaceOnUse"
												gradientTransform="translate(12 12) scale(12)"
											>
												<stop offset="0%" stopColor="#F58529" />
												<stop offset="35%" stopColor="#E1306C" />
												<stop offset="100%" stopColor="#C13584" />
											</radialGradient>
										</defs>
										<path
											d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
											fill="url(#instagram-gradient-register)"
										/>
									</svg>
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
