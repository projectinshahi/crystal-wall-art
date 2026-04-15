import React from 'react'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AdminSidebar } from './AdminSidebar'

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AdminSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-14 flex items-center border-b bg-card px-4 shrink-0">
                        <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
                    </header>
                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </div>

        </SidebarProvider>
    )
}

export default AdminLayout