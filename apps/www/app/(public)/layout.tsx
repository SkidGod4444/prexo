import { SiteFooter } from "@/components/custom/site/footer/footer";
import { Navbar } from "@/components/custom/site/navbar/navbar";
import { PrexoAiChatBot } from "@prexo/ai-chat-bot/react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const suggestedActions = [
  {
    label: "What is the context?",
    action: "I would like to know about what context you have.",
  },
];

const apiKey = process.env.PREXO_API_KEY;
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const vectorUrl = process.env.UPSTASH_VECTOR_REST_URL;
const vectorToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col items-center w-full min-h-screen border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x px-2 md:px-5">
      <Navbar />
      {children}
      <SiteFooter />
      <PrexoAiChatBot
        sessionId="009"
        apiKey={apiKey!}
        model={"mistralai/mistral-small-3.2-24b-instruct:free"}
        container_id="saidev"
        suggestedActions={suggestedActions}
        {...(redisUrl &&
          redisToken && { redis: { url: redisUrl, token: redisToken } })}
        // {...(vectorUrl &&
        //   vectorToken && {
        //     vector: { url: vectorUrl, token: vectorToken },
        //   })}
      />
    </div>
  );
}
