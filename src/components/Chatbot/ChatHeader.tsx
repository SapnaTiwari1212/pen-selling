import BotAvatar from './BotAvatar'
import { CloseIcon } from './icons'

interface ChatHeaderProps {
  onClose: () => void
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <header className="chatbot__header">
      <div className="chatbot__header-id">
        <BotAvatar size="header" />
        <div className="chatbot__header-text">
          <span className="chatbot__title">PenMart AI</span>
          <span className="chatbot__status">
            <span className="chatbot__status-dot" aria-hidden="true" />
            Online
          </span>
        </div>
      </div>
      <button
        type="button"
        className="chatbot__close"
        aria-label="Close chat"
        onClick={onClose}
      >
        <CloseIcon size={18} />
      </button>
    </header>
  )
}