"use client";
import { SiteFooter } from "@/components/custom/site/footer/footer";
import { Navbar } from "@/components/custom/site/navbar/navbar";
import { PrexoAiChatBot } from "@prexo/ai-chat-sdk";
import { useMyProfileStore } from "@prexo/store";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const suggestedActions = [
  {
    label: "What is the context?",
    action: "I would like to know about what context you have.",
  }
];

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const vectorUrl = process.env.UPSTASH_VECTOR_REST_URL;
const vectorToken = process.env.UPSTASH_VECTOR_REST_TOKEN;
const namespace = "saidev";

export default function PublicLayout({ children }: PublicLayoutProps) {
  const {myProfile} = useMyProfileStore();
  const sessionId = myProfile && myProfile?.id;
  console.log("Session ID:", sessionId);

  return (
    <div className="flex flex-col items-center w-full min-h-screen border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x px-2 md:px-5">
      <Navbar />
      {children}
      <SiteFooter />
      <PrexoAiChatBot
        // width={380}
        // height={550}
        apiKey={process.env.PREXO_API_KEY!}
        suggestedActions={suggestedActions}
        sessionId={sessionId!}
        {...(redisUrl &&
          redisToken && { redis: { url: redisUrl, token: redisToken } })}
        {...(vectorUrl &&
          vectorToken &&
          namespace && {
            vector: { url: vectorUrl, token: vectorToken, namespace },
          })}
      />
    </div>
  );
}
