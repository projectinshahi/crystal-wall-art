import OrdersManagement from '@/components/Admin/OrderManagement';
import { headers } from 'next/headers';
import React from 'react'

const page = async () => {

    const headerList = await headers();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/orders?page=1&limit=10`,
        {
            headers: {
                cookie: headerList.get('cookie') || '',
            },
            cache: 'no-store',
        }
    );

    const orders = await res.json()

    if (!orders || !orders.success) return null;

    return <OrdersManagement data={orders.data} metaData={orders.meta} />
}

export default page