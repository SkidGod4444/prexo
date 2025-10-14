import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const OrgCntxt = async ({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string;
}) => {
  // Get the orgSlug from Clerk authentication
  const { orgSlug } = await auth();

  if (!orgSlug || slug !== orgSlug) {
    console.log(
      `Organization context not found or mismatch. Expected: ${slug}, Found: ${orgSlug}`,
    );
    redirect("/org-not-found");
  }

  return <>{children}</>;
};
