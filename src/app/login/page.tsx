import { Suspense } from "react";
import LoginClient from "@/components/LoginClient/LoginClient";

export default function Page() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}