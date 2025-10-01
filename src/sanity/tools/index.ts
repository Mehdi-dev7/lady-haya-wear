import BulkPromoTool from "./bulkPromo";
import BulkStockTool from "./bulkStock";

export const tools = [
	{
		name: "bulk-promo",
		title: "Promotions en Masse",
		component: BulkPromoTool,
		icon: () => "🎯",
	},
	{
		name: "bulk-stock",
		title: "Gestion du Stock",
		component: BulkStockTool,
		icon: () => "📦",
	},
];
