import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatState, Chatroom, Message } from '@/types'
import { generateId } from '@/lib/utils'

const generateDummyMessages = (chatroomId: string, count: number = 20): Message[] => {
  const messages: Message[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const isUser = Math.random() > 0.5
    const timestamp = new Date(now.getTime() - (i * 60000 * Math.random() * 10))
    
    messages.unshift({
      id: generateId(),
      content: isUser 
        ? `User message ${i + 1}: This is a sample user message with some content.`
        : `AI response ${i + 1}: This is a simulated Gemini response with helpful information.`,
      isUser,
      timestamp,
      chatroomId
    })
  }
  
  return messages
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      messages: {},
      isTyping: false,
      searchQuery: '',
      isDarkMode: false,
      
      addChatroom: (chatroom: Chatroom) => {
        set(state => ({
          chatrooms: [chatroom, ...state.chatrooms],
          messages: {
            ...state.messages,
            [chatroom.id]: []
          }
        }))
      },
      
      setCurrentChatroom: (id: string | null) => {
        set({ currentChatroom: id })
      },
      
      addMessage: (message: Message) => {
        set(state => {
          const chatroomMessages = state.messages[message.chatroomId] || []
          const updatedMessages = [...chatroomMessages, message]
          
          // Update chatroom's last message
          const updatedChatrooms = state.chatrooms.map(room => 
            room.id === message.chatroomId 
              ? { 
                  ...room, 
                  lastMessage: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
                  lastMessageTime: message.timestamp 
                }
              : room
          )
          
          return {
            messages: {
              ...state.messages,
              [message.chatroomId]: updatedMessages
            },
            chatrooms: updatedChatrooms
          }
        })
      },
      
      setTyping: (isTyping: boolean) => set({ isTyping }),
      
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
      
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
      
      deleteChatroom: (id: string) => {
        set(state => {
          const { [id]: deleted, ...remainingMessages } = state.messages
          return {
            chatrooms: state.chatrooms.filter(room => room.id !== id),
            messages: remainingMessages,
            currentChatroom: state.currentChatroom === id ? null : state.currentChatroom
          }
        })
      },
      
      updateChatroomTitle: (id: string, title: string) => {
        set(state => ({
          chatrooms: state.chatrooms.map(room => 
            room.id === id ? { ...room, title } : room
          )
        }))
      },
      
      loadMoreMessages: (chatroomId: string) => {
        set(state => {
          const existingMessages = state.messages[chatroomId] || []
          const newMessages = generateDummyMessages(chatroomId, 20)
          
          return {
            messages: {
              ...state.messages,
              [chatroomId]: [...newMessages, ...existingMessages]
            }
          }
        })
      }
    }),
    {
      name: 'gemini-chat',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const data = JSON.parse(str)
          
          // Convert timestamp strings back to Date objects
          if (data.state?.messages) {
            Object.keys(data.state.messages).forEach(chatroomId => {
              data.state.messages[chatroomId] = data.state.messages[chatroomId].map((message: any) => ({
                ...message,
                timestamp: new Date(message.timestamp)
              }))
            })
          }
          
          if (data.state?.chatrooms) {
            data.state.chatrooms = data.state.chatrooms.map((chatroom: any) => ({
              ...chatroom,
              lastMessageTime: chatroom.lastMessageTime ? new Date(chatroom.lastMessageTime) : undefined
            }))
          }
          
          return data
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      },
      partialize: (state) => ({ 
        chatrooms: state.chatrooms, 
        messages: state.messages,
        isDarkMode: state.isDarkMode 
      }) as any
    }
  )
)