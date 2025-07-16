'use client'

import { Sparkles } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-4 px-8 py-5">
      {/* Avatar */}
      <div className="flex-shrink-0 flex items-end">
        <div className="w-9 h-9 bg-gradient-to-br from-[#4285f4] via-[#9c27b0] to-[#ff9800] rounded-full flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
      {/* Content */}
      <div className="max-w-2xl flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-[#f1f3f4]">Gemini</span>
          <span className="text-xs text-[#b0b3b8]">thinking...</span>
        </div>
        <div className="rounded-2xl px-5 py-3 bg-[#23232a] flex items-center gap-2 min-w-[60px]">
          <span className="sr-only">Gemini is typing</span>
          <span className="block w-2 h-2 bg-[#b0b3b8] rounded-full animate-bounce [animation-delay:0ms]"></span>
          <span className="block w-2 h-2 bg-[#b0b3b8] rounded-full animate-bounce [animation-delay:150ms]"></span>
          <span className="block w-2 h-2 bg-[#b0b3b8] rounded-full animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  )
}