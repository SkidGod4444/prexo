import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { orgSlug } = await auth();
  // If user has a valid organization, redirect them to it
  if (orgSlug) {
    redirect(`/orgs/${orgSlug}`);
  } else {
    console.log("No orgSlug found!");
  }
}
