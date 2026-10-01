import { Card, CardContent } from '@/components/ui/card'
import { FolderOpen } from 'lucide-react'
import React from 'react'

const NoCategory = ({ isSub = false }: { isSub?: boolean }) => {
    return (
        <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{isSub ? "No subcategories yet" : "No categories yet"}</h3>
                <p className="text-muted-foreground text-sm">{isSub ? "Create a subcategory to start adding products to this category." : "Create your first category to organize products."}</p>
            </CardContent>
        </Card>
    )
}

export default NoCategory