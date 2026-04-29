"use client"

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react';

const AddContentButton = ({handleAction}: {handleAction: any}) => {

    return (
        <Button className="w-full sm:w-auto" onClick={handleAction}>
            <Plus className="h-4 w-4 mr-2" />Add Section
        </Button>
    )
}

export default AddContentButton