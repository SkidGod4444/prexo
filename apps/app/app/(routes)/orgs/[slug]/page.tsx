"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import OrgsCard from "@/components/custom/orgs/card";
import { useState, useId, useEffect, useMemo, use } from "react";
import OrgCardSkeleton from "@/components/custom/skeletons/org.card";
import { useOrganizationStore, useProjectsStore } from "@prexo/store";
import { useAuth } from "@clerk/nextjs";
import { useLocalStorage } from "usehooks-ts";
import { Spinner } from "@/components/ui/spinner";

export default function Orgs({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const id = useId() as string;
  const { slug } = use(params);
  const { orgSlug, isLoaded: isAuthLoaded } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { projects } = useProjectsStore();
  const { orgs } = useOrganizationStore();
  const [isLoading, _] = useState<boolean>(false);
  const [selectedOrgSlug, setSelectedOrgSlug, removeSelectedOrgSlug] =
    useLocalStorage("@prexo-#selectedOrgSlug", "");

  const selectedOrg = useMemo(() => {
    {
      return orgs.find((o) => o.slug === selectedOrgSlug);
    }
  }, [orgs, selectedOrgSlug]);

  const appsOfSelectedOrg = useMemo(() => {
    if (!selectedOrg) return [];
    return projects.filter((p) => p.orgId === selectedOrg.id);
  }, [projects, selectedOrg]);

  const shouldRedirect = useMemo(() => {
    // Only evaluate after Clerk auth is fully loaded and orgSlug is known.
    if (!isAuthLoaded) return false;
    if (!orgSlug) return false; // No org selected yet; don't redirect
    return slug !== orgSlug;
  }, [slug, orgSlug, isAuthLoaded]);
  useEffect(() => {
    if (shouldRedirect) {
      removeSelectedOrgSlug();
      router.replace("/org-not-found");
    }
  }, [shouldRedirect, removeSelectedOrgSlug, router]);

  useEffect(() => {
    if (isAuthLoaded && orgSlug && !shouldRedirect) {
      setSelectedOrgSlug(slug);
    }
  }, [slug, shouldRedirect, setSelectedOrgSlug, isAuthLoaded, orgSlug]);

  if (!isAuthLoaded || !orgSlug || shouldRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Spinner className="h-8 w-8 animate-spin" />
      </div>
    );
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
                  <OrgCardSkeleton key={`skeleton-${idx}`} />
                ))}
              </>
            )}
            {!isLoading &&
              appsOfSelectedOrg.map((proj) => (
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
