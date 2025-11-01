"use client";

import { useProjectsStore } from "@prexo/store";
import { redirect } from "next/navigation";
import { use } from "react";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects } = useProjectsStore();

  if (!projects.find((proj) => proj.id === id)) {
    return redirect("/");
  }

  return <div>hey</div>;
}
