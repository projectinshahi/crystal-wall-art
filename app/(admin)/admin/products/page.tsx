import AdminPageHeader from '@/components/Admin/Common/PageHeader'
import ProductPage from '@/components/Admin/ProductPage'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const page = () => {
    return (
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ProductPage />
        </div>
    )
}

export default page