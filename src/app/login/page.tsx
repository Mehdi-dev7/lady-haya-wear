import Loader from "@/components/Loader";
import LoginClient from "@/components/LoginClient/LoginClient";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<Loader size={64} />}>
			<LoginClient />
		</Suspense>
	);
}
