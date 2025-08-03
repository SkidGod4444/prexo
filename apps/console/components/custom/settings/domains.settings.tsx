import React from "react";
import SectionLabel from "../section.label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DomainsSettings() {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between w-full">
        <SectionLabel
          label="Allowed Domains"
          msg="Requests from these domains can only use your API key & endpoint."
        />
        <Button size={"sm"} className={isMobile ? "w-full mt-5" : ""}>
          Add Domain
        </Button>
      </div>
      <div className="flex flex-col gap-2 mt-2 md:mt-5 w-full">
        <Card className="w-full p-0">
          <CardContent className="flex flex-row items-center gap-4 p-2">
            {/* Status Dot */}
            <Check
              size={4}
              className="h-5 w-5 shrink-0 bg-[#404040] rounded-full font-bold p-0.5 text-primary"
            />
            {/* Domain Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  prexoai.xyz
                </span>
                <Badge variant={"outline"}>www.prexoai.xyz</Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>Valid Configuration</span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant={"outline"} size={"sm"}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
