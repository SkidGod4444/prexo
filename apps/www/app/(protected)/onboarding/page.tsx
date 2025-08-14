"use client";
import { useMyProfileStore } from "@prexo/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function OnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { myProfile } = useMyProfileStore();

useEffect(() => {
  // Redirect unauthenticated users
  if (!myProfile) {
    router.replace("/auth");
    return;
  }

  // New users start onboarding
  if (myProfile.role === "user") {
    router.replace(`/onboarding/${myProfile.id}`);
    return;
  }

  // Otherwise honor a safe, same-origin redirect param
  if (redirectUrl?.startsWith("/") && !redirectUrl.startsWith("//") && redirectUrl[1] !== "/") {
    router.replace(redirectUrl);
    return;
  }
}, [router, redirectUrl, myProfile]);


  return (
    <div className="flex items-center justify-center h-screen w-full">
      Authenticating please wait...
    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={null}>
      <OnboardingInner />
    </Suspense>
  );
}
