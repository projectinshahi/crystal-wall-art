import React from 'react'

const products = [
    {
        id: "13917d34-4815-4aa0-a9fb-11d4bbc0adf3",
        category_id: "5ae4ee6c-9ed8-483c-8128-6cbb60b6ce10",
        images: ["https://amljpeuchoyrncgwppwf.supabase.co/storage/v1/object/public/product-images/samples/abstract-canvas.jpg"],
        title: "Abstract Teal & Gold Canvas",
        orientation: "landscape",
        price: "5999.00",
        discount_price: "4499.00",
        stock_quantity: "10",
        status: "active",
        description: "Stunning modern abstract canvas painting in teal and gold. No customization needed - ships as shown.",
        size: "36x24 inches",
        thickness: "2mm",
        mounting_method: "Gallery wrap"
    }
]

const DesktopData = () => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="p-3 text-left w-10">
                                <input type="checkbox" className="rounded" />
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                            <th className="p-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default DesktopData