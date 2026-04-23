"use client"

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react';

const AddCategoryButton = ({handleAction}: {handleAction: any}) => {

    return (
        <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />Add Category
        </Button>
    )
}

export default AddCategoryButton