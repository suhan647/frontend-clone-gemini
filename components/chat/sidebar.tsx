'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, MoreVertical, Trash2, Moon, Sun, LogOut } from 'lucide-react'
import { useChatStore } from '@/store/chat'
import { useAuthStore } from '@/store/auth'
import { ChatroomSkeleton } from '@/components/ui/loading-skeleton'
import { formatDate, generateId, debounce } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Chatroom } from '@/types'

export function Sidebar() {
  const { 
    chatrooms, 
    currentChatroom, 
    searchQuery, 
    isDarkMode,
    addChatroom, 
    setCurrentChatroom, 
    setSearchQuery, 
    toggleDarkMode,
    deleteChatroom 
  } = useChatStore()
  const { user, logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    [setSearchQuery]
  )
  
  const filteredChatrooms = useMemo(() => {
    if (!searchQuery.trim()) return chatrooms
    return chatrooms.filter(room => 
      room.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [chatrooms, searchQuery])
  
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
    toast.success('New chat created')
  }
  
  const handleDeleteChatroom = (chatroomId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChatroom(chatroomId)
    setActiveDropdown(null)
    toast.success('Chat deleted')
  }
  
  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }
  
  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Gemini</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
        >
          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">New Chat</span>
        </button>
      </div>
      
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-1">
            {Array(5).fill(0).map((_, i) => (
              <ChatroomSkeleton key={i} />
            ))}
          </div>
        ) : filteredChatrooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                onClick={() => setCurrentChatroom(chatroom.id)}
                className={cn(
                  "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  currentChatroom === chatroom.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">
                    {chatroom.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {chatroom.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatDate(chatroom.lastMessageTime)}
                    </span>
                  </div>
                  {chatroom.lastMessage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {chatroom.lastMessage}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveDropdown(activeDropdown === chatroom.id ? null : chatroom.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {activeDropdown === chatroom.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={(e) => handleDeleteChatroom(chatroom.id, e)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.phone.slice(-2) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.phone || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}