export const TypingIndicator = () => {
  return (
    <div className="message bot typing">
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
      <div className="message-content">
        <div className="message-bubble typing-bubble">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
