import { useEffect, useRef, useState, type FormEvent } from 'react'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import WelcomeBubble from './WelcomeBubble'
import { ChatIcon, CloseIcon, SendIcon } from './icons'
import { getBotReply, SUGGESTIONS, WELCOME_MESSAGE } from './responses'
import type { ChatMessage } from './types'

const CLOSE_ANIMATION_MS = 200

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 1, sender: 'bot', text: WELCOME_MESSAGE },
  ])
  const bodyRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(2)
  const pendingReplies = useRef(0)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, isOpen])

  const open = () => {
    window.clearTimeout(closeTimer.current)
    setClosing(false)
    setIsOpen(true)
  }

  const close = () => {
    if (closing) return
    setClosing(true)
    closeTimer.current = window.setTimeout(() => {
      setIsOpen(false)
      setClosing(false)
    }, CLOSE_ANIMATION_MS)
  }

  const toggle = () => (isOpen ? close() : open())

  const sendMessage = (raw: string) => {
    const text = raw.trim()
    if (!text) return

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, sender: 'user', text },
    ])
    setTyping(true)
    pendingReplies.current += 1

    window.setTimeout(() => {
      pendingReplies.current = Math.max(0, pendingReplies.current - 1)
      if (pendingReplies.current === 0) {
        setTyping(false)
      }
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, sender: 'bot', text: getBotReply(text) },
      ])
    }, 800)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const canSend = input.trim().length > 0
  const showSuggestions = messages.length === 1 && !typing

  return (
    <div className="chatbot">
      {isOpen && (
        <section
          className={`chatbot__window ${closing ? 'is-closing' : ''}`}
          role="dialog"
          aria-label="PenMart AI chat"
        >
          <ChatHeader onClose={close} />

          <div className="chatbot__body" ref={bodyRef}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {typing && <TypingIndicator />}

            {showSuggestions && (
              <div className="chatbot__suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="chatbot__suggestion"
                    onClick={() => sendMessage(suggestion.label)}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="chatbot__inputbar" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              aria-label="Type your message"
              autoComplete="off"
            />
            <button
              type="submit"
              className="chatbot__send"
              aria-label="Send message"
              disabled={!canSend}
            >
              <SendIcon />
            </button>
          </form>
        </section>
      )}

      {!isOpen && !closing && <WelcomeBubble onStartChat={open} />}

      <button
        type="button"
        className="chatbot__fab"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onClick={toggle}
      >
        {isOpen ? <CloseIcon size={22} /> : <ChatIcon />}
      </button>
    </div>
  )
}