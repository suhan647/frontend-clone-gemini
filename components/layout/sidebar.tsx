'use client'

import { useState, useEffect } from 'react'
import { Menu, Plus, Search, Settings, HelpCircle, MessageSquare, Sparkles, Heart, Trash2 } from 'lucide-react'
import { useChatStore } from '@/store/chat'
import { useAuthStore } from '@/store/auth'
import { formatDate, generateId } from '@/lib/utils'
import { Chatroom } from '@/types'
import { LoginForm } from '@/components/auth/login-form'

export * from '../chat/sidebar'

function Sidebar() {
  const { 
    chatrooms, 
    currentChatroom, 
    searchQuery, 
    addChatroom, 
    setCurrentChatroom, 
    setSearchQuery,
    deleteChatroom 
  } = useChatStore()
  const { user } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [pendingNewChat, setPendingNewChat] = useState(false)

  const filteredChatrooms = chatrooms.filter(room => 
    room.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewChat = () => {
    if (!user) {
      setShowLogin(true)
      setPendingNewChat(true)
      return
    }
    
    const newChatroom: Chatroom = {
      id: generateId(),
      title: 'New Chat',
      lastMessageTime: new Date(),
      createdAt: new Date(),
      userId: user.id
    }
    
    addChatroom(newChatroom)
    setCurrentChatroom(newChatroom.id)
  }

  useEffect(() => {
    if (pendingNewChat && user) {
      setPendingNewChat(false)
      const newChatroom: Chatroom = {
        id: generateId(),
        title: 'New Chat',
        lastMessageTime: new Date(),
        createdAt: new Date(),
        userId: user.id
      }
      addChatroom(newChatroom)
      setCurrentChatroom(newChatroom.id)
      setShowLogin(false)
    }
  }, [pendingNewChat, user])

  const handleLoginSuccess = () => {
    setShowLogin(false)
    // No need to create chat here, useEffect will handle it
  }

  return (
    <div className={`flex flex-col h-screen transition-all duration-200 shadow-lg pt-7 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`} style={{ background: 'var(--gemini-sidebar)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 min-h-[64px]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-[#23232a] rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-[#b0b3b8]" />
        </button>
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <div className="w-7 h-7 bg-gradient-to-r from-[#4285f4] via-[#9c27b0] to-[#ff9800] rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-xl tracking-tight" style={{ color: 'var(--gemini-text-primary)' }}>Gemini</span>
            </div>
            <div className="flex items-center gap-1">
              {/* <span className="text-[#b0b3b8] text-base font-medium">2.5 Pro</span> */}
              <div className="w-2 h-2 bg-gradient-to-r from-[#4285f4] to-[#9c27b0] rounded-full"></div>
            </div>
          </>
        )}
      </div>
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={isCollapsed ? () => setIsCollapsed(false) : handleNewChat}
          className={`w-full flex items-center p-0 ${
            isCollapsed ? 'justify-center h-14' : 'gap-3 p-3'
          } hover:bg-[var(--gemini-hover)] rounded-lg transition-colors group font-medium text-base`}
        >
          <Plus className={`${isCollapsed ? 'w-8 h-8' : 'w-5 h-5'} text-[var(--gemini-text-secondary)] group-hover:text-[var(--gemini-text-primary)]`} />
          {!isCollapsed && (
            <span className="text-[var(--gemini-text-secondary)] group-hover:text-[var(--gemini-text-primary)]">New chat</span>
          )}
        </button>
        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative">
              <LoginForm onLoginSuccess={handleLoginSuccess} />
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                onClick={() => setShowLogin(false)}
                aria-label="Close login modal"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Explore Gems */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <button className="w-full flex items-center gap-3 p-3 hover:bg-[var(--gemini-hover)] rounded-lg transition-colors group font-medium text-base">
            <Heart className="w-5 h-5 text-[var(--gemini-text-secondary)] group-hover:text-[var(--gemini-text-primary)]" />
            <span className="text-[var(--gemini-text-secondary)] group-hover:text-[var(--gemini-text-primary)]">Explore Gems</span>
          </button>
        </div>
      )}
      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="flex items-center h-10 rounded-lg relative" style={{ background: 'var(--gemini-hover)' }}>
            <span className="absolute left-3 flex items-center h-full"><Search className="w-5 h-5 text-[var(--gemini-text-secondary)]" /></span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-transparent rounded-lg text-[var(--gemini-text-secondary)] placeholder-[var(--gemini-text-secondary)] focus:outline-none text-base border-none"
              style={{boxShadow: 'none'}} 
            />
          </div>
        </div>
      )}
      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <>
            <div className="px-4 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gemini-text-secondary)' }}>Recent</h3>
            </div>
            <div className="space-y-1 px-2"> 
              {filteredChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  className="group w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left relative font-medium text-base cursor-pointer hover:bg-[var(--gemini-hover)]"
                >
                  <button
                    onClick={() => setCurrentChatroom(chatroom.id)}
                    className={`flex items-center gap-3 flex-1 text-left ${
                      currentChatroom === chatroom.id
                        ? ''
                        : 'hover:text-[var(--gemini-text-primary)]'
                    }`}
                    style={{ color: currentChatroom === chatroom.id ? 'var(--gemini-text-primary)' : 'var(--gemini-text-secondary)' }}
                  >
                    <MessageSquare className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate text-base font-medium">
                      {chatroom.title}
                    </span>
                  </button>
                  <button
                    onClick={() => deleteChatroom(chatroom.id)}
                    className="ml-2 p-1 rounded hover:bg-[var(--gemini-hover)] text-[var(--gemini-text-secondary)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Bottom Actions */}
      <div className="p-4 space-y-1">
        <button className={`w-full flex items-center gap-3 p-2 hover:bg-[var(--gemini-hover)] rounded-lg transition-colors text-[var(--gemini-text-secondary)] hover:text-[var(--gemini-text-primary)] font-medium text-base ${
          isCollapsed ? 'justify-center' : ''
        }`}
          onClick={isCollapsed ? () => setIsCollapsed(false) : undefined}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="text-base">Settings & help</span>}
        </button>
      </div>
    </div>
  )
}