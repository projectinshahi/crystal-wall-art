"use client";

import React, { useEffect, useState } from "react";

import {
    OrderedItemsTypes,
    OrderedShipmentItemsTypes,
    OrderedShipmentsTypes,
    OrderTimelinesTypes,
} from "@/types/Admin/orders.types";

import OrderItemsSection from "./OrderItemsSection";
import Shipments from "./Shipments";
import { UserOrders } from "@/types/order.type";
import Timeline from "./Timeline";

const OrderedItemsDetails = ({ id, orderData }: { id: string, orderData: UserOrders }) => {
    const [items, setItems] = useState<OrderedItemsTypes[]>([]);
    const [shipments, setShipments] = useState<OrderedShipmentsTypes[]>([]);
    const [shipmentItems, setShipmentItems] = useState<
        OrderedShipmentItemsTypes[]
    >([]);
    const [timeline, setTimeline] = useState<OrderTimelinesTypes[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);

            const [itemsRes, shipmentsRes, timelineRes] = await Promise.all([
                fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/admin/orders/${id}/items`
                ),
                fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/admin/orders/${id}/shipments`
                ),
                fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/admin/orders/${id}/timeline`
                ),
            ]);

            const itemsData = await itemsRes.json();
            const shipmentsData = await shipmentsRes.json();
            const timelineData = await timelineRes.json();

            setItems(itemsData?.data || []);
            setShipments(shipmentsData?.data || []);
            setTimeline(timelineData?.data || []);

            // Fetch shipment items
            if (shipmentsData?.data?.length) {
                const shipmentIds = shipmentsData.data
                    .map((x: OrderedShipmentsTypes) => x.id)
                    .join(",");

                const shipmentItemsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/admin/orders/${id}/shipment-items?shipment_ids=${shipmentIds}`
                );

                const shipmentItemsData =
                    await shipmentItemsRes.json();

                setShipmentItems(shipmentItemsData?.data || []);
            } else {
                setShipmentItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch order details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <OrderItemsSection
                items={items}
                shipmentItems={shipmentItems}
            />
            <Shipments
                items={items}
                shipments={shipments}
                shipmentItems={shipmentItems}
                orderData={orderData}
            />
            <Timeline
                data={timeline}
            />
        </>
    );
};

export default OrderedItemsDetails;