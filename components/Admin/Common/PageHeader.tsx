"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const AdminPageHeader = ({ title, subTitle, children, showBackButton = false }: { title: string, subTitle?: string, children?: React.ReactNode, showBackButton?: boolean }) => {

    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className='flex flex-row gap-3'>
                {showBackButton && (
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
                <div className='flex flex-col gap-0'>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold">{title}</h1>
                    <p className="text-muted-foreground text-sm">{subTitle}</p>
                </div>
            </div>
            {children}
        </div>
    )
}

export default AdminPageHeader