import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { socials } from "@prexo/utils/constants";
import Logo from "@/components/custom/logo";
import { GitCompareArrows, HeartPlus, MessageCircleDashed } from "lucide-react";
/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <Logo />,
    transparentMode: "always",
  },
  githubUrl: socials.github,
  searchToggle: {
    enabled: true,
  },
  links: [
    {
      type: "button",
      text: "Discord Community",
      url: socials.discord,
      icon: <MessageCircleDashed />,
    },
    {
      type: "button",
      text: "Sponsor on GitHub",
      url: socials.sponsor,
      icon: <HeartPlus />,
    },
    {
      type: "button",
      text: "Changelogs",
      url: socials.changelogs,
      icon: <GitCompareArrows />,
    },
  ],
};
