"use client";
import { EmptyWIP } from "@/components/custom/empty/wip";
import { useFeatureFlag } from "@/hooks/use-feature-flags";

export default function Chats() {
  const { value: isEnabled } = useFeatureFlag("betaFeatures", false);
  return (
    <div className="flex items-center justify-center h-full w-full overflow-hidden">
      {isEnabled ? <div>Chats Page</div> : <EmptyWIP />}
    </div>
  );
}
