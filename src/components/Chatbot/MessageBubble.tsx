import type { ChatMessage } from './types'
import BotAvatar from './BotAvatar'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.sender === 'bot'

  return (
    <div className={`chatbot__row chatbot__row--${message.sender}`}>
      {isBot && <BotAvatar size="sm" />}
      <div className={`chatbot__bubble chatbot__bubble--${message.sender}`}>
        {message.text}
      </div>
    </div>
  )
}