'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Loader2, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { CountrySelector } from './country-selector'
import { OTPInput } from './otp-input'
import { Country, User } from '@/types'
import { generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long')
})

const otpSchema = z.object({
  otp: z.array(z.string()).length(6).refine(arr => arr.every(digit => digit.length === 1), 'Complete OTP required')
})

type PhoneFormData = z.infer<typeof phoneSchema>
type OTPFormData = z.infer<typeof otpSchema>

export function LoginForm({ onLoginSuccess, onClose }: { onLoginSuccess?: () => void; onClose?: () => void } = {}) {
  const { user, isLoading, countries, setUser, setLoading, setCountries } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(''))
  const [resendTimer, setResendTimer] = useState(0)
  
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema)
  })
  
  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: Array(6).fill('') }
  })
  
  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag')
        const data: Country[] = await response.json()
        const sortedCountries = data
          .filter(country => country.idd?.root)
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
        setCountries(sortedCountries)
        
        // Set default to US
        const us = sortedCountries.find(c => c.cca2 === 'US')
        if (us) setSelectedCountry(us)
      } catch (error) {
        toast.error('Failed to load countries')
      }
    }
    
    fetchCountries()
  }, [setCountries])
  
  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])
  
  const getDialCode = (country: Country) => {
    if (!country.idd?.root) return ''
    const suffix = country.idd.suffixes?.[0] || ''
    return `${country.idd.root}${suffix}`
  }
  
  const handlePhoneSubmit = async (data: PhoneFormData) => {
    if (!selectedCountry) {
      toast.error('Please select a country')
      return
    }
    
    setLoading(true)
    const fullPhone = `${getDialCode(selectedCountry)}${data.phone}`
    setPhoneNumber(fullPhone)
    
    // Simulate OTP send
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
      setResendTimer(30)
      toast.success('OTP sent successfully!')
    }, 1500)
  }
  
  const handleOTPSubmit = async () => {
    if (otpValue.some(digit => !digit)) {
      toast.error('Please enter complete OTP')
      return
    }
    
    setLoading(true)
    
    // Simulate OTP validation
    setTimeout(() => {
      const newUser: User = {
        id: generateId(),
        phone: phoneNumber,
        countryCode: selectedCountry?.cca2 || '',
        isAuthenticated: true,
        createdAt: new Date()
      }
      
      setUser(newUser)
      setLoading(false)
      toast.success('Login successful!')
      if (onLoginSuccess) onLoginSuccess()
      if (onClose) onClose()
    }, 2000)
  }
  
  const handleResendOTP = () => {
    if (resendTimer > 0) return
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResendTimer(30)
      toast.success('OTP resent successfully!')
    }, 1000)
  }
  
  if (user?.isAuthenticated) {
    return null
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gemini
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'phone' ? 'Enter your phone number to continue' : 'Enter the verification code'}
          </p>
          {step === 'otp' && (
            <p className="text-blue-600 dark:text-blue-400 mt-2">For this demo, use OTP: <b>123456</b></p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {step === 'phone' ? (
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {selectedCountry ? getDialCode(selectedCountry) : '+1'}
                    </span>
                  </div>
                  <input
                    {...phoneForm.register('phone')}
                    type="tel"
                    placeholder="1234567890"
                    disabled={isLoading}
                    className={cn(
                      "flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800",
                      "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !selectedCountry}
                  className={cn(
                    "flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg",
                    "hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
                {/* <button
                  type="button"
                  onClick={onClose}
                  className="flex-0 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Close
                </button> */}
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We sent a verification code to
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {phoneNumber}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                  Enter verification code
                </label>
                <OTPInput
                  value={otpValue}
                  onChange={setOtpValue}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleOTPSubmit}
                  disabled={isLoading || otpValue.some(digit => !digit)}
                  className={cn(
                    "flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg",
                    "hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>
                {/* <button
                  type="button"
                  onClick={onClose}
                  className="flex-0 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Close
                </button> */}
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isLoading}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
              
              <button
                onClick={() => {
                  setStep('phone')
                  setOtpValue(Array(6).fill(''))
                  setResendTimer(0)
                }}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ← Change phone number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}