'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'
import { LoginForm } from '@/components/auth/login-form'
import { Sidebar } from '@/components/layout/sidebar'
import { MainChat } from '@/components/chat/main-chat'

export default function Home() {
  const { user } = useAuthStore()
  
  // Show login form if not authenticated
  if (!user?.isAuthenticated) {
    return <LoginForm />
  }
  
  return (
    <div className="h-screen flex bg-[#131314] overflow-hidden">
      <Sidebar />
      <MainChat />
    </div>
  )
}