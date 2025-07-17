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
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {/* Demo trigger for login modal. Replace or remove as needed. */}
      <button
        onClick={() => setShowLogin(true)}
        className="fixed top-4 right-4 z-[100] px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        Open Login
      </button>
      {showLogin && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg sm:max-w-xl mx-2 sm:mx-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-0 overflow-hidden animate-fadeIn max-h-[80vh] flex flex-col justify-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              onClick={() => setShowLogin(false)}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <LoginForm onClose={() => setShowLogin(false)} />
            </div>
          </div>
        </div>
      )}
      <div className="h-screen flex bg-[var(--gemini-bg)] overflow-hidden">
        {/* Sidebar for md and above */}
        <div className="hidden md:flex">
          <Sidebar onRequireLogin={() => setShowLogin(true)} />
        </div>
        {/* Mobile Sidebar for below md */}
        <div className="flex md:hidden">
          <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} onRequireLogin={() => setShowLogin(true)} />
        </div>
        <MainChat setMobileSidebarOpen={setIsOpen} />
      </div>
    </>
  )
}