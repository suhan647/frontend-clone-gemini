'use client'

import { useState } from 'react'
import { Menu, Plus, Search, Settings, HelpCircle, MessageSquare, Sparkles, Heart } from 'lucide-react'
import { useChatStore } from '@/store/chat'
import { useAuthStore } from '@/store/auth'
import { formatDate, generateId } from '@/lib/utils'
import { Chatroom } from '@/types'

export function Sidebar() {
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

  const filteredChatrooms = chatrooms.filter(room => 
    room.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewChat = () => {
    if (!user) return
    
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

  return (
    <div className={`bg-[#18181b] flex flex-col h-screen transition-all duration-200 shadow-lg pt-7 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
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
              <span className="text-[#f1f3f4] font-semibold text-xl tracking-tight">Gemini</span>
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
          onClick={handleNewChat}
          className={`w-full flex items-center p-0 ${
            isCollapsed ? 'justify-center h-14' : 'gap-3 p-3'
          } hover:bg-[#23232a] rounded-lg transition-colors group font-medium text-base`}
        >
          <Plus className={`${isCollapsed ? 'w-8 h-8' : 'w-5 h-5'} text-[#b0b3b8] group-hover:text-[#f1f3f4]`} />
          {!isCollapsed && (
            <span className="text-[#b0b3b8] group-hover:text-[#f1f3f4]">New chat</span>
          )}
        </button>
      </div>
      {/* Explore Gems */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <button className="w-full flex items-center gap-3 p-3 hover:bg-[#23232a] rounded-lg transition-colors group font-medium text-base">
            <Heart className="w-5 h-5 text-[#b0b3b8] group-hover:text-[#f1f3f4]" />
            <span className="text-[#b0b3b8] group-hover:text-[#f1f3f4]">Explore Gems</span>
          </button>
        </div>
      )}
      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="flex items-center h-10 bg-[#232129] rounded-lg relative">
            <span className="absolute left-3 flex items-center h-full"><Search className="w-5 h-5 text-[#b0b3b8]" /></span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-transparent rounded-lg text-[#b0b3b8] placeholder-[#b0b3b8] focus:outline-none text-base border-none"
              style={{boxShadow: 'none'}}
            />
          </div>
        </div>
      )}
      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-4 pb-2">
            <h3 className="text-[#b0b3b8] text-xs font-semibold uppercase tracking-wider">Recent</h3>
          </div>
        )}
        <div className={`space-y-1 ${isCollapsed ? 'px-0 pt-2' : 'px-2'}`}>
          {filteredChatrooms.map((chatroom) => (
            <button
              key={chatroom.id}
              onClick={() => setCurrentChatroom(chatroom.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center h-14' : 'gap-3 p-2'} rounded-lg transition-colors text-left group relative font-medium text-base ${
                currentChatroom === chatroom.id
                  ? 'bg-[#23232a] text-[#f1f3f4] shadow-inner'
                  : 'hover:bg-[#23232a] text-[#b0b3b8] hover:text-[#f1f3f4]'
              }`}
            >
              <MessageSquare className={`${isCollapsed ? 'w-7 h-7' : 'w-5 h-5'} flex-shrink-0`} />
              {!isCollapsed && (
                <span className="truncate text-base font-medium">
                  {chatroom.title}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Bottom Actions */}
      <div className="p-4 space-y-1">
        <button className={`w-full flex items-center gap-3 p-2 hover:bg-[#23232a] rounded-lg transition-colors text-[#b0b3b8] hover:text-[#f1f3f4] font-medium text-base ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="text-base">Settings & help</span>}
        </button>
      </div>
    </div>
  )
}