import { socials } from "@prexo/utils/constants";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Link as LinkIcon, Construction } from "lucide-react";
import Link from "next/link";

export function EmptyWIP() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-secondary border">
          <Construction />
        </EmptyMedia>
        <EmptyTitle>Work In Progress</EmptyTitle>
        <EmptyDescription>
          We're working hard to bring this feature to you soon. Stay tuned!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={socials.discord} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <LinkIcon className="opacity-72" />
            Join Our Discord for Updates
          </Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
}
