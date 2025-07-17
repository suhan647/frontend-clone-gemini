'use client'

import { useState } from 'react'
import { Copy, Check, User, Sparkles, ThumbsUp, ThumbsDown, Share, MoreVertical } from 'lucide-react'
import { Message as MessageType } from '@/types'
import { formatTime } from '@/lib/utils'

interface ChatMessageProps {
  message: MessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Handle error silently
    }
  }

  return (
    <div 
      className="message message-enter group "
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`avatar ${message.isUser ? 'avatar-user' : 'avatar-gemini'}`}>
            {message.isUser ? (
              <span>You</span>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-medium text-sm" style={{ color: 'var(--gemini-text-primary)' }}>
              {message.isUser ? 'You' : 'Gemini'}
            </span>
            <span className="text-xs" style={{ color: 'var(--gemini-text-secondary)' }}>
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* Image if present */}
          {message.image && (
            <div className="mb-4">
              <img
                src={message.image}
                alt="Uploaded content"
                className="max-w-md rounded-lg border" style={{ borderColor: 'var(--gemini-border)' }}
              />
            </div>
          )}

          {/* Text content */}
          <div className="message-content">
            <div className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--gemini-text-primary)' }}>
              {message.content}
            </div>
          </div>

          {/* Message Actions */}
          {!message.isUser && (
            <div className="message-actions">
              <button
                onClick={handleCopy}
                className={`action-button ${copied ? 'active' : ''}`}
                title={copied ? 'Copied!' : 'Copy'}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                className="action-button"
                title="Good response"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>

              <button
                className="action-button"
                title="Bad response"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>

              <button
                className="action-button"
                title="Share"
              >
                <Share className="w-4 h-4" />
              </button>

              <button
                className="action-button"
                title="More"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}