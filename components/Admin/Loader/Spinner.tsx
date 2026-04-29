import { Loader2 } from 'lucide-react'
import React from 'react'

const Spinner = () => {
    return (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    )
}

export default Spinner