'use client'

import { Toaster } from 'react-hot-toast'
import { useChatStore } from '@/store/chat'

export function ToastProvider() {
  const { isDarkMode } = useChatStore()
  
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDarkMode ? '#374151' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
          border: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`,
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  )
}