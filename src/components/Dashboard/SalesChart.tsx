"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface SalesData {
	period: string;
	sales: number;
	salesNormal: number;
	salesHigh: number;
}

interface SalesChartProps {
	data: SalesData[];
	title?: string;
}

const SalesChart = ({
	data,
	title = "Ventes par période",
}: SalesChartProps) => {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg lg:text-2xl font-semibold text-nude-dark">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data}>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
							<YAxis
								stroke="#6b7280"
								fontSize={12}
								tickFormatter={(value) => `${value}€`}
							/>
							<Tooltip
								formatter={(value: number) => [`${value}€`, "Ventes"]}
								labelStyle={{ color: "#374151" }}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Bar
								dataKey="salesNormal"
								radius={[4, 4, 0, 0]}
								fill="#f9dede"
								stackId="a"
							/>
							<Bar
								dataKey="salesHigh"
								radius={[4, 4, 0, 0]}
								fill="#f4cdcd"
								stackId="a"
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default SalesChart;
