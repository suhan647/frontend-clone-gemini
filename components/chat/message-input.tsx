'use client'

import { useState, useRef, useCallback } from 'react'
import { Send, Image, X } from 'lucide-react'
import { useChatStore } from '@/store/chat'
import { useAuthStore } from '@/store/auth'
import { Message } from '@/types'
import { generateId, throttle } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const AI_RESPONSES = [
  "I'm here to help! What would you like to know?",
  "That's an interesting question. Let me think about that...",
  "I can assist you with that. Here's what I think:",
  "Great question! Based on my understanding:",
  "I'd be happy to help you with that. Here's my response:",
  "That's a thoughtful inquiry. Let me provide some insights:",
  "I understand what you're asking. Here's my perspective:",
  "Thanks for your question. I can help explain that:",
  "I see what you're getting at. Let me break that down:",
  "That's something I can definitely help with. Here's my take:"
]

export function MessageInput() {
  const { currentChatroom, addMessage, setTyping, isTyping } = useChatStore()
  const { user } = useAuthStore()
  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const throttledSend = useCallback(
    throttle(() => {
      if (!input.trim() && !selectedImage) return
      if (!currentChatroom || !user) return
      
      // Add user message
      const userMessage: Message = {
        id: generateId(),
        content: input.trim(),
        isUser: true,
        timestamp: new Date(),
        image: selectedImage || undefined,
        chatroomId: currentChatroom
      }
      
      addMessage(userMessage)
      setInput('')
      setSelectedImage(null)
      toast.success('Message sent')
      
      // Show typing indicator
      setTyping(true)
      
      // Simulate AI response with delay
      const responseDelay = Math.random() * 2000 + 1000 // 1-3 seconds
      setTimeout(() => {
        const aiResponse: Message = {
          id: generateId(),
          content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
          isUser: false,
          timestamp: new Date(),
          chatroomId: currentChatroom
        }
        
        addMessage(aiResponse)
        setTyping(false)
      }, responseDelay)
    }, 1000), // Throttle to 1 second
    [input, selectedImage, currentChatroom, user, addMessage, setTyping]
  )
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isTyping) return
    throttledSend()
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please drop an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  if (!currentChatroom) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    )
  }
  
  return (
    <div className="bg-[#18181b]">
      {selectedImage && (
        <div className="p-4">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-xs max-h-32 rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-6 -right-6 w-14 h-14 bg-[#ff5252] text-white rounded-full flex items-center justify-center hover:bg-[#e53935] transition-colors shadow-lg text-4xl z-30 border-4 border-[#18181b]"
            >
              <X className="w-10 h-10" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4">
        <div
          className={cn(
            "relative flex items-end gap-3 p-3 rounded-2xl bg-[#23232a] shadow-md transition-colors",
            isDragging 
              ? "bg-[#1a237e]/10" 
              : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 flex items-center justify-center text-[#b0b3b8] hover:text-[#f1f3f4] hover:bg-[#28282d] rounded-lg transition-colors self-end"
            title="Upload image"
          >
            <Image className="w-6 h-6" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-[#f1f3f4] placeholder-[#b0b3b8] text-base px-2 py-1 min-h-[32px] max-h-40"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim() && !selectedImage}
            className="p-2 bg-gradient-to-r from-[#4285f4] to-[#9c27b0] text-white rounded-lg shadow-md hover:from-[#3367d6] hover:to-[#7b1fa2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center self-end"
            title="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}