import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, Country, User } from '@/types'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      countries: [],
      
      setUser: (user: User | null) => {
        set({ user })
        if (user) {
          localStorage.setItem('gemini_user', JSON.stringify(user))
        } else {
          localStorage.removeItem('gemini_user')
        }
      },
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      setCountries: (countries: Country[]) => set({ countries }),
      
      logout: () => {
        set({ user: null })
        localStorage.removeItem('gemini_user')
        localStorage.removeItem('gemini_chatrooms')
        localStorage.removeItem('gemini_messages')
      }
    }),
    {
      name: 'gemini-auth',
      partialize: (state) => ({ user: state.user })
    }
  )
)