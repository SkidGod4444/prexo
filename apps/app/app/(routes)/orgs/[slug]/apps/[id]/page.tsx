"use client";
import { FeatureFlagExample } from "@/components/feature-flag-example";
import { useLDClient } from "launchdarkly-react-client-sdk";
import React, { useEffect } from "react";

export default function page() {
  const ldClient = useLDClient();
  return <FeatureFlagExample/>;
}
