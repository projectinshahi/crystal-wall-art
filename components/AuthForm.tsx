"use client"

import React, { useState } from 'react'
import { Typography } from './ui/Typography'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const AuthForm = () => {

    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [error, setError] = useState<string>('');

    const handleChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "signup") {
                // 1. Create user
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    body: JSON.stringify(form),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error)
                    toast(data.error)
                    return;
                }

                const result = await signIn("client-login", {
                    email: form.email,
                    password: form.password,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Internal Server Error!..")
                } else if (result?.ok) {
                    router.push('/')
                    router.refresh();
                }
            } else {
                const result = await signIn("client-login", {
                    email: form.email,
                    password: form.password,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Invalid credentials")
                } else if (result?.ok) {
                    router.push('/')
                    router.refresh();
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/40">
            <div className="w-full max-w-md">

                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-lightBackground rounded-2xl shadow-xl p-8">

                    {/* Header */}
                    <div className="flex flex-col items-center space-y-3 mb-6">
                        <img src="/logo/logo.svg" alt="Logo" className="h-14" />
                        <Typography variant="h4">
                            {mode === 'signup' ? 'Create account' : 'Welcome back'}
                        </Typography>
                        <Typography variant="body" className="text-muted-foreground text-sm">
                            {mode === 'signup'
                                ? 'Sign up to get started'
                                : 'Login to continue'}
                        </Typography>
                    </div>

                    {error && (<Typography variant='body-sm' className='text-destructive mb-3 font-semibold'>{error}</Typography>)}

                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Signup fields */}
                        {mode === 'signup' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <Input
                                        id="firstName"
                                        type="firstName"
                                        value={form.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
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
                                        type="lastName"
                                        value={form.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
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
                        )}

                        {/* Email */}
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder=" "
                                required
                                className="peer h-12 rounded-xl border border-lightBackground bg-background px-4 pt-5 pb-2 text-base focus-visible:ring-primary focus-visible:ring-1"
                            />
                            <label
                                htmlFor="email"
                                className="pointer-events-none absolute left-4 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs"
                            >
                                Email ID
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder=" "
                                required
                                className="peer h-12 rounded-xl border border-lightBackground bg-background px-4 pt-5 pb-2 text-base focus-visible:ring-primary focus-visible:ring-1"
                            />
                            <label
                                htmlFor="password"
                                className="pointer-events-none absolute left-4 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs"
                            >
                                Password
                            </label>
                        </div>

                        {/* Confirm Password */}
                        {mode === 'signup' && (
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                    placeholder=" "
                                    required
                                    className="peer h-12 rounded-xl border border-lightBackground bg-background px-4 pt-5 pb-2 text-base focus-visible:ring-primary focus-visible:ring-1"
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="pointer-events-none absolute left-4 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs"
                                >
                                    Confirm Password
                                </label>
                            </div>
                        )}

                        {/* Forgot password */}
                        {mode === 'login' && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-xl text-base font-semibold shadow-lg"
                        >
                            {loading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                            {mode === 'signup' ? 'Create Account' : 'Login'}
                        </Button>
                    </form>

                    {/* Switch mode */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        {mode === 'login' ? (
                            <>
                                Don’t have an account?{" "}
                                <button
                                    onClick={() => setMode('signup')}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setMode('login')}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AuthForm