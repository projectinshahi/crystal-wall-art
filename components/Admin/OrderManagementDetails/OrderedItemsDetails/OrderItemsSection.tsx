"use client";

import { useMemo } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    OrderedItemsTypes,
    OrderedShipmentItemsTypes,
} from "@/types/Admin/orders.types";

function variantOf(item: OrderedItemsTypes): string {
    return [
        item.size,
        item.thickness,
        item.orientation,
        item.mounting_method,
    ]
        .filter(Boolean)
        .join(" / ");
}

const OrderItemsSection = ({
    items,
    shipmentItems,
}: {
    items: OrderedItemsTypes[];
    shipmentItems: OrderedShipmentItemsTypes[];
}) => {
    // Quantity already shipped per order item
    const shippedQtyMap = useMemo(() => {
        const map: Record<string, number> = {};

        shipmentItems.forEach((si) => {
            map[si.order_item_id] =
                (map[si.order_item_id] || 0) + Number(si.quantity);
        });

        return map;
    }, [shipmentItems]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    Items ({items.length})
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-2 text-left">
                                    Product
                                </th>

                                <th className="p-2 text-left">
                                    Variant
                                </th>

                                <th className="p-2 text-right">
                                    Qty
                                </th>

                                <th className="p-2 text-right">
                                    Shipped
                                </th>

                                <th className="p-2 text-right">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t"
                                >
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            {item.product_image && (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_title}
                                                    className="h-9 w-9 rounded object-cover"
                                                />
                                            )}

                                            <span>
                                                {item.product_title}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-2 text-muted-foreground">
                                        {variantOf(item) || "-"}
                                    </td>

                                    <td className="p-2 text-right">
                                        {item.quantity}
                                    </td>

                                    <td className="p-2 text-right">
                                        {shippedQtyMap[item.id] || 0}/
                                        {item.quantity}
                                    </td>

                                    <td className="p-2 text-right">
                                        ₹
                                        {Number(
                                            item.total_price
                                        ).toLocaleString("en-IN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderItemsSection;