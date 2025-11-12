"use client"

interface ChatMessageProps {
  text: string
  sender: "user" | "other"
  timestamp: string
  avatar?: string
  name?: string
}

export default function ChatMessage({ text, sender, timestamp, avatar, name }: ChatMessageProps) {
  const isUser = sender === "user"

  return (
    <div className={`flex gap-3 mb-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar for received messages */}
      {!isUser && avatar && (
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-1 ring-border/40"
        />
      )}

      {/* Message Bubble */}
      <div className={`flex max-w-[20rem] flex-col ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && name && <span className="mb-0.5 text-sm font-semibold text-foreground">{name}</span>}
        <div
          className={`rounded-xl px-3 py-1.5 text-xs shadow-sm ${
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border border-border/60 bg-background/80 text-foreground"
          }`}
        >
          {text}
        </div>
        <span className="mt-0.5 text-xs text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  )
}
