import { createAuthClient } from "better-auth/client";
import { polarClient } from "@polar-sh/better-auth";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://api.prexoai.xyz";

export const authClient = createAuthClient({
  baseURL,
  basePath: "/v1/auth",
  plugins: [polarClient()],
  fetchOptions: {
    onError: async (context) => {
        const { response } = context;
        if (response.status === 429) {
            const retryAfter = response.headers.get("X-Retry-After");
            console.log(`Auth rate limit exceeded. Retry after ${retryAfter} seconds`);
        }
    },
}
});

export async function getCheckoutLink(productsId: string[]) {
  const res = await authClient.checkout({
    products: productsId,
  });

  return res.data?.url;
}

export async function getPortalLink() {
  await authClient.customer.portal();
}

export async function getCustomerState() {
  const { data: customerState } = await authClient.customer.state();
  return customerState;
}

export async function deleteUser() {
  await authClient.deleteUser({
    callbackURL: "/goodbye"
});
console.log("User Deleted!")
}
