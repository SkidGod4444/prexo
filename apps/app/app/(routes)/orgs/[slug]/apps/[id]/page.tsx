"use client";

import { useProjectsStore } from "@prexo/store";
import { redirect } from "next/navigation";
import { use } from "react";

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { projects } = useProjectsStore();

  if (!projects.find((proj) => proj.slug === slug)) {
    return redirect("/");
  }

  return <div>hey</div>;
}
