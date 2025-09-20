"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Star, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	FaCheck,
	FaChevronDown,
	FaFilter,
	FaSearch,
	FaStar,
	FaTimes,
	FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Review {
	id: string;
	rating: number;
	comment: string;
	customerName: string;
	customerEmail: string;
	productName: string;
	productId: string;
	status: "PENDING" | "APPROVED" | "REJECTED";
	emailSentAt: string | null;
	submittedAt: string | null;
	reviewedAt: string | null;
	createdAt: string;
	order: {
		orderNumber: string;
		createdAt: string;
	};
	user: {
		id: string;
		email: string;
	};
}

interface Stats {
	status: Record<string, number>;
	ratings: Record<number, number>;
}

interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export default function ReviewsManagementPage() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [stats, setStats] = useState<Stats>({ status: {}, ratings: {} });
	const [pagination, setPagination] = useState<Pagination>({
		page: 1,
		limit: 20,
		total: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [updatingReview, setUpdatingReview] = useState<string | null>(null);
	const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
	const statusMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchReviews();
	}, [selectedStatus, searchTerm, pagination.page]);

	// Fermeture du menu de statut au clic extérieur
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				statusMenuRef.current &&
				!statusMenuRef.current.contains(event.target as Node)
			) {
				setIsStatusMenuOpen(false);
			}
		};

		if (isStatusMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isStatusMenuOpen]);

	const fetchReviews = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
			});

			if (selectedStatus !== "all") {
				params.append("status", selectedStatus);
				// Pour les reviews PENDING, ne montrer que ceux soumis par les clients
				if (selectedStatus === "PENDING") {
					params.append("submitted", "true");
				}
			}

			if (searchTerm) {
				params.append("search", searchTerm);
			}

			const response = await fetch(`/api/admin/reviews?${params}`);
			const data = await response.json();

			if (response.ok) {
				setReviews(data.reviews);
				setStats(data.stats);
				setPagination(data.pagination);
			} else {
				console.error("Erreur:", data.error);
			}
		} catch (error) {
			console.error("Erreur lors du chargement:", error);
			toast.error("Erreur lors du chargement des avis");
		} finally {
			setLoading(false);
		}
	};

	const handleStatusUpdate = async (reviewId: string, newStatus: string) => {
		setUpdatingReview(reviewId);
		try {
			const response = await fetch(`/api/admin/reviews/${reviewId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: newStatus }),
			});

			const data = await response.json();

			if (response.ok) {
				// Mettre à jour l'état local
				setReviews((prev) =>
					prev.map((review) =>
						review.id === reviewId
							? {
									...review,
									status: newStatus as any,
									reviewedAt: new Date().toISOString(),
								}
							: review
					)
				);

				// Message de succès
				const statusLabel = newStatus === "APPROVED" ? "approuvé" : "rejeté";
				toast.success(`Avis ${statusLabel} avec succès !`);

				// Recharger les stats
				fetchReviews();
			} else {
				console.error("Erreur:", data.error);
				toast.error("Erreur lors de la mise à jour de l'avis");
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la mise à jour de l'avis");
		} finally {
			setUpdatingReview(null);
		}
	};

	const handleDelete = async (reviewId: string) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/reviews/${reviewId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setReviews((prev) => prev.filter((review) => review.id !== reviewId));
				toast.success("Avis supprimé avec succès !");
				fetchReviews(); // Recharger pour mettre à jour les stats
			} else {
				const data = await response.json();
				console.error("Erreur:", data.error);
				toast.error("Erreur lors de la suppression de l'avis");
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la suppression de l'avis");
		}
	};

	const getStatusLabel = (status: string) => {
		const labels = {
			all: "Tous les statuts",
			PENDING: "En attente",
			APPROVED: "Approuvés",
			REJECTED: "Rejetés",
		};
		return labels[status as keyof typeof labels] || status;
	};

	const getStatusBadge = (status: string) => {
		const styles = {
			PENDING: "bg-yellow-100 text-yellow-800",
			APPROVED: "bg-green-100 text-green-800",
			REJECTED: "bg-red-100 text-red-800",
		};

		const labels = {
			PENDING: "En attente",
			APPROVED: "Approuvé",
			REJECTED: "Rejeté",
		};

		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}
			>
				{labels[status as keyof typeof labels]}
			</span>
		);
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<svg
				key={i}
				className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		));
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="w-full max-w-full overflow-hidden">
			{/* En-tête */}
			<div className="mb-6 lg:mb-8">
				<h1 className="text-2xl lg:text-3xl font-bold text-nude-dark-2 mb-2">
					Gestion des Avis Clients
				</h1>
				<p className="text-nude-dark text-sm lg:text-base">
					Modérez les avis clients avant leur publication
				</p>
			</div>

			{/* Statistiques */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
				<Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
					<CardContent className="p-4 lg:p-6">
						<div className="flex items-center">
							<div className="p-2 lg:p-3 bg-yellow-200 rounded-xl">
								<Clock className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-700" />
							</div>
							<div className="ml-3 lg:ml-4">
								<p className="text-xs lg:text-sm font-medium text-yellow-700">
									En attente
								</p>
								<p className="text-lg lg:text-2xl font-bold text-yellow-800">
									{stats.status.PENDING || 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
					<CardContent className="p-4 lg:p-6">
						<div className="flex items-center">
							<div className="p-2 lg:p-3 bg-green-200 rounded-xl">
								<CheckCircle className="w-4 h-4 lg:w-6 lg:h-6 text-green-700" />
							</div>
							<div className="ml-3 lg:ml-4">
								<p className="text-xs lg:text-sm font-medium text-green-700">
									Approuvés
								</p>
								<p className="text-lg lg:text-2xl font-bold text-green-800">
									{stats.status.APPROVED || 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
					<CardContent className="p-4 lg:p-6">
						<div className="flex items-center">
							<div className="p-2 lg:p-3 bg-red-200 rounded-xl">
								<XCircle className="w-4 h-4 lg:w-6 lg:h-6 text-red-700" />
							</div>
							<div className="ml-3 lg:ml-4">
								<p className="text-xs lg:text-sm font-medium text-red-700">
									Rejetés
								</p>
								<p className="text-lg lg:text-2xl font-bold text-red-800">
									{stats.status.REJECTED || 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-logo/10 to-logo/20 border-logo/30">
					<CardContent className="p-4 lg:p-6">
						<div className="flex items-center">
							<div className="p-2 lg:p-3 bg-logo/20 rounded-xl">
								<Star className="w-4 h-4 lg:w-6 lg:h-6 text-logo" />
							</div>
							<div className="ml-3 lg:ml-4">
								<p className="text-xs lg:text-sm font-medium text-logo">
									Total
								</p>
								<p className="text-lg lg:text-2xl font-bold text-logo">
									{Object.values(stats.status).reduce(
										(sum, count) => sum + count,
										0
									)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filtres */}
			<Card className="mb-6">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg font-semibold text-nude-dark-2 flex items-center">
						<FaFilter className="mr-2 text-nude-dark" />
						Filtres et recherche
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nude-dark/60" />
								<input
									type="text"
									placeholder="Rechercher par nom, email, produit, commande..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="dashboard-input w-full pl-10 pr-4 py-3 border border-nude-medium rounded-xl transition-all duration-200 bg-rose-light/20"
								/>
							</div>
						</div>
						<div className="w-full lg:w-64 relative" ref={statusMenuRef}>
							<button
								type="button"
								onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
								className="dashboard-input w-full px-4 py-3 border border-nude-medium rounded-xl transition-all duration-200 bg-rose-light/20 text-left flex items-center justify-between cursor-pointer"
							>
								<span className="text-nude-dark">
									{getStatusLabel(selectedStatus)}
								</span>
								<FaChevronDown
									className={`w-4 h-4 text-nude-dark transition-transform duration-200 ${
										isStatusMenuOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{/* Menu déroulant */}
							{isStatusMenuOpen && (
								<div className="absolute z-50 w-full mt-2 bg-white border border-rose-medium/30 rounded-xl shadow-lg">
									<button
										type="button"
										onClick={() => {
											setSelectedStatus("all");
											setIsStatusMenuOpen(false);
										}}
										className="w-full px-4 py-3 text-left hover:bg-rose-light/30 transition-colors text-nude-dark border-b border-rose-medium/10 last:border-b-0 flex items-center cursor-pointer"
									>
										<Star className="w-4 h-4 mr-2 text-nude-dark/60" />
										Tous les statuts
									</button>
									<button
										type="button"
										onClick={() => {
											setSelectedStatus("PENDING");
											setIsStatusMenuOpen(false);
										}}
										className="w-full px-4 py-3 text-left hover:bg-rose-light/30 transition-colors text-nude-dark border-b border-rose-medium/10 last:border-b-0 flex items-center cursor-pointer"
									>
										<Clock className="w-4 h-4 mr-2 text-yellow-600" />
										En attente
									</button>
									<button
										type="button"
										onClick={() => {
											setSelectedStatus("APPROVED");
											setIsStatusMenuOpen(false);
										}}
										className="w-full px-4 py-3 text-left hover:bg-rose-light/30 transition-colors text-nude-dark border-b border-rose-medium/10 last:border-b-0 flex items-center cursor-pointer"
									>
										<CheckCircle className="w-4 h-4 mr-2 text-green-600" />
										Approuvés
									</button>
									<button
										type="button"
										onClick={() => {
											setSelectedStatus("REJECTED");
											setIsStatusMenuOpen(false);
										}}
										className="w-full px-4 py-3 text-left hover:bg-rose-light/30 transition-colors text-nude-dark flex items-center cursor-pointer"
									>
										<XCircle className="w-4 h-4 mr-2 text-red-600" />
										Rejetés
									</button>
								</div>
							)}

							{/* Overlay pour fermer le menu en cliquant ailleurs */}
							{isStatusMenuOpen && (
								<div
									className="fixed inset-0 z-40"
									onClick={() => setIsStatusMenuOpen(false)}
								/>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Liste des avis */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-nude-dark-2 flex items-center">
						<FaStar className="mr-2 text-logo" />
						Avis clients ({reviews.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{reviews.length === 0 ? (
						<div className="p-8 text-center">
							<div className="mb-4">
								<FaStar className="w-12 h-12 text-logo mx-auto" />
							</div>
							<p className="text-nude-dark text-lg font-medium mb-2">
								Aucun avis trouvé
							</p>
							<p className="text-nude-dark/60">
								Les avis apparaîtront ici une fois soumis par les clients
							</p>
						</div>
					) : (
						<>
							{/* Version desktop - tableau */}
							<div className="hidden lg:block overflow-x-auto">
								<table className="w-full">
									<thead className="bg-rose-light/50 border-b border-rose-medium/20">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-semibold text-nude-dark-2 uppercase tracking-wider">
												Client & Commande
											</th>
											<th className="px-4 py-3 text-left text-xs font-semibold text-nude-dark-2 uppercase tracking-wider">
												Produit
											</th>
											<th className="px-4 py-3 text-left text-xs font-semibold text-nude-dark-2 uppercase tracking-wider">
												Note & Avis
											</th>
											<th className="px-4 py-3 text-left text-xs font-semibold text-nude-dark-2 uppercase tracking-wider">
												Statut
											</th>
											<th className="px-4 py-3 text-left text-xs font-semibold text-nude-dark-2 uppercase tracking-wider">
												Date
											</th>
											<th className="px-4 py-3 text-left text-xs font-semibold text-nude-dark-2 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-rose-medium/10">
										{reviews.map((review) => (
											<tr
												key={review.id}
												className="hover:bg-rose-light/30 transition-colors"
											>
												<td className="px-4 py-4">
													<div>
														<div className="text-sm font-semibold text-nude-dark-2">
															{review.customerName}
														</div>
														<div className="text-xs text-nude-dark/70">
															{review.customerEmail}
														</div>
														<div className="text-xs text-logo font-medium">
															#{review.order.orderNumber}
														</div>
													</div>
												</td>
												<td className="px-4 py-4">
													<div className="text-sm text-nude-dark-2 font-medium max-w-xs">
														{review.productName}
													</div>
												</td>
												<td className="px-4 py-4">
													<div className="flex items-center mb-2">
														{renderStars(review.rating)}
														<span className="ml-2 text-sm text-nude-dark/70">
															({review.rating}/5)
														</span>
													</div>
													{review.comment && (
														<div className="text-sm text-nude-dark/80 max-w-xs">
															{review.comment.length > 80
																? `${review.comment.substring(0, 80)}...`
																: review.comment}
														</div>
													)}
												</td>
												<td className="px-4 py-4">
													{getStatusBadge(review.status)}
												</td>
												<td className="px-4 py-4 text-sm text-nude-dark/70">
													{review.submittedAt
														? new Date(review.submittedAt).toLocaleDateString(
																"fr-FR"
															)
														: "Non soumis"}
												</td>
												<td className="px-4 py-4">
													<div className="flex flex-wrap gap-2">
														{review.status === "PENDING" && (
															<>
																<Button
																	size="sm"
																	onClick={() =>
																		handleStatusUpdate(review.id, "APPROVED")
																	}
																	disabled={updatingReview === review.id}
																	className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto cursor-pointer"
																>
																	<FaCheck className="w-3 h-3" />
																</Button>
																<Button
																	size="sm"
																	onClick={() =>
																		handleStatusUpdate(review.id, "REJECTED")
																	}
																	disabled={updatingReview === review.id}
																	className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-auto cursor-pointer"
																>
																	<FaTimes className="w-3 h-3" />
																</Button>
															</>
														)}
														{review.status === "APPROVED" && (
															<Button
																size="sm"
																onClick={() =>
																	handleStatusUpdate(review.id, "REJECTED")
																}
																disabled={updatingReview === review.id}
																className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-auto cursor-pointer"
															>
																<FaTimes className="w-3 h-3" />
															</Button>
														)}
														{review.status === "REJECTED" && (
															<Button
																size="sm"
																onClick={() =>
																	handleStatusUpdate(review.id, "APPROVED")
																}
																disabled={updatingReview === review.id}
																className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto cursor-pointer"
															>
																<FaCheck className="w-3 h-3" />
															</Button>
														)}
														<Button
															size="sm"
															onClick={() => handleDelete(review.id)}
															className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-auto cursor-pointer"
														>
															<FaTrash className="w-3 h-3" />
														</Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Version mobile - cartes */}
							<div className="lg:hidden space-y-4 p-4">
								{reviews.map((review) => (
									<Card
										key={review.id}
										className="border border-rose-medium/20"
									>
										<CardContent className="p-4">
											<div className="flex justify-between items-start mb-3">
												<div className="flex-1">
													<h4 className="font-semibold text-nude-dark-2 text-sm">
														{review.customerName}
													</h4>
													<p className="text-xs text-nude-dark/70">
														{review.customerEmail}
													</p>
													<p className="text-xs text-logo font-medium">
														#{review.order.orderNumber}
													</p>
												</div>
												<div className="ml-4">
													{getStatusBadge(review.status)}
												</div>
											</div>

											<div className="mb-3">
												<p className="text-sm font-medium text-nude-dark-2 mb-1">
													{review.productName}
												</p>
												<div className="flex items-center mb-2">
													{renderStars(review.rating)}
													<span className="ml-2 text-sm text-nude-dark/70">
														({review.rating}/5)
													</span>
												</div>
												{review.comment && (
													<p className="text-sm text-nude-dark/80">
														{review.comment}
													</p>
												)}
											</div>

											<div className="flex justify-between items-center pt-3 border-t border-rose-medium/10">
												<span className="text-xs text-nude-dark/70">
													{review.submittedAt
														? new Date(review.submittedAt).toLocaleDateString(
																"fr-FR"
															)
														: "Non soumis"}
												</span>
												<div className="flex gap-2">
													{review.status === "PENDING" && (
														<>
															<Button
																size="sm"
																onClick={() =>
																	handleStatusUpdate(review.id, "APPROVED")
																}
																disabled={updatingReview === review.id}
																className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto cursor-pointer"
															>
																Approuver
															</Button>
															<Button
																size="sm"
																onClick={() =>
																	handleStatusUpdate(review.id, "REJECTED")
																}
																disabled={updatingReview === review.id}
																className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto cursor-pointer"
															>
																Rejeter
															</Button>
														</>
													)}
													{review.status === "APPROVED" && (
														<Button
															size="sm"
															onClick={() =>
																handleStatusUpdate(review.id, "REJECTED")
															}
															disabled={updatingReview === review.id}
															className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto cursor-pointer"
														>
															Rejeter
														</Button>
													)}
													{review.status === "REJECTED" && (
														<Button
															size="sm"
															onClick={() =>
																handleStatusUpdate(review.id, "APPROVED")
															}
															disabled={updatingReview === review.id}
															className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto cursor-pointer"
														>
															Approuver
														</Button>
													)}
													<Button
														size="sm"
														onClick={() => handleDelete(review.id)}
														className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-auto cursor-pointer"
													>
														<FaTrash className="w-3 h-3" />
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Pagination */}
			{pagination.totalPages > 1 && (
				<Card className="mt-6">
					<CardContent className="p-4">
						<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
							<div className="text-sm text-nude-dark/70">
								Affichage de {(pagination.page - 1) * pagination.limit + 1} à{" "}
								{Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
								sur {pagination.total} résultats
							</div>
							<div className="flex items-center space-x-2">
								<Button
									onClick={() =>
										setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
									}
									disabled={pagination.page === 1}
									variant="outline"
									size="sm"
									className="border-rose-medium/30 text-nude-dark hover:bg-rose-light/50 cursor-pointer"
								>
									<FaChevronDown className="w-3 h-3 rotate-90 mr-2" />
									Précédent
								</Button>
								<span className="px-4 py-2 text-sm font-medium text-nude-dark-2 bg-rose-light/30 rounded-lg">
									Page {pagination.page} sur {pagination.totalPages}
								</span>
								<Button
									onClick={() =>
										setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
									}
									disabled={pagination.page === pagination.totalPages}
									variant="outline"
									size="sm"
									className="border-rose-medium/30 text-nude-dark hover:bg-rose-light/50 cursor-pointer"
								>
									Suivant
									<FaChevronDown className="w-3 h-3 -rotate-90 ml-2" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
