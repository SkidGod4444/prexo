import { betterAuth } from "better-auth";
import { prisma } from "@prexo/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { haveIBeenPwned, lastLoginMethod, admin } from "better-auth/plugins";
import { polar, checkout, portal, usage } from "@polar-sh/better-auth";
import { polarClient } from "@prexo/polar";
import { generateHashKeyHex } from "@prexo/crypt";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    haveIBeenPwned({
      customPasswordCompromisedMessage: "Please choose a more secure password.",
    }),
    lastLoginMethod(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
      impersonationSessionDuration: 60 * 60 * 24, // 1 day
      adminUserIds: ["user_id_1", "user_id_2"],
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "40aaafdf-3ebc-44fe-b11b-883e610a363b",
              slug: "Prexo-Pro",
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
      ],
    }),
  ],
  trustedOrigins: ["*"],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 30, // Cache duration in seconds
    },
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: "prexoai.xyz",
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request,
      ) => {
        // await sendEmail({
        //     to: user.email, // verification email must be sent to the current user email to approve the change
        //     subject: 'Approve email change',
        //     text: `Click the link to approve the change: ${url}`
        // })
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async (
        {
          user, // The user object
          url, // The auto-generated URL for deletion
          token, // The verification token  (can be used to generate custom URL)
        },
        request, // The original request object (optional)
      ) => {
        // Your email sending logic here
        // Example: sendEmail(data.user.email, "Verify Deletion", data.url);
      },
    },
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
        defaultValue: "user",
      },
      hashKey: {
        type: "string",
        required: false,
        defaultValue: generateHashKeyHex(),
      },
      lang: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
