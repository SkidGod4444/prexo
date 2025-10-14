import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DraftingCompass } from "lucide-react";
import React from "react";

export default function OrgsCard() {
  return (
    <Card className="flex bg-secondary border-1 border-dashed rounded-xl p-1">
      <CardContent className="bg-card rounded-xl border">
        <div className="flex flex-row items-center justify-between p-1 gap-5">
          <DraftingCompass className="size-4" />

          <div className="text-sm text-secondary-foreground">
            dev.loli.nope.som{" "}
          </div>
        </div>
      </CardContent>
      <div className="flex items-center justify-between">
        <Badge variant={"ghost"}>Total members: 04</Badge>
        <Badge variant={"ghost"}>4 members</Badge>
      </div>
    </Card>
  );
}
