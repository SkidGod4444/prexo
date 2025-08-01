import React from "react";
import SectionLabel from "../section.label";
import ApiKeyTable from "@/components/apikey.table";

export default function ApiKeySettings() {
  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-hidden">
      <SectionLabel
        label="API Settings"
        msg="Manage your API endpoints & keys."
      />
      <div className="flex mt-5 h-full w-full">
        <ApiKeyTable />
      </div>
    </div>
  );
}
