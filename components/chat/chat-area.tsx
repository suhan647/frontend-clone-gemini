'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useChatStore } from '@/store/chat'
import { Message } from './message'
import { TypingIndicator } from './typing-indicator'
import { MessageSkeleton } from '@/components/ui/loading-skeleton'
import { MessageInput } from './message-input'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatArea() {
  const { 
    currentChatroom, 
    messages, 
    isTyping, 
    chatrooms,
    loadMoreMessages 
  } = useChatStore()
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasScrolledUp, setHasScrolledUp] = useState(false)
  
  const currentMessages = currentChatroom ? messages[currentChatroom] || [] : []
  const currentChatroomData = chatrooms.find(room => room.id === currentChatroom)
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto' 
    })
  }, [])
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    
    const { scrollTop, scrollHeight, clientHeight } = container
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    
    setShowScrollButton(!isNearBottom && currentMessages.length > 0)
    setHasScrolledUp(scrollTop > 100)
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && currentChatroom && !isLoadingMore) {
      setIsLoadingMore(true)
      setTimeout(() => {
        loadMoreMessages(currentChatroom)
        setIsLoadingMore(false)
      }, 1000)
    }
  }, [currentMessages.length, currentChatroom, loadMoreMessages, isLoadingMore])
  
  // Auto-scroll on new messages (only if user hasn't scrolled up)
  useEffect(() => {
    if (!hasScrolledUp) {
      scrollToBottom()
    }
  }, [currentMessages.length, isTyping, scrollToBottom, hasScrolledUp])
  
  // Reset scroll state when changing chatrooms
  useEffect(() => {
    setHasScrolledUp(false)
    setTimeout(() => scrollToBottom(false), 100)
  }, [currentChatroom, scrollToBottom])
  
  if (!currentChatroom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Gemini
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a chat or create a new one to get started
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex-1 flex flex-col bg-[#18181b] relative">
      {/* Header */}
      <div className="p-6 bg-[#18181b]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4285f4] via-[#9c27b0] to-[#ff9800] rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-xl">
              {currentChatroomData?.title.charAt(0).toUpperCase() || 'C'}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-[#f1f3f4] text-lg leading-tight">
              {currentChatroomData?.title || 'Chat'}
            </h2>
            <p className="text-sm text-[#b0b3b8]">
              {isTyping ? 'Gemini is typing...' : 'Online'}
            </p>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-0 md:px-0 lg:px-0"
      >
        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="p-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-[#b0b3b8]">
              <div className="w-4 h-4 border-2 border-[#28282d] border-t-[#4285f4] rounded-full animate-spin" />
              Loading more messages...
            </div>
          </div>
        )}
        {/* Messages list */}
        <div className="space-y-0">
          {currentMessages.length === 0 ? (
            <div className="p-12 text-center text-[#b0b3b8]">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            currentMessages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}
          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => {
            scrollToBottom()
            setHasScrolledUp(false)
          }}
          className={cn(
            "absolute bottom-24 right-8 w-10 h-10 bg-[#4285f4] hover:bg-[#3367d6] text-white rounded-full",
            "flex items-center justify-center shadow-lg transition-all duration-200",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#4285f4]/20"
          )}
          title="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}
      {/* Message input */}
      <MessageInput />
    </div>
  )
}