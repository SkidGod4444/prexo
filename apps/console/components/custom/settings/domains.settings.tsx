import React, { useId, useState } from "react";
import SectionLabel from "../section.label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDomainsStore } from "@prexo/store";
import { useReadLocalStorage } from "usehooks-ts";
import { DomainType } from "@prexo/types";
import { toast } from "sonner";

const endpoint =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/domain"
    : "https://api.prexoai.xyz/v1/domain";

// Simple skeleton card for loading state
function DomainCardSkeleton() {
  return (
    <Card className="w-full p-0 animate-pulse">
      <CardContent className="flex flex-row items-center gap-4 p-2">
        <div className="h-5 w-5 rounded-full bg-muted shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="flex items-center gap-2">
            <span className="h-4 w-32 bg-muted rounded" />
            <span className="h-4 w-16 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-8 w-16 bg-muted rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DomainsSettings() {
  const isMobile = useIsMobile();
  const id = useId();
  const { domains, setDomains } = useDomainsStore();
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${endpoint}/all`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: consoleId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch domains: ${res.status}`);
      }

      const response = await res.json();
      if (Array.isArray(response?.domains)) {
        setDomains(response.domains.map((domain: DomainType) => domain));
      } else {
        setDomains([]);
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
      setDomains([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddDomain = async () => {
    const domainRegex =
      /^(?!-)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

    if (!inputValue || !domainRegex.test(inputValue.trim())) {
      toast.error(
        "Please enter a valid domain name (e.g., example.com or sub.example.com)",
      );
      return;
    }

    // If a domain already exists, mark it as Invalid before adding the new one
    if (domains && domains.length > 0) {
      setIsLoading(true);
      try {
        // Mark all existing domains as Invalid
        await Promise.all(
          domains.map(async (domain) => {
            const res = await fetch(`${endpoint}/delete`, {
              method: "DELETE",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: domain.id,
              }),
            });
            if (!res.ok) {
              throw new Error("Failed to delete the domain.");
            }
          }),
        );
      } catch (err) {
        console.error("Error marking existing domains as Invalid:", err);
        setIsLoading(false);
        toast.error("Failed to delete the domain..");
        return;
      }
    }

    setIsLoading(true);
    toast.promise(
      (async () => {
        const res = await fetch(`${endpoint}/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inputValue.trim(),
            alias: (() => {
              if (!inputValue) return "www";
              const parts = inputValue.split(".");
              return parts.length > 2 ? parts[0] : "www";
            })(),
            projectId: consoleId,
          }),
        });
        if (!res.ok) {
          throw new Error("Error while creating domain!");
        }
        return { name: "Domain" };
      })(),
      {
        loading: "Loading...",
        success: (data) => {
          setInputValue("");
          setIsOpen(false);
          setIsLoading(false);
          setDomains([]);
          window.location.reload();
          return `${data.name} added successfully!`;
        },
        error: (err) => {
          setIsLoading(false);
          console.log("Error while creating domain!", err);
          return "Error";
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between w-full">
        <SectionLabel
          label="Allowed Domains"
          msg="Requests from these domains can only use your API key & endpoint."
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size={"sm"} className={isMobile ? "w-full mt-5" : ""}>
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sm:text-center">
                Add a New Allowed Domain
              </DialogTitle>
              <DialogDescription className="sm:text-center">
                Enter a domain to allow API requests from it. Subdomains are by
                default supported.
              </DialogDescription>
            </DialogHeader>
            <div className="*:not-first:mt-2">
              <div className="flex rounded-md shadow-xs">
                <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                  https://
                </span>
                <Input
                  id={id}
                  className="-ms-px rounded-s-none shadow-none"
                  placeholder="example.com"
                  type="text"
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAddDomain} disabled={isLoading}>
              {isLoading ? "Adding Domain..." : "Add Domain"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-2 mt-2 md:mt-5 w-full">
        {domains.length == 0 && isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <DomainCardSkeleton key={idx} />
          ))
        ) : domains && domains.length > 0 ? (
          domains.map((domain: DomainType, idx: number) => (
            <Card className="w-full p-0" key={idx}>
              <CardContent className="flex flex-row items-center gap-4 p-2">
                {/* Status Dot */}
                {isRefreshing ? (
                  <RefreshCw
                    size={20}
                    className="h-6 w-6 shrink-0 bg-blue-600 rounded-full font-bold p-1 text-primary animate-spin"
                  />
                ) : domain.status === "Valid" ? (
                  <Check
                    size={20}
                    className="h-6 w-6 shrink-0 bg-[#404040] rounded-full font-bold p-1 text-primary"
                  />
                ) : domain.status === "Invalid" ? (
                  <X
                    size={20}
                    className="h-6 w-6 shrink-0 bg-red-700 rounded-full font-bold p-1 text-primary"
                  />
                ) : domain.status === "Pending" ? (
                  <RefreshCw
                    size={20}
                    className="h-6 w-6 shrink-0 bg-blue-600 rounded-full font-bold p-1 text-primary"
                  />
                ) : null}

                {/* Domain Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {domain.name || "Unknown Domain"}
                    </span>
                    {domain.alias === "www" ? (
                      <Badge variant={"outline"}>Includes All Subdomains</Badge>
                    ) : (
                      <Badge variant={"outline"}>Only This Subdomain</Badge>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-2 mt-1 text-xs ${domain.status === "Invalid" ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    <span>
                      {`${domain.status} Configuration` ||
                        "Valid Configuration"}
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    disabled={isRefreshing}
                    onClick={handleOnRefresh}
                  >
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-8 bg-card rounded-2xl">
            <span className="text-muted-foreground mb-2">
              No domains added yet.
            </span>
            <span className="text-xs text-muted-foreground">
              Add a domain to allow API requests from it.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
