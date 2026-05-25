"use client"

import { PaginationMeta } from '@/lib/db/content.db';
import { UserOrders } from '@/types/order.type';
import React, { useCallback, useState } from 'react'
import Spinner from '../Loader/Spinner';
import TableData from '../ProductPage/TableData';
import Filters from './Filters';
import AdminPageHeader from '../Common/PageHeader';
import { DataTable } from '../Table';
import { ordersColumns } from './tableHeaders';
import { AdminOrderDTO } from '@/lib/db/dto/order.dto';
import { useRouter } from 'next/navigation';

interface Props {
    data: UserOrders[];
    metaData: PaginationMeta;
}

const OrdersManagement = ({ data, metaData }: Props) => {

    const router = useRouter();

    const [ordersData, setOrdersData] = useState<UserOrders[]>(data);
    const [meta, setMeta] = useState<PaginationMeta>(metaData);
    const [isLoading, setIsLoading] = useState(false);

    const handleView = useCallback(
        (row: AdminOrderDTO) => {
            router.push(`/admin/orders/${row.id}`);
        },
        [router]
    );

    return (
        <div className='space-y-4'>

            <AdminPageHeader
                title="Orders"
                subTitle="Track and manage customer orders"
            />

            <Filters />

            {isLoading ? (
                <Spinner />
            ) : ordersData.length === 0 ? (
                <p>No Orders</p>
            ) : (
                <DataTable
                    data={ordersData}
                    columns={ordersColumns}
                    meta={meta}
                    onPageChange={(page) => {
                        setIsLoading(true)
                    }}
                    // ↓ Pass all row actions as one prop — DataTable appends the column for you
                    rowActions={{
                        onView: handleView,
                    }}
                    emptyState="No orders found."
                />
            )}
        </div>
    )
}

export default OrdersManagement