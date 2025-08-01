"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import type { UIMessage } from "ai";
import { useMyProfileStore } from "@prexo/store";
import { completeOnboardingAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

type OnboardingCardAiUiProps = {
  addToolResult: (result: { toolCallId: string; result: string }) => void;
  append: (message: UIMessage) => void;
  callId: string;
};
export default function OnboardingCardAiUi({
  addToolResult,
  append,
  callId,
}: OnboardingCardAiUiProps) {
  const { myProfile, addMyProfile, removeMyProfile } = useMyProfileStore();
  const [loadingComp, setLoadingComp] = React.useState(false);
  const [loadingCl, setLoadingCl] = React.useState(false);
  const router = useRouter();

  if (!myProfile?.id) {
    console.error("User ID is required");
    return null;
  }
  const handleOnComplete = async () => {
    try {
      setLoadingComp(true);
      console.log("Completing onboarding process...");
      const user = await completeOnboardingAction(myProfile.id);
      console.log("Onboarding process completed:", user);
      removeMyProfile(myProfile.id);
      addMyProfile(user);
      addToolResult({
        toolCallId: callId,
        result:
          "Onboarding process completed successfully! Redirecting you to the dashboard...",
      });
      append({
        id: `${myProfile.id}-${Date.now()}`,
        role: "assistant",
        content:
          "Onboarding process completed successfully! Redirecting you to the dashboard...",
        parts: [
          {
            type: "text",
            text: "Onboarding process completed successfully! Redirecting you to the dashboard...",
          },
        ],
      });
      setLoadingComp(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error completing onboarding process:", error);
      setLoadingComp(false);
      addToolResult({
        toolCallId: callId,
        result: "Error completing onboarding process.",
      });
      append({
        id: `${myProfile.id}-${Date.now()}`,
        role: "assistant",
        content: "Error completing onboarding process.",
        parts: [
          {
            type: "text",
            text: "Error completing onboarding process.",
          },
        ],
      });
    }
  };

  const handleOnCancle = () => {
    setLoadingCl(true);
    console.log("Onboarding process cancelled.");
    addToolResult({
      toolCallId: callId,
      result: "Onboarding process cancelled.",
    });
    append({
      id: myProfile.id,
      role: "user",
      content: "No, I want to cancel this action.",
      parts: [
        {
          type: "text",
          text: "No, I want to cancel this action.",
        },
      ],
    });
    setLoadingCl(false);
    console.log("Onboarding process cancelled.");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Are you sure?</CardTitle>
        <CardDescription>
          Are you sure you want to complete the onboarding process? This action
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleOnComplete}
          disabled={loadingComp}
        >
          {loadingComp ? "Completing..." : "Complete Onboarding"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleOnCancle}
          disabled={loadingCl}
        >
          {loadingCl ? "Cancelling..." : "Cancel Onboarding"}
        </Button>
      </CardFooter>
    </Card>
  );
}
