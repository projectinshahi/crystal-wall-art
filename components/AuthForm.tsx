"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Typography } from './ui/Typography'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, Phone, ArrowLeft, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client' // your firebase client init

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'login' | 'signup'
type Step = 'phone' | 'otp' | 'details'   // details = signup name collection

// ─── Component ────────────────────────────────────────────────────────────────

const AuthForm = () => {
    const router = useRouter()

    // Flow state
    const [mode, setMode] = useState<Mode>('login')
    const [step, setStep] = useState<Step>('phone')

    // Form fields
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendTimer, setResendTimer] = useState(0)

    // Firebase
    const confirmationRef = useRef<ConfirmationResult | null>(null)
    const recaptchaRef = useRef<RecaptchaVerifier | null>(null)
    const recaptchaContainerRef = useRef<HTMLDivElement>(null)

    // OTP input refs for auto-focus
    const otpRefs = useRef<(HTMLInputElement | null)[]>([])

    // ── Resend countdown ──────────────────────────────────────────────────────

    useEffect(() => {
        if (resendTimer <= 0) return
        const id = setInterval(() => setResendTimer(t => t - 1), 1000)
        return () => clearInterval(id)
    }, [resendTimer])

    // ── Cleanup reCAPTCHA on unmount ──────────────────────────────────────────

    useEffect(() => {
        return () => {
            recaptchaRef.current?.clear()
        }
    }, [])

    // ── Helpers ───────────────────────────────────────────────────────────────

    const clearError = () => setError('')

    const formatPhone = (raw: string) => {
        // Ensure E.164 format. Adjust default country code as needed.
        const digits = raw.replace(/\D/g, '')
        if (digits.startsWith('0')) return `+91${digits.slice(1)}`
        if (!digits.startsWith('+')) return `+91${digits}`
        return `+${digits}`
    }

    const initRecaptcha = () => {
        if (recaptchaRef.current) return recaptchaRef.current

        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => { /* reCAPTCHA solved */ },
            'expired-callback': () => {
                recaptchaRef.current?.clear()
                recaptchaRef.current = null
            },
        })
        recaptchaRef.current = verifier
        return verifier
    }

    // ── Step 1: Send OTP ──────────────────────────────────────────────────────

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        const formatted = formatPhone(phone)
        if (formatted.length < 10) {
            setError('Enter a valid phone number')
            return
        }

        setLoading(true)
        try {
            const verifier = initRecaptcha()
            const confirmation = await signInWithPhoneNumber(auth, formatted, verifier)
            confirmationRef.current = confirmation
            setStep('otp')
            setResendTimer(30)
            toast.success('OTP sent!')
        } catch (err: any) {
            console.error("[OTP Error]",err)
            recaptchaRef.current?.clear()
            recaptchaRef.current = null
            setError(err?.message ?? 'Failed to send OTP. Try again.')
        } finally {
            setLoading(false)
        }
    }

    // ── Step 2: Verify OTP ────────────────────────────────────────────────────

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        const code = otp.join('')
        if (code.length !== 6) {
            setError('Enter the 6-digit OTP')
            return
        }

        setLoading(true)
        try {
            const result = await confirmationRef.current!.confirm(code)
            const firebaseToken = await result.user.getIdToken()

            if (mode === 'login') {
                // Sign in via NextAuth using firebase token
                const res = await signIn('client-login', {
                    firebaseToken,
                    redirect: false,
                })
                if (res?.error) {
                    setError('Authentication failed. Please try again.')
                } else if (res?.ok) {
                    router.push('/')
                    router.refresh()
                }
            } else {
                // Signup: collect name next
                setStep('details')
            }
        } catch (err: any) {
            console.error(err)
            if (err?.code === 'auth/invalid-verification-code') {
                setError('Invalid OTP. Please try again.')
            } else {
                setError(err?.message ?? 'Verification failed.')
            }
        } finally {
            setLoading(false)
        }
    }

    // ── Step 3 (Signup only): Create account ──────────────────────────────────

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        if (!firstName.trim() || !lastName.trim()) {
            setError('Please enter your full name')
            return
        }

        setLoading(true)
        try {
            const firebaseUser = confirmationRef.current as any
            // Re-grab the Firebase ID token from the already-confirmed user
            const { currentUser } = auth
            if (!currentUser) throw new Error('Session expired. Please restart.')
            const firebaseToken = await currentUser.getIdToken()

            // Create user in your DB
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, phone: formatPhone(phone), firebaseToken }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error)
                toast.error(data.error)
                return
            }

            // Sign in via NextAuth
            const result = await signIn('firebase-otp', {
                firebaseToken,
                redirect: false,
            })
            if (result?.error) {
                setError('Account created but sign-in failed. Please log in.')
            } else if (result?.ok) {
                router.push('/')
                router.refresh()
            }
        } catch (err: any) {
            console.error(err)
            setError(err?.message ?? 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    // ── OTP input handlers ────────────────────────────────────────────────────

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const next = [...otp]
        next[index] = value.slice(-1)
        setOtp(next)
        if (value && index < 5) otpRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            setOtp(pasted.split(''))
            otpRefs.current[5]?.focus()
        }
    }

    // ── Mode switch: reset everything ─────────────────────────────────────────

    const switchMode = (newMode: Mode) => {
        setMode(newMode)
        setStep('phone')
        setOtp(['', '', '', '', '', ''])
        setPhone('')
        setFirstName('')
        setLastName('')
        clearError()
        recaptchaRef.current?.clear()
        recaptchaRef.current = null
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/40">
            {/* Invisible reCAPTCHA mount point */}
            <div id="recaptcha-container" ref={recaptchaContainerRef} />

            <div className="w-full max-w-md">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-lightBackground rounded-2xl shadow-xl p-8">

                    {/* ── Back button (OTP / details steps) ── */}
                    {step !== 'phone' && (
                        <button
                            onClick={() => {
                                setStep(step === 'details' ? 'otp' : 'phone')
                                clearError()
                            }}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    )}

                    {/* ── Header ── */}
                    <div className="flex flex-col items-center space-y-3 mb-6">
                        <img src="/logo/logo.svg" alt="Logo" className="h-14" />

                        <Typography variant="h4">
                            {step === 'phone' && (mode === 'signup' ? 'Create account' : 'Welcome back')}
                            {step === 'otp' && 'Verify OTP'}
                            {step === 'details' && 'Almost there'}
                        </Typography>

                        <Typography variant="body" className="text-muted-foreground text-sm text-center">
                            {step === 'phone' && (mode === 'signup' ? 'Enter your mobile number to get started' : 'Enter your mobile number to continue')}
                            {step === 'otp' && `We sent a 6-digit code to ${formatPhone(phone)}`}
                            {step === 'details' && 'Just your name and you\'re in'}
                        </Typography>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <Typography variant="body-sm" className="text-destructive mb-3 font-semibold text-center">
                            {error}
                        </Typography>
                    )}

                    {/* ══════════════════════════════════════════
                        STEP 1 — Phone number
                    ══════════════════════════════════════════ */}
                    {step === 'phone' && (
                        <form className="space-y-4" onSubmit={handleSendOtp}>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Mobile number"
                                    required
                                    className="h-12 rounded-xl border border-lightBackground bg-background pl-10 pr-4 text-base focus-visible:ring-primary focus-visible:ring-1"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-xl text-base font-semibold shadow-lg"
                            >
                                {loading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                                Send OTP
                            </Button>
                        </form>
                    )}

                    {/* ══════════════════════════════════════════
                        STEP 2 — OTP
                    ══════════════════════════════════════════ */}
                    {step === 'otp' && (
                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                            {/* 6-box OTP input */}
                            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => { otpRefs.current[i] = el }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        className="w-11 h-14 text-center text-xl font-bold rounded-xl border border-lightBackground bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || otp.join('').length !== 6}
                                className="w-full h-14 rounded-xl text-base font-semibold shadow-lg"
                            >
                                {loading
                                    ? <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    : <ShieldCheck className="h-5 w-5 mr-2" />
                                }
                                {mode === 'login' ? 'Verify & Login' : 'Verify & Continue'}
                            </Button>

                            {/* Resend */}
                            <div className="text-center text-sm text-muted-foreground">
                                {resendTimer > 0 ? (
                                    <span>Resend OTP in <span className="font-semibold text-foreground">{resendTimer}s</span></span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp as any}
                                        className="text-primary font-medium hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* ══════════════════════════════════════════
                        STEP 3 — Signup details (name)
                    ══════════════════════════════════════════ */}
                    {step === 'details' && (
                        <form className="space-y-4" onSubmit={handleCreateAccount}>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <Input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder=" "
                                        required
                                        className="peer h-12 rounded-xl border border-lightBackground bg-background px-4 pt-5 pb-2 text-base focus-visible:ring-primary focus-visible:ring-1"
                                    />
                                    <label
                                        htmlFor="firstName"
                                        className="pointer-events-none absolute left-4 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs"
                                    >
                                        First Name
                                    </label>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder=" "
                                        required
                                        className="peer h-12 rounded-xl border border-lightBackground bg-background px-4 pt-5 pb-2 text-base focus-visible:ring-primary focus-visible:ring-1"
                                    />
                                    <label
                                        htmlFor="lastName"
                                        className="pointer-events-none absolute left-4 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs"
                                    >
                                        Last Name
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-xl text-base font-semibold shadow-lg"
                            >
                                {loading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                                Create Account
                            </Button>
                        </form>
                    )}

                    {/* ── Mode switch (only on phone step) ── */}
                    {step === 'phone' && (
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            {mode === 'login' ? (
                                <>
                                    Don&apos;t have an account?{' '}
                                    <button onClick={() => switchMode('signup')} className="text-primary font-medium hover:underline">
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button onClick={() => switchMode('login')} className="text-primary font-medium hover:underline">
                                        Login
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default AuthForm