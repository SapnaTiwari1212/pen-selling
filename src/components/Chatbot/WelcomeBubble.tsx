interface WelcomeBubbleProps {
  onStartChat: () => void
}

export default function WelcomeBubble({ onStartChat }: WelcomeBubbleProps) {
  return (
    <button
      type="button"
      className="chatbot__bubble"
      onClick={onStartChat}
      aria-label="Open chat with PenMart AI"
    >
      <span className="chatbot__bubble-text">
        <span className="chatbot__bubble-hello">Hi there 👋</span>
        <span className="chatbot__bubble-body">
          You are now speaking with PenMart AI. How can I help?
        </span>
        <span className="chatbot__bubble-meta">PenMart AI • Just now</span>
      </span>
      <span className="chatbot__bubble-arrow" aria-hidden="true" />
    </button>
  )
}