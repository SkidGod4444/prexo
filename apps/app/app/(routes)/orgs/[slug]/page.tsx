import { OrganizationProfile } from "@clerk/nextjs";
import React from "react";
import { OrgCntxt } from "@/contexts/org.cntxt";

export default async function OrgPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return (
    <OrgCntxt slug={slug}>
      <div>
        <OrganizationProfile />
      </div>
    </OrgCntxt>
  );
}
