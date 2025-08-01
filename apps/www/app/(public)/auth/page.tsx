"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconBrandGoogle,
  IconBrandGithub,
  IconBrandDiscord,
} from "@tabler/icons-react";
import { authClient } from "@prexo/auth/client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TermsAndConditionsDialog from "@/components/custom/terms-and-co";
import { useLocalStorage } from "usehooks-ts";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [lastUsedProvider, setLastUsedProvider] = useLocalStorage(
    "@prexo-#lastUsedProvider",
    "",
  );

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/onboarding"
      : "https://prexoai.xyz/onboarding";

  const callbackUrl =
    redirectUrl && redirectUrl.startsWith("/")
      ? `${baseUrl}?redirect=${encodeURIComponent(redirectUrl)}`
      : baseUrl;

  const handleAuth = async (provider: "github" | "discord" | "google") => {
    switch (provider) {
      case "google":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: callbackUrl,
          fetchOptions: {
            onSuccess() {
              console.log("Successfully signed in with Google");
            },
            onError(error) {
              console.error("Error signing in with Google:", error);
            },
          },
        });
        setLastUsedProvider(provider);
        break;
      case "github":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: callbackUrl,
          fetchOptions: {
            onSuccess() {
              console.log("Successfully signed in with GitHub");
            },
            onError(error) {
              console.error("Error signing in with GitHub:", error);
            },
          },
        });
        setLastUsedProvider(provider);
        break;
      case "discord":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: callbackUrl,
          fetchOptions: {
            onSuccess() {
              console.log("Successfully signed in with Discord");
            },
            onError(error) {
              console.error("Error signing in with Discord:", error);
            },
          },
        });
        setLastUsedProvider(provider);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-bold">Agents, Everywhere</h2>
                <p className="text-white/75">
                  Experience seamless customer support and sales with Prexo
                  Agents—try it free!
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={() => handleAuth("google")}
                >
                  <IconBrandGoogle size="10" />
                  Continue with Google
                  {lastUsedProvider === "google" && (
                    <span className="text-muted-foreground text-sm">
                      (last used)
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={() => handleAuth("github")}
                >
                  <IconBrandGithub size="10" />
                  Continue with Github
                  {lastUsedProvider === "github" && (
                    <span className="text-muted-foreground text-sm">
                      (last used)
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={() => handleAuth("discord")}
                >
                  <IconBrandDiscord size="10" />
                  Continue with Discord
                  {lastUsedProvider === "discord" && (
                    <span className="text-muted-foreground text-sm">
                      (last used)
                    </span>
                  )}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t" />
            </div>
          </form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <TermsAndConditionsDialog />{" "}
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
