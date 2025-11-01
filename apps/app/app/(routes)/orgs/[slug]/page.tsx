"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import OrgsCard from "@/components/custom/orgs/card";
import { useState, use } from "react";
import OrgCardSkeleton from "@/components/custom/skeletons/org.card";
import { useProjectsStore } from "@prexo/store";
import { useAuth } from "@clerk/nextjs";

export default function Orgs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const pathname = usePathname();
  const { orgSlug } = useAuth()
  const { projects } = useProjectsStore();
  const [isLoading, _] = useState<boolean>(false);
  const router = useRouter();
  
  if (slug != orgSlug) {
    return router.push(`/org-not-found`);
  }
  return (
    <div className="flex flex-col min-h-full w-full">
      <div className="w-full max-w-8xl mx-auto flex flex-col items-start">
        <h1 className="text-3xl font-bold mb-2">Applications</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Manage your apps or create a new one.
        </p>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {/* Empty card as the first card */}
            <OrgsCard isEmptyCard={true} />
            {/* Map actual org cards */}
            {isLoading && (
              <>
                {Array.from({ length: 7 }).map((_, idx) => (
                  <OrgCardSkeleton key={`org-skel-${idx}`} />
                ))}
              </>
            )}
            {/* {error && !isLoading && (
              <div className="col-span-full text-sm text-red-500">
                {error}
              </div>
            )} */}
            {!isLoading &&
              projects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`${pathname}/apps/${proj.slug}`}
                  className="flex"
                >
                  <OrgsCard
                    name={proj.name}
                    description={proj.description || undefined}
                    isOnProduction={false}
                    isFreeTier={proj.isFreeTier}
                    endpoint={proj.endpoint || undefined}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
