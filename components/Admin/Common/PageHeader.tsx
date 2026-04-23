import React from 'react'

const AdminPageHeader = ({ title, subTitle, children }: { title: string, subTitle?: string, children?: React.ReactNode }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className='flex flex-col'>
                <h1 className="text-2xl sm:text-3xl font-display font-bold">{title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{subTitle}</p>
            </div>
            {children}
        </div>
    )
}

export default AdminPageHeader