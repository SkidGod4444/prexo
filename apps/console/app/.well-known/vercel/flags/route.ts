import { getProviderData, createFlagsDiscoveryEndpoint } from "flags/next";
import * as flags from "@prexo/flags";

export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData(flags);
});
