interface NotificationBadgeProps {
	count: number;
	className?: string;
}

export default function NotificationBadge({
	count,
	className = "",
}: NotificationBadgeProps) {
	if (count === 0) return null;

	return (
		<span
			className={`absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full text-white text-sm flex items-center justify-center ${className}`}
		>
			{count > 99 ? "99+" : count}
		</span>
	);
}
