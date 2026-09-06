import type { Suggestion } from './types'

export const WELCOME_MESSAGE =
  "Hi there 👋\nI'm PenMart AI. How can I help you today?"

export const SUGGESTIONS: Suggestion[] = [
  { id: 'sell', label: 'How can I sell a pen?' },
  { id: 'photo', label: 'How do I upload a pen photo?' },
  { id: 'contact', label: 'How can I contact a seller?' },
  { id: 'account', label: 'How do I create an account?' },
  { id: 'login', label: 'How do I login?' },
]

interface AnswerRule {
  keywords: string[]
  answer: string
}

const ANSWERS: AnswerRule[] = [
  {
    keywords: ['sell', 'selling', 'list', 'listing'],
    answer:
      'To sell a pen, click "Sell a Pen" in the navigation, fill out the form (name, brand, description, condition, price), add a photo, and press "List Pen for Sale". Your pen will then appear on the home page.',
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

export function getBotReply(text: string): string {
  const lower = text.toLowerCase()
  for (const { keywords, answer } of ANSWERS) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      return answer
    }
  }
  return DEFAULT_ANSWER
}