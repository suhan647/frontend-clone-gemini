'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'
import { LoginForm } from '@/components/auth/login-form'
import { Sidebar } from '@/components/layout/sidebar'
import { MainChat } from '@/components/chat/main-chat'
import { MobileSidebar } from '@/components/chat/mobile-sidebar'
import { useState } from 'react'

export default function Home() {
  // Remove forced login check
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="h-screen flex bg-[var(--gemini-bg)] overflow-hidden">
      {/* Sidebar for md and above */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      {/* Mobile Sidebar for below md */}
      <div className="flex md:hidden">
        <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <MainChat setMobileSidebarOpen={setIsOpen} />
    </div>
  )
}