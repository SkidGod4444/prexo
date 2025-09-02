export const DEFAULT_CHAT_SESSION_ID = (id?: string) =>
  `prexo-chat-session/${id ? id : "default"}`;

export const DEFAULT_HISTORY_LENGTH = 50;
export const DEFAULT_HISTORY_TTL = 86_400;

export const DEFAULT_MSG_ID = `msg-${Date.now().toString()}`;
export const DEFAULT_SIMILARITY_THRESHOLD = 0.5;
export const DEFAULT_TOP_K = 5;
