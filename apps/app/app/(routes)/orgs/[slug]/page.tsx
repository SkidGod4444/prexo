"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OrgsCard from "@/components/custom/orgs/card";
import { constants } from "@/lib/constants";
import { useEffect, useState } from "react";
import OrgCardSkeleton from "@/components/custom/skeletons/org.card";
import { ProjectType } from "@prexo/types";

export default function Orgs() {
  const pathname = usePathname();
  const apiEndpoint = `${constants.apiEndpoint}/project/all`;
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      setError(null);
      try {
        const res = await fetch(apiEndpoint, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch apps");
        }
        const data = await res.json();
        if (isMounted) {
          setProjects(Array.isArray(data?.projects) ? data.projects : []);
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Something went wrong");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, [apiEndpoint]);

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
              !error &&
              projects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`${pathname}/apps/${proj.id}`}
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
