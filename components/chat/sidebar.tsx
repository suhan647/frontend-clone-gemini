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

export function Sidebar({ setMobileSidebarOpen }: { setMobileSidebarOpen?: (open: boolean) => void }) {
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
    if (setMobileSidebarOpen && window.innerWidth < 1024) setMobileSidebarOpen(false);
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
    <div className="w-80 border-r border-gray-200 flex flex-col h-full text-[var(--gemini-text-primary)]" style={{ background: 'var(--gemini-sidebar)' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-[var(--gemini-text-primary)]">Gemini</h1>
          <div className="flex items-center gap-2">
            <button
  onClick={toggleDarkMode}
  className="hidden lg:p-2 lg:flex hover:bg-[#23232a] rounded-lg transition-colors"
  title={isDarkMode ? 'Light mode' : 'Dark mode'}
>
  {isDarkMode ? (
    <Sun className="w-5 h-5 text-[var(--gemini-text-secondary)]" />
  ) : (
    <Moon className="w-5 h-5 text-[var(--gemini-text-secondary)]" />
  )}
</button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-[#23232a] rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-[var(--gemini-text-secondary)]" />
            </button>
          </div>
        </div>
        
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 p-3 bg-[#23232a] hover:bg-[#23232a]/80 rounded-lg transition-colors group"
        >
          <Plus className="w-5 h-5 text-[var(--gemini-text-secondary)] group-hover:text-[var(--gemini-text-primary)]" />
          <span className="text-[var(--gemini-text-secondary)] group-hover:text-[var(--gemini-text-primary)] font-medium">New Chat</span>
        </button>
      </div>
      
      {/* Search */}
      <div className="p-4">
        <div className="relative flex items-center">
          <span className="absolute left-0 h-full flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-[var(--gemini-text-secondary)]" />
          </span>
          <input
            type="text"
            placeholder="Search chats..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-[#23232a] rounded-lg focus:outline-none text-[var(--gemini-text-primary)] placeholder-[#b0b3b8] focus:ring-2 focus:ring-[#8ab4f8] focus:border-transparent"
            style={{ minHeight: 40 }}
          />
        </div>
        {/* Mobile dark/light mode toggle below search, only visible on mobile */}
        <div className="flex items-center justify-end mt-4 lg:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 flex items-center gap-2 hover:bg-[#23232a] rounded-lg transition-colors"
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-[var(--gemini-text-secondary)]" />
            ) : (
              <Moon className="w-5 h-5 text-[var(--gemini-text-secondary)]" />
            )}
            <span className="text-xs text-[var(--gemini-text-secondary)]">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          </button>
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
          <div className="p-4 text-center text-[var(--gemini-text-secondary)]">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                onClick={() => { setCurrentChatroom(chatroom.id); if (setMobileSidebarOpen && window.innerWidth < 1024) setMobileSidebarOpen(false); }}
                className={cn(
                  "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  currentChatroom === chatroom.id
                    ? "bg-[var(--gemini-hover)] text-[var(--gemini-text-primary)] shadow-inner"
                    : "hover:bg-[var(--gemini-hover)] text-[var(--gemini-text-secondary)] hover:text-[var(--gemini-text-primary)]"
                )}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-medium text-sm" style={{ color: 'var(--gemini-text-primary)' }}>
                    {chatroom.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[var(--gemini-text-primary)] truncate">
                      {chatroom.title}
                    </h3>
                    <span className="text-xs text-[var(--gemini-text-secondary)] flex-shrink-0 ml-2">
                      {formatDate(chatroom.lastMessageTime)}
                    </span>
                  </div>
                  {chatroom.lastMessage && (
                    <p className="text-sm text-[var(--gemini-text-secondary)] truncate mt-1">
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
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#23232a] rounded transition-all"
                  >
                    <MoreVertical className="w-4 h-4 text-[var(--gemini-text-secondary)]" />
                  </button>
                  
                  {activeDropdown === chatroom.id && (
                    <div className="absolute right-0 top-full mt-1 bg-[#23232a] border border-[#23232a] rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={(e) => handleDeleteChatroom(chatroom.id, e)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-[#23232a]/80 rounded-lg"
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
            <span className="font-medium text-sm" style={{ color: 'var(--gemini-text-primary)' }}>
              {user?.phone.slice(-2) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--gemini-text-primary)] truncate">
              {user?.phone || 'User'}
            </p>
            <p className="text-xs text-[var(--gemini-text-secondary)]">
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}