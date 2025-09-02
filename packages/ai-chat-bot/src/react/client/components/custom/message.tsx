import type React from "react";
import type { UIMessage } from "ai";

interface MessageProps {
  message: UIMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`message ${message.role === "user" ? "user" : "bot"}`}>
      {message.role === "assistant" && (
        <div className="bot-avatar">
          <img
            src="https://raw.githubusercontent.com/plura-ai/prexo/refs/heads/main/apps/www/public/logo.png"
            className="w-10 h-10 rounded-lg object-cover invert"
            alt="Chat bot avatar"
            onError={(e) => {
              console.error("Failed to load image:", e);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      <div className="message-content">
        <div className="message-bubble">
          <p>{message.content}</p>
        </div>
        <div className="message-time">{formatTime(new Date())}</div>
      </div>
    </div>
  );
};
