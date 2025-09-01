// Main entry point for the Prexo AI Chat Bot SDK
export { PrexoAiChatBot } from "../src/react/client/components/custom/chat.widget";
export type { PrexoAiChatBotProps } from "../src/react/client/components/custom/chat.widget";

// Export types
export type { AIModelsFreeTierId, AIModelsFreeTier } from "./lib/types";

// Export constants
export { 
  DEFAULT_CHAT_SESSION_ID,
  DEFAULT_HISTORY_LENGTH,
  DEFAULT_HISTORY_TTL,
  DEFAULT_MSG_ID,
  DEFAULT_SIMILARITY_THRESHOLD,
  DEFAULT_TOP_K
} from "./lib/constants";

// Export utilities
export { cn } from "./lib/utils";

// Export hooks
export { useLocalStorage } from "./react/hooks/use.local.store";

// Export UI components
export { Avatar, AvatarFallback, AvatarImage } from "../src/react/client/components/ui/avatar";
export { Button, buttonVariants } from "../src/react/client/components/ui/button";
export { Input } from "../src/react/client/components/ui/input";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../src/react/client/components/ui/tooltip";

// Export custom components
export { Message } from "../src/react/client/components/custom/message";
export { TypingIndicator } from "../src/react/client/components/custom/typing.indicator";
export { ChatInput } from "../src/react/client/components/custom/chat.input";
export { SuggestedActions } from "../src/react/client/components/custom/suggested.actions";

// Re-export client index for backward compatibility
export * from "../src/react/client/index";

interface GlobalChatConfig {
  apiKey: string;
  user?: {
    name: string | "Prexo Ai";
    pfp: string | "../../logo.png";
    lastSeen: Date;
  };
  model?: "deepseek/deepseek-chat-v3-0324:free" | "openai/gpt-oss-20b:free" | "meta-llama/Llama-3.3-70B-Instruct-Turbo:free" | "google/gemini-2.0-flash-exp:free" | "google/gemma-3n-e4b-it:free" | "mistralai/mistral-small-3.2-24b-instruct:free";
  placeholder?: string;
  telementry?: { enabled: boolean };
  botName?: string;
  width?: number | string;
  height?: number | string;
  position?: "bottom-right" | "bottom-left";
  mountId?: string;
  onClose?: () => void;
}

// Only run in browser environment
if (typeof window !== "undefined") {
  let chatInstance: any = null;
  let mountElement: HTMLElement | null = null;

  window.PrexoAiChatBot = {
    init: (config: GlobalChatConfig) => {
      // Dynamic import to avoid SSR issues
      import("react").then((React) => {
        import("react-dom/client").then((ReactDOM) => {
          import("../src/react/client/components/custom/chat.widget").then(
            ({ PrexoAiChatBot }) => {
              const { mountId = "prexo-ai-chat-sdk-root", ...chatProps } =
                config;

              // Find or create mount element
              mountElement = document.getElementById(mountId);
              if (!mountElement) {
                mountElement = document.createElement("div");
                mountElement.id = mountId;
                document.body.appendChild(mountElement);
              }

              // Create React root and render
              const root = ReactDOM.createRoot(mountElement);
              chatInstance = root;

              root.render(
                React.createElement(PrexoAiChatBot, {
                  ...chatProps,
                  onClose: () => {
                    config.onClose?.();
                    window.PrexoAiChatBot.destroy();
                  },
                }),
              );
            },
          );
        });
      });
    },

    destroy: () => {
      if (chatInstance && mountElement) {
        chatInstance.unmount();
        if (mountElement.parentNode) {
          mountElement.parentNode.removeChild(mountElement);
        }
        chatInstance = null;
        mountElement = null;
      }
    },
  };
}
