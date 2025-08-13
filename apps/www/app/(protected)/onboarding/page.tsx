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
    if (
      myProfile &&
      myProfile?.role !== "onboarded" &&
      myProfile?.role === "user"
    ) {
      router.replace(`/onboarding/${myProfile.id}`);
    } else {
      if (
        redirectUrl &&
        redirectUrl.startsWith("/") &&
        redirectUrl[1] !== "/"
      ) {
        router.push(redirectUrl);
      }
    }
  }, [router, redirectUrl, myProfile]);

  if (!myProfile) {
    router.replace("/auth");
  }

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
