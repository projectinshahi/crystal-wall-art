import React from 'react'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AdminSidebar } from './AdminSidebar'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {

    const session = await getServerSession(authOptions);

    if (!session || session.user.role?.name !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-950">
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AdminSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-14 flex items-center border-b bg-card px-4 shrink-0 sticky top-0 z-50">
                        <SidebarTrigger className="mr-4" />
                        <div className="flex-1" />
                    </header>
                    <main className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full z-40">
                        {children}
                    </main>
                </div>
            </div>

        </SidebarProvider>
    )
}

export default AdminLayout