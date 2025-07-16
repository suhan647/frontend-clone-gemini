export interface Country {
  name: {
    common: string
  }
  cca2: string
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
}

export interface User {
  id: string
  phone: string
  countryCode: string
  isAuthenticated: boolean
  createdAt: Date
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  image?: string
  chatroomId: string
}

export interface Chatroom {
  id: string
  title: string
  lastMessage?: string
  lastMessageTime: Date
  createdAt: Date
  userId: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  countries: Country[]
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setCountries: (countries: Country[]) => void
  logout: () => void
}

export interface ChatState {
  chatrooms: Chatroom[]
  currentChatroom: string | null
  messages: Record<string, Message[]>
  isTyping: boolean
  searchQuery: string
  isDarkMode: boolean
  addChatroom: (chatroom: Chatroom) => void
  setCurrentChatroom: (id: string | null) => void
  addMessage: (message: Message) => void
  setTyping: (typing: boolean) => void
  setSearchQuery: (query: string) => void
  toggleDarkMode: () => void
  deleteChatroom: (id: string) => void
  loadMoreMessages: (chatroomId: string) => void
  updateChatroomTitle: (id: string, title: string) => void
}