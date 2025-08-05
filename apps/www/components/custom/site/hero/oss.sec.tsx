import React from "react";
import {
  SectionHeader,
  SectionHeaderHeading,
  SectionHeaderDescription,
} from "../../text-wrappers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/constants/icons";
import Link from "next/link";
import { socials } from "@prexo/utils/constants";

export default function OssSec() {
  return (
    <div className="relative w-full items-center justify-center py-10">
      <div className="px-4 md:px-14">
        <SectionHeader className="flex flex-col z-50 mb-10 items-start">
          <SectionHeaderHeading>We believe in Open Source</SectionHeaderHeading>
          <SectionHeaderDescription>
            Our platform is built on open-source principles, allowing you to
            customize and extend the functionality to suit your needs. Join our
            community and contribute to the future of AI-powered sales and
            support.
          </SectionHeaderDescription>
        </SectionHeader>

        <div className="p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-2">
            {[
              {
                title: "GitHub",
                description:
                  "It helps us grow and reach more developers like you. Your support means a lot to us and encourages us to keep improving the platform.",
                icon: <Icons.gitHub className="size-4 mr-2" />,
                href: socials.github,
                label: "Star us on GitHub",
              },
              {
                title: "Discord",
                description:
                  "Join our Discord community to connect with other developers, share your experiences, and get help with any issues you encounter.",
                icon: <Icons.discord className="size-4 mr-2" />,
                href: socials.discord,
                label: "Join us on Discord",
              },
              {
                title: "Twitter",
                description:
                  "Follow us on Twitter for the latest updates, news, and announcements. Stay connected with our community and share your thoughts with us.",
                icon: <Icons.twitter className="size-4 mr-2" />,
                href: socials.x,
                label: "Follow us on Twitter",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 bg-transparent"
              >
                  <div className="border relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl p-6 md:p-6 dark:shadow-[0px_0px_20px_0px_#2D2D2D]">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                      <CardContent className="flex flex-col items-start gap-2 p-0 pb-0">
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                          {card.description}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="p-0 pt-4">
                        <Link href={card.href} target="_blank" rel="noreferrer">
                          <Button className="text-sm">
                            {card.icon}
                            {card.label}
                          </Button>
                        </Link>
                      </CardFooter>
                    </div>
                  </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
