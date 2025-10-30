"use client";

import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

export const useFeatureFlag = (
  flagKey: string,
  defaultValue: boolean = false,
) => {
  const flags = useFlags();
  const ldClient = useLDClient();

  return {
    value: flags[flagKey] ?? defaultValue,
    client: ldClient,
  };
};

export const useLaunchDarkly = () => {
  const flags = useFlags();
  const ldClient = useLDClient();

  return {
    flags,
    client: ldClient,
  };
};
