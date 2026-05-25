import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/Typography'
import { AdminOrderDTO } from '@/lib/db/dto/order.dto';
import React from 'react'

function formatAddress(addr: any): string {
    if (!addr) return "N/A";
    if (typeof addr === "string") return addr;
    const parts = [
        addr.name,
        addr.address,
        addr.line1,
        addr.line2,
        [addr.city, addr.state, addr.pincode || addr.zip].filter(Boolean).join(", "),
        addr.country,
    ].filter(Boolean);
    return parts.join("\n");
}

const OrderCustomerCard = ({
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
}: Pick<
    AdminOrderDTO,
    "customer_name" | "customer_email" | "customer_phone" | "shipping_address"
>) => {
    return (
        <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-base">Customer & Address</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <Typography variant='body-lg' className='font-medium'>{customer_name}</Typography>
                    <Typography variant='body-sm' className='text-muted-foreground'>{customer_email}</Typography>
                    <Typography variant='body-sm' className='text-muted-foreground'>{customer_phone}</Typography>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs uppercase mb-1">Shipping Address</p>
                    <p className="whitespace-pre-wrap">{formatAddress(shipping_address)}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default OrderCustomerCard