export type Sender = 'user' | 'bot'

export interface ChatMessage {
  id: number
  sender: Sender
  text: string
}

export interface Suggestion {
  id: string
  label: string
}