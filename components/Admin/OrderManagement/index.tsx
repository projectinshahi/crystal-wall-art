"use client"

import { PaginationMeta } from '@/lib/db/content.db';
import { UserOrders } from '@/types/order.type';
import React, { useCallback, useEffect, useState } from 'react'
import Spinner from '../Loader/Spinner';
import TableData from '../ProductPage/TableData';
import Filters from './Filters';
import AdminPageHeader from '../Common/PageHeader';
import { DataTable } from '../Table';
import { ordersColumns } from './tableHeaders';
import { AdminOrderDTO } from '@/lib/db/dto/order.dto';
import { useRouter } from 'next/navigation';

const OrdersManagement = () => {

    const router = useRouter();

    const [ordersData, setOrdersData] = useState<UserOrders[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>();
    const [isLoading, setIsLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [paymentFilter, setPaymentFilter] = useState<string>("all");

    const handleView = useCallback(
        (row: AdminOrderDTO) => {
            router.push(`/admin/orders/${row.id}`);
        },
        [router]
    );

    const fetchOrders = async () => {
        try {
            setIsLoading(true);

            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (statusFilter !== "all") params.append("status", statusFilter);
            if (paymentFilter !== "all") params.append("payment", paymentFilter);

            const queryString = params.toString();

            const url = queryString
                ? `/api/admin/orders?page=1&limit=10&${queryString}`
                : `/api/admin/orders?page=1&limit=10`;

            const res = await fetch(url, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch products");

            const json = await res.json();

            setOrdersData(json.data || []);
            setMeta(json.meta);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchOrders();
        }, 400);

        return () => clearTimeout(handler);
    }, [search, statusFilter, paymentFilter]);

    return (
        <div className='space-y-4'>

            <AdminPageHeader
                title="Orders"
                subTitle="Track and manage customer orders"
            />

            <Filters
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                paymentFilter={paymentFilter}
                setPaymentFilter={setPaymentFilter}
            />

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