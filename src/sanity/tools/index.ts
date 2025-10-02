import BulkPromoTool from "./bulkPromo";
import BulkStockTool from "./bulkStock";
import FixMissingKeys from "./fixMissingKeys";

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
	{
		name: "fix-missing-keys",
		title: "Corriger les Clés Manquantes",
		component: FixMissingKeys,
		icon: () => "🔧",
	},
];
