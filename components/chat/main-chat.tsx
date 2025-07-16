'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react'
import { useChatStore } from '@/store/chat'
import { useAuthStore } from '@/store/auth'
import { Message } from '@/types'
import { generateId } from '@/lib/utils'
import { ChatMessage } from './chat-message'
import { TypingIndicator } from './typing-indicator'

const AI_RESPONSES = [
  "Of course! Creating a direct clone of a state-of-the-art large language model (LLM) like Google's Gemini is an incredibly complex and resource-intensive endeavor, typically undertaken by large, well-funded research organizations. However, you can certainly build powerful AI applications with similar capabilities or even train your own smaller, specialized model.\n\nHere's a breakdown of how you can approach this, from the most practical methods to the most complex:",
  "For most developers and creators, the fastest and most effective way to build \"a clone of Gemini\" is to use the **Google Gemini API**. This allows you to leverage the power of the actual Gemini model in your own applications without needing to worry about the immense challenges of building and training a model from the ground up.\n\n**What You Can Do with the API:**\n\n• **Build a chatbot:** Create a conversational AI for customer service, a personal assistant, or a unique character.\n• **Content generation:** Develop tools that write articles, marketing copy, emails, or code.\n• **Summarization and analysis:** Build applications that can summarize long documents, analyze sentiment, and extract key information.",
  "I'd be happy to help you explore different approaches to building AI applications. What specific functionality are you most interested in implementing?",
  "That's a great question! Let me break down the key components you'd need to consider when building an AI assistant like Gemini.",
  "The Practical Path: Use theSend Gemini API\n\nFor most developers and creators, the fastest and most effective way to build \"a clone of Gemini\" is to use the Google Gemini API. This allows you to leverage the power of the actual Gemini model in your own applications without needing to worry about the immense challenges of building and training a model from the ground up.",
]

export function MainChat() {
  const { 
    currentChatroom, 
    messages, 
    isTyping, 
    chatrooms,
    addMessage, 
    setTyping,
    updateChatroomTitle 
  } = useChatStore()
  const { user } = useAuthStore()
  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentMessages = currentChatroom ? messages[currentChatroom] || [] : []
  const currentChatroomData = chatrooms.find(room => room.id === currentChatroom)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages.length, isTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !selectedImage) return
    if (!currentChatroom || !user) return

    const userMessage: Message = {
      id: generateId(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
      image: selectedImage || undefined,
      chatroomId: currentChatroom
    }

    // Update chatroom title with first user message if it's "New Chat"
    if (currentChatroomData?.title === 'New Chat' && input.trim()) {
      const title = input.trim().length > 30 ? input.trim().substring(0, 30) + '...' : input.trim()
      updateChatroomTitle(currentChatroom, title)
    }

    addMessage(userMessage)
    setInput('')
    setSelectedImage(null)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Show typing indicator
    setTyping(true)

    // Simulate AI response
    const responseDelay = Math.random() * 2000 + 1500
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
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  if (!currentChatroom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#131314] text-center px-6">
        <div className="mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#4285f4] via-[#9c27b0] to-[#ff9800] rounded-full flex items-center justify-center mb-6 mx-auto">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-light text-[#e3e3e3] mb-3">Hello</h1>
          <p className="text-[#9aa0a6] text-xl">How can I help you today?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
          {[
            "Write a story about a magic backpack",
            "Create a content calendar for a TikTok account", 
            "Make a travel itinerary for a city",
            "Help me understand quantum physics"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                const newChatroom = {
                  id: generateId(),
                  title: suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion,
                  lastMessageTime: new Date(),
                  createdAt: new Date(),
                  userId: user?.id || ''
                }
                // Add chatroom and set as current
                // Then add the suggestion as first message
              }}
              className="p-6 bg-[#1e1f20] hover:bg-[#2d2e30] border border-[#3c4043] rounded-xl text-left transition-colors"
            >
              <span className="text-[#e3e3e3] text-sm leading-relaxed">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#131314]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 ">
        <div className="flex items-center gap-3">
          <span className="text-[#e3e3e3] font-medium text-lg">
            {currentChatroomData?.title || 'New Chat'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#8ab4f8] hover:bg-[#7aa3f7] text-[#131314] rounded-lg text-sm font-medium transition-colors">
            Upgrade
          </button>
          <div className="w-8 h-8 bg-[#8ab4f8] rounded-full flex items-center justify-center">
            <span className="text-[#131314] font-medium text-sm">S</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto ">
        <div className="chat-container py-6 !mt-10">
          <div className="space-y-8">
            {currentMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          {selectedImage && (
            <div className="mb-4">
              <div className="relative inline-block">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-xs max-h-32 rounded-lg border border-[#3c4043]"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#ea4335] text-white rounded-full flex items-center justify-center hover:bg-[#d93025] transition-colors text-sm"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
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
                className="input-button"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  autoResize(e)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini"
                disabled={isTyping}
                className="input-textarea"
                rows={1}
              />
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="input-button"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isTyping}
                  className="input-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
          
          <p className="text-[#9aa0a6] text-xs text-center mt-3">
            Gemini can make mistakes, so double-check it
          </p>
        </div>
      </div>
    </div>
  )
}