import { useEffect, useRef, useState, type FormEvent } from 'react'

interface ChatMessage {
  id: number
  sender: 'user' | 'bot'
  text: string
}

const WELCOME = 'Hi! 👋 How can I help you today?'

const QUICK_QUESTIONS = [
  'How can I sell a pen?',
  'How do I upload a pen photo?',
  'How can I contact a seller?',
  'How do I create an account?',
  'How do I login?',
]

const ANSWERS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['sell', 'selling', 'list', 'listing'],
    answer:
      'To sell a pen, click "Sell a Pen" in the navigation, fill out the form (name, brand, description, condition, price), add a photo, and press "List Pen for Sale". It will then appear on the home page.',
  },
  {
    keywords: ['upload', 'photo', 'picture', 'image'],
    answer:
      'In the "Sell a Pen" form, open the "Pen Image" file input and choose an image from your device. You will see a preview before you list the pen.',
  },
  {
    keywords: ['contact', 'seller', 'sellers'],
    answer:
      'Open any pen from the home page by clicking "View Details", then press "Contact Seller". This opens an email or phone link with the seller\'s contact info.',
  },
  {
    keywords: ['register', 'account', 'sign up', 'create account'],
    answer:
      'Click "Login / Register" in the navigation, then choose "Register". Enter your full name, email, and a password (at least 6 characters), and your account is ready.',
  },
  {
    keywords: ['login', 'log in', 'sign in'],
    answer:
      'Click "Login / Register" in the navigation, enter your registered email and password, and press "Log in". You can then access My Listings and sell pens.',
  },
  {
    keywords: ['price', 'cost'],
    answer:
      'Prices are set by each seller in the listing. On the home page, use the "Price" filter (under $50, $50-$100, $100-$250, over $250) to browse by budget.',
  },
]

const DEFAULT_ANSWER =
  'I can help with selling pens, uploading photos, contacting sellers, and accounts. Try asking "How can I sell a pen?" or "How do I login?".'

function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
}

function getBotReply(text: string): string {
  const lower = text.toLowerCase()
  for (const { keywords, answer } of ANSWERS) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      return answer
    }
  }
  return DEFAULT_ANSWER
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 1, sender: 'bot', text: WELCOME },
  ])
  const bodyRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(2)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isOpen])

  const sendMessage = (raw: string) => {
    const text = raw.trim()
    if (!text) return

    const userMessage: ChatMessage = {
      id: nextId.current++,
      sender: 'user',
      text,
    }
    const botReply: ChatMessage = {
      id: nextId.current++,
      sender: 'bot',
      text: getBotReply(text),
    }
    setMessages((prev) => [...prev, userMessage, botReply])
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const showQuickQuestions = messages.length === 1

  return (
    <div className="chatbot">
      {isOpen && (
        <div
          className="chatbot__window"
          role="dialog"
          aria-label="PenMart Assistant"
        >
          <header className="chatbot__header">
            <span className="chatbot__title">PenMart Assistant</span>
            <button
              type="button"
              className="chatbot__close"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </button>
          </header>

          <div className="chatbot__body" ref={bodyRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot__msg chatbot__msg--${message.sender}`}
              >
                {message.text}
              </div>
            ))}

            {showQuickQuestions && (
              <div className="chatbot__quick">
                {QUICK_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="chatbot__chip"
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="chatbot__form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              aria-label="Type your message"
              autoComplete="off"
            />
            <button
              type="submit"
              className="chatbot__send"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chatbot__fab"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  )
}