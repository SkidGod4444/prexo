export { PrexoAiChatBot } from "./components/custom/chat.widget";
export type { PrexoAiChatBotProps } from "./components/custom/chat.widget";

// Global window integration for HTML embedding
declare global {
  interface Window {
    PrexoAiChatBot: {
      init: (config: GlobalChatConfig) => void;
      destroy: () => void;
    };
  }
}

interface GlobalChatConfig {
  apiKey: string;
  // theme?: "light" | "dark";
  user?: {
    name: string | "Prexo Ai";
    pfp:
      | string
      | "../../logo.png";
    lastSeen: Date;
  };
  placeholder?: string;
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
          import("./components/custom/chat.widget").then(
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
