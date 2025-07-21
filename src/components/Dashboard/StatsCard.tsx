import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon: LucideIcon;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	className?: string;
}

const StatsCard = ({
	title,
	value,
	description,
	icon: Icon,
	trend,
	className,
}: StatsCardProps) => {
	return (
		<Card className={cn("bg-[#d9c4b5]/30 border border-rose-medium", className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm lg:text-base font-medium text-nude-dark">
					{title}
				</CardTitle>
				<Icon className="h-4 w-4 lg:h-5 lg:w-5 text-nude-dark" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-nude-dark">{value}</div>
				{description && (
					<p className="text-xs lg:text-sm text-nude-dark mt-1">{description}</p>
				)}
				{trend && (
					<div className="flex items-center mt-2">
						<span
							className={trend.isPositive ? "text-green-600" : "text-red-600"}
						>
							{trend.isPositive ? "+" : "-"}
							{Math.abs(trend.value)}%
						</span>
						<span className="text-xs lg:text-sm text-nude-dark ml-1">vs mois dernier</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default StatsCard;
