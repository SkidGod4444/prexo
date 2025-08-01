import { Unkey, verifyKey } from "@unkey/api";

const rootKey = process.env.UNKEY_ROOT_API_KEY!;
const apiID = process.env.UNKEY_API_ID!;
const unkey = new Unkey({ rootKey: rootKey });

async function createApi(
  projectID: string,
  name: string,
  enabled: boolean,
  expires?: number,
) {
  try {
    const { result, error } = await unkey.keys.create({
      apiId: apiID,
      name: name,
      prefix: "prexo",
      byteLength: 16,
      externalId: projectID,
      roles: ["freemium.user"],
      remaining: 100,
      ratelimit: {
        async: true,
        duration: 1000,
        limit: 10,
      },
      environment: "universal",
      refill: {
        interval: "daily",
        amount: 100,
      },
      enabled: enabled,
      ...(expires !== undefined && expires !== null && { expires: expires }),
    });
    if (error) {
      console.error("Error creating API:", error);
      throw new Error("Failed to create API");
    }
    console.log("Created new API:", result);
    return result;
  } catch (error) {
    console.error("Error creating API:", error);
    throw new Error("Failed to create API");
  }
}

async function verifyApi(apiKey: string, tags?: string[], cost?: number) {
  try {
    const { result, error } = await verifyKey({
      key: apiKey,
      apiId: apiID,
      tags: tags,
      ...(cost !== undefined ? { remaining: { cost: cost } } : {}),
    });
    if (error) {
      console.error("Error verifying API key:", error);
      return { error };
    }
    if (!result.valid) {
      // do not grant access
      return {
        error: { message: "Invalid API key", code: "INVALID_KEY", result },
      };
    }
    console.log("API key verified successfully:", result);
    return { result };
  } catch (error) {
    console.error("Error verifying API:", error);
    return { error };
  }
}

async function getApiKey(keyId: string) {
  try {
    const { result, error } = await unkey.keys.get({ keyId: keyId });
    if (error) {
      console.error("Error getting API key:", error);
      throw new Error("Invalid API key");
    }
    if (!result) {
      throw new Error("API key not found");
    }
    console.log("API key retrieved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error getting API key:", error);
    throw new Error("Failed to get API key");
  }
}

async function deleteApiKey(apiKey: string) {
  try {
    const { result, error } = await unkey.keys.delete({
      keyId: apiKey,
    });
    if (error) {
      console.error("Error deleting API key:", error);
      throw new Error("Invalid API key");
    }
    if (!result) {
      throw new Error("API key not found");
    }
    console.log("API key deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error deleting API key:", error);
    throw new Error("Failed to delete API key");
  }
}

async function getApiAnalytics(apiKey: string, projectID: string) {
  try {
    const { result, error } = await unkey.analytics.getVerifications({
      apiId: apiID,
      externalId: projectID,
      keyId: apiKey,
    });
    if (error) {
      console.error("Error getting API analytics:", error);
      throw new Error("Invalid API key");
    }
    if (!result) {
      throw new Error("API analytics not found");
    }
    console.log("API analytics retrieved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error getting API analytics:", error);
    throw new Error("Failed to get API analytics");
  }
}

async function listAllApiKeys() {
  try {
    const { result, error } = await unkey.apis.listKeys({
      apiId: apiID,
      limit: 100,
    });
    if (error) {
      console.error("Error getting all API keys:", error);
      throw new Error("Failed to get all API keys");
    }
    if (!result) {
      throw new Error("No API keys found");
    }
    console.log("All API keys retrieved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error getting all API keys:", error);
    throw new Error("Failed to get all API keys");
  }
}
export {
  createApi,
  verifyApi,
  getApiKey,
  getApiAnalytics,
  deleteApiKey,
  listAllApiKeys,
};
