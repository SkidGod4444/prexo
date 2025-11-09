export const isDevEnv = process.env.NODE_ENV === "development";

export const constants = {
  apiEndpoint: isDevEnv
    ? "http://localhost:3001/v1"
    : "https://api.prexoai.xyz/v1",
  maintenancePageURL: "https://status.prexoai.xyz/maintenance/760784",
};
