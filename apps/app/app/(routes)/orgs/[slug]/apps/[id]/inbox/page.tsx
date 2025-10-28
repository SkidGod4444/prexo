"use client";
import { EmptyInbox } from "@/components/custom/empty/inbox";
import { EmptyWIP } from "@/components/custom/empty/wip";
import { useFeatureFlag } from "@/hooks/use-feature-flags";

export default function Inbox() {
  const { value: isEnabled } = useFeatureFlag("betaFeatures", false);
  return (
    <div className="flex items-center justify-center h-full w-full overflow-hidden">
      {isEnabled ? <EmptyInbox /> : <EmptyWIP />}
    </div>
  );
}
