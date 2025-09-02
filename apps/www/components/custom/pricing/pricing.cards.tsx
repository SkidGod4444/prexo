"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconCheck } from "@tabler/icons-react";
import { TextMorph } from "../text-morph";
import { AnimatedNumber } from "../anim-numb";
import type { PCards } from "@prexo/types";
import Link from "next/link";
import { getCheckoutLink } from "@prexo/auth/client";
import { useRouter } from "next/navigation";

export default function PricingCards({
  isYearly,
  items,
  isUserAuthenticated,
}: PCards) {
  const router = useRouter();
  const handleBtnClick = async () => {
    try {
      if (!isUserAuthenticated) {
        console.log("User is not authenticated, redirecting to auth page");
        router.push("/auth?redirect=/pricing");
      }
      const checkoutLink = await getCheckoutLink([
        "40aaafdf-3ebc-44fe-b11b-883e610a363b",
      ]);
      if (checkoutLink) {
        router.push(checkoutLink);
      } else {
        console.error("Failed to get checkout link");
      }
    } catch (error) {
      console.error("Error handling button:", error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-15 mt-10">
      {items.map((item, index) => (
        <Card
          key={index}
          className="bg-secondary/30 backdrop-blur-lg rounded-2xl p-1 max-w-sm"
        >
          <CardHeader className="rounded-2xl border-t-2 border-r border-[#333] border-opacity-80 m-3 p-4 bg-gradient-to-br from-secondary/30 to-[#262829]">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              {item.isFeatured && (
                <Badge className="rounded-xl hover:bg-primary">Featured</Badge>
              )}
            </div>
            <p className="text-xs inline-flex gap-1">
              Billed
              <TextMorph>{isYearly ? "Yearly" : "Monthly"}</TextMorph>
            </p>
            <div className="flex flex-row items-center gap-2 pt-4 pb-6">
              <span className="text-7xl font-bold tracking-tight">
                <span className="text-xl align-bottom">{item.currency}</span>
                <AnimatedNumber
                  springOptions={{
                    bounce: 0,
                    duration: 2000,
                  }}
                  value={isYearly ? item.priceYearly : item.priceMonthly}
                />
              </span>
              <div className="flex flex-col text-lg gap-2 font-semibold">
                <span className="line-through">
                  {item.currency}
                  <AnimatedNumber
                    springOptions={{
                      bounce: 0,
                      duration: 2000,
                    }}
                    value={
                      isYearly
                        ? item.beforePriceYearly
                        : item.beforePriceMonthly
                    }
                  />
                </span>
                <Badge className="bg-background hover:bg-background text-primary">
                  <AnimatedNumber
                    springOptions={{
                      bounce: 0,
                      duration: 2000,
                    }}
                    value={
                      isYearly ? item.discountYearly : item.discountMonthly
                    }
                  />
                  % OFF
                </Badge>
              </div>
            </div>

            {item.isFree ? (
              <Link href={"/auth"}>
                <Button className="w-full">{item.btn}</Button>
              </Link>
            ) : (
              <Button onClick={handleBtnClick}>{item.btn}</Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6 my-5">
            <ul className="space-y-2.5">
              {item.benifits.map((benifits, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-400"
                >
                  <IconCheck
                    stroke={4}
                    className="h-4 w-4 mt-0.5 shrink-0 bg-[#404040] rounded-full font-bold p-0.5 text-primary"
                  />
                  <span>{benifits}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center gap-2 p-4">
            <Button variant={"ghost"} className="rounded-2xl">
              Questions? Chat with us.
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
