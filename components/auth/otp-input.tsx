'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  value: string[]
  onChange: (value: string[]) => void
  length?: number
  disabled?: boolean
}

export function OTPInput({ value, onChange, length = 6, disabled }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])
  
  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return
    
    const newValue = [...value]
    newValue[index] = inputValue.slice(-1)
    onChange(newValue)
    
    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const newValue = Array(length).fill('').map((_, i) => pastedData[i] || '')
    onChange(newValue)
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newValue.findIndex(val => !val)
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }
  
  return (
    <div className="flex gap-2 justify-center">
      {Array(length).fill(0).map((_, index) => (
        <input
          key={index}
          ref={(el) => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg",
            "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        />
      ))}
    </div>
  )
}