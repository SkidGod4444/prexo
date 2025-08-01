"use client";
import PricingCards from "@/components/custom/pricing/pricing.cards";
import {
  SectionHeaderDescription,
  SectionHeaderHeading,
} from "@/components/custom/text-wrappers";
import { pricingCardConfig } from "@/constants";
import { useMyProfileStore } from "@prexo/store";
import React from "react";

export default function Pricing() {
  const { myProfile } = useMyProfileStore();
  const isUser = !!(myProfile && myProfile.id);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 mx-auto h-full w-full bg-[radial-gradient(circle,rgba(211,211,211,0.1),rgba(18,20,22,0.05),rgba(18,20,22,0))] opacity-60" />
      <section
        id="pricing"
        className="flex flex-col my-25 items-center justify-center w-full h-full p-4"
      >
        <div className="flex flex-col items-center justify-center w-full max-w-4xl gap-5 mb-5">
          <SectionHeaderHeading>
            Pricing that doesn&apos;t suck
          </SectionHeaderHeading>
          <SectionHeaderDescription className="md:text-center">
            Affordable plans built to grow with you — no hidden fees, no
            surprises.
          </SectionHeaderDescription>
        </div>
        <PricingCards items={pricingCardConfig} isUserAuthenticated={isUser} />
      </section>
    </div>
  );
}
