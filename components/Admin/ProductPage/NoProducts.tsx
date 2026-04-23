import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import React from 'react'

const NoProducts = () => {

    const products = []
    return (
        <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-md">
                    {products.length === 0 ? "Add your first wall art product to get started." : "Try adjusting your search or filters."}
                </p>
            </CardContent>
        </Card>
    )
}

export default NoProducts