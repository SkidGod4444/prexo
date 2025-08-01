"use client";
import NotFound from "@/app/not-found";
import OnboardingChat from "@/components/custom/onboarding/chat/chat";
import { useMyProfileStore } from "@prexo/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";

function OnboardingInner() {
  const { myProfile } = useMyProfileStore();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const pathname = usePathname();
  const uID = pathname?.split("/onboarding/")[1] || null;
  const router = useRouter();
  const consoleUrl =
    process.env.NODE_ENV === "production"
      ? "https://console.prexoai.xyz"
      : "http://localhost:3002";

  useEffect(() => {
    if (
      myProfile &&
      myProfile?.role !== "onboarded" &&
      myProfile?.role === "user"
    ) {
      router.replace(`/onboarding/${myProfile.id}`);
    } else {
      if (redirectUrl && redirectUrl.startsWith("/")) {
        router.push(redirectUrl);
      } else {
        router.push(consoleUrl);
      }
    }
  }, [myProfile, router, redirectUrl, consoleUrl]);

  if (!myProfile || myProfile.id !== uID) {
    return NotFound();
  }
  return <OnboardingChat chatId={uID} />;
}

export default function Onboarding() {
  return (
    <Suspense fallback={null}>
      <OnboardingInner />
    </Suspense>
  );
}
