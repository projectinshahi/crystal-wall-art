import { Card, CardContent } from '@/components/ui/card'
import { FolderOpen } from 'lucide-react'
import React from 'react'

const NoCategory = () => {
    return (
        <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
                <p className="text-muted-foreground text-sm">Create your first category to organize products.</p>
            </CardContent>
        </Card>
    )
}

export default NoCategory