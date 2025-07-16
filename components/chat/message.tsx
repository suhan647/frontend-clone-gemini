'use client'

import { useState } from 'react'
import { Copy, Check, User, Sparkles } from 'lucide-react'
import { Message as MessageType } from '@/types'
import { formatTime, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface MessageProps {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [showCopy, setShowCopy] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast.success('Message copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }
  
  return (
    <div
      className={cn(
        "group flex gap-4 px-8 py-5 transition-colors relative mt-6 first:mt-10",
        message.isUser
          ? "justify-end"
          : "justify-start"
      )}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      {/* Avatar */}
      {!message.isUser && (
        <div className="flex-shrink-0 flex items-end">
          <div className="w-9 h-9 bg-gradient-to-br from-[#4285f4] via-[#9c27b0] to-[#ff9800] rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      {/* Content */}
      <div className={cn(
        "max-w-2xl min-w-[60px] flex flex-col",
        message.isUser ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-[#f1f3f4]">
            {message.isUser ? 'You' : 'Gemini'}
          </span>
          <span className="text-xs text-[#b0b3b8]">
            {formatTime(message.timestamp)}
          </span>
        </div>
        {/* Image if present */}
        {message.image && (
          <div className="mb-3">
            <img
              src={message.image}
              alt="Uploaded image"
              className="max-w-xs rounded-xl border border-[#28282d]"
            />
          </div>
        )}
        {/* Text content */}
        <div className={cn(
          "rounded-2xl px-5 py-3 text-base leading-relaxed whitespace-pre-wrap shadow-sm",
          message.isUser
            ? "bg-gradient-to-r from-[#4285f4] to-[#9c27b0] text-white text-right"
            : "bg-[#23232a] text-[#f1f3f4] text-left"
        )}>
          {message.content}
        </div>
      </div>
      {/* Avatar for user */}
      {message.isUser && (
        <div className="flex-shrink-0 flex items-end">
          <div className="w-9 h-9 bg-gradient-to-br from-[#4285f4] via-[#9c27b0] to-[#ff9800] rounded-full flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      {/* Copy button */}
      <div className={cn(
        "absolute top-2",
        message.isUser ? "right-16" : "left-16"
      )}>
        {(showCopy || copied) && (
          <button
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-lg transition-all duration-200 shadow-md",
              copied
                ? "bg-green-100 text-green-600"
                : "bg-[#23232a] text-[#b0b3b8] hover:bg-[#28282d] hover:text-[#f1f3f4]"
            )}
            title={copied ? "Copied!" : "Copy message"}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}