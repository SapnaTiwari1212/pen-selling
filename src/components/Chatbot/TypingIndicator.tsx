import BotAvatar from './BotAvatar'

export default function TypingIndicator() {
  return (
    <div className="chatbot__row chatbot__row--bot">
      <BotAvatar size="sm" />
      <span className="chatbot__typing" role="status" aria-label="PenMart AI is typing">
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}