"use client"

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation'

const AddProductButton = () => {

    const router = useRouter();

    return (
        <Button onClick={() => router.push("/admin/products/new")} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />Add Product
        </Button>
    )
}

export default AddProductButton