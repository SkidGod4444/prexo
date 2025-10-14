import { OrganizationList } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrgNotFound() {
  const { orgSlug } = await auth();

  // If user has a valid organization, redirect them to it
  if (orgSlug) {
    redirect(`/orgs/${orgSlug}`);
  }

  return (
    <>
      <p>Sorry, organization is not valid.</p>
      <OrganizationList
        afterCreateOrganizationUrl="/orgs/:slug"
        afterSelectOrganizationUrl="/orgs/:slug"
      />
    </>
  );
}
