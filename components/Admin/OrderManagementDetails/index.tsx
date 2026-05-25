import { AdminOrderDTO } from '@/lib/db/dto/order.dto'
import React from 'react'
import AdminPageHeader from '../Common/PageHeader'
import { Badge } from '@/components/ui/badge';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import OrderCustomerCard from './OrderCustomerCard';
import OrderSummaryCard from './OrderSummaryCard';
import OrderedItemsDetails from './OrderedItemsDetails';

const OrderManagementDetails = async ({ id }: { id: string }) => {

    const order = await fetchOrderDetail(id);

    return (
        <div className='space-y-4'>
            <AdminPageHeader
                title={`Order ${order.order_number}`}
                subTitle={`Placed ${new Date(order.created_at).toLocaleString()}`}
            >
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">{order.status.replace(/_/g, " ")}</Badge>
                    <Badge variant={order.payment_status === "paid" ? "default" : "secondary"} className="capitalize">{order.payment_status}</Badge>
                </div>
            </AdminPageHeader>

            <div className="grid md:grid-cols-3 gap-4">
                <OrderCustomerCard
                    customer_name={order.customer_name}
                    customer_email={order.customer_email}
                    customer_phone={order.customer_phone}
                    shipping_address={order.shipping_address}
                />
                <OrderSummaryCard
                    subtotal={order.subtotal}
                    tax={order.tax}
                    shipping_cost={order.shipping_cost}
                    total={order.total}
                />
            </div>

            <OrderedItemsDetails id={id} orderData={order} />

        </div>
    )
}

export default OrderManagementDetails

async function fetchOrderDetail(id: string): Promise<AdminOrderDTO> {
    const headerList = await headers();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/orders?id=${id}`,
        {
            headers: {
                cookie: headerList.get("cookie") ?? "",
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        notFound();
    }

    const json = await res.json();

    if (!json?.success) {
        notFound();
    }

    const order = json.data;

    return order[0]
}