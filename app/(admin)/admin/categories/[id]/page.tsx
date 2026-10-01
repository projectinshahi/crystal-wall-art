import CategoryPage from '@/components/Admin/CategoryPage'
import React from 'react'

// Subcategories of one main category (same UI and CRUD as categories)
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    return (
        <div className="space-y-6 animate-fade-in">
            <CategoryPage parentId={id} />
        </div>
    )
}

export default page
