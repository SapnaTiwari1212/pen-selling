import { BotIcon } from './icons'

type AvatarSize = 'header' | 'md' | 'sm'

interface BotAvatarProps {
  size?: AvatarSize
}

export default function BotAvatar({ size = 'md' }: BotAvatarProps) {
  return (
    <span
      className={`chatbot__avatar chatbot__avatar--${size}`}
      aria-hidden="true"
    >
      <BotIcon size={size === 'sm' ? 16 : 18} />
    </span>
  )
}