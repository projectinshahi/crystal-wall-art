"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Typography } from '../ui/Typography'
import { Key, Loader2, Lock, Mail } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'

interface Form {
    email: string;
    password: string;
}

const LoginForm = () => {

    const router = useRouter();

    const [form, setForm] = useState<Form>({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState<boolean>(false)

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("admin-login", {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Authorization Failed', {
                    description: 'Invalid admin credentials or unauthorized role.'
                })
            } else if (result?.ok) {
                toast.success('Access Granted', {
                    description: 'Redirecting to Admin Dashboard...'
                })

                router.push('/admin/products')
                router.refresh();
            }
        } catch (error) {
            toast.error('Connection Error', {
                description: 'Authentication service unreachable. Please try again.'
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className='text-center'>
                <CardTitle className="text-white">Admin Portal</CardTitle>
                <CardDescription className="text-slate-400">Please verify your identity to manage the system.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Typography className="text-slate-300">Email</Typography>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@guardpass.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="pl-10 bg-slate-950 border-slate-800 focus:border-primary text-white placeholder:text-slate-600"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Typography icon-label="password" className="text-slate-300">Secret Password</Typography>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="pl-10 bg-slate-950 border-slate-800 focus:border-primary text-white placeholder:text-slate-600"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white h-11 font-bold"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Lock className="mr-2 h-4 w-4" />
                        )}
                        Login
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default LoginForm