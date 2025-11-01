import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { OrganizationList } from "@clerk/nextjs";
import { TriangleAlertIcon } from "lucide-react";

export default async function OrgNotFound() {
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-background py-16">
      <div className="flex flex-col w-full max-w-md gap-8 items-center justify-center">
      <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>
        Organization Not Found!
      </AlertTitle>
      <AlertDescription>
        The organization you are trying to access does not exist or you do not have permission to view it. Please select a different organization or contact support if you believe this is an error.
      </AlertDescription>
    </Alert>
        <div className="w-full flex flex-col items-center justify-center">
          <OrganizationList
            afterCreateOrganizationUrl="/orgs/:slug"
            afterSelectOrganizationUrl="/orgs/:slug"
          />
        </div>
      </div>
    </div>
  );
}
