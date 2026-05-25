import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminOrderDTO } from '@/lib/db/dto/order.dto'
import React from 'react'

const OrderSummaryCard = ({
    subtotal,
    tax,
    shipping_cost,
    total,
}: Pick<AdminOrderDTO, "subtotal" | "tax" | "shipping_cost" | "total">) => {
    return (
        <Card>
            <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{Number(subtotal).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>₹{Number(tax).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>₹{Number(shipping_cost).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total</span><span>₹{Number(total).toLocaleString("en-IN")}</span></div>
            </CardContent>
        </Card>
    )
}

export default OrderSummaryCard