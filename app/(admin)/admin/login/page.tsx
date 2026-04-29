import LoginForm from '@/components/Admin/LoginForm'
import React from 'react'

const AdminLoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-50">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <img
                        src="/logo/logo.svg"
                        alt="Crystal Wall Art"
                        className="h-16 w-auto"
                    />
                </div>

                <LoginForm />
            </div>
        </div>
    )
}

export default AdminLoginPage