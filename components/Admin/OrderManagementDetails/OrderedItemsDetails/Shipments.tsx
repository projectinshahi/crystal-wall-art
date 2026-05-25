import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/Typography';
import { OrderedItemsTypes, OrderedShipmentItemsTypes, OrderedShipmentsTypes } from '@/types/Admin/orders.types';
import { Package, Plus, Printer, Trash2, Truck } from 'lucide-react';
import React, { useMemo } from 'react'
import { LabelData, LabelItem, printLabels } from '../../ShippingLabel';
import { UserOrders } from '@/types/order.type';

function variantOf(item: OrderedItemsTypes): string {
    return [item.size, item.thickness, item.orientation, item.mounting_method].filter(Boolean).join(" / ");
}

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

const shipmentStatusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning-foreground border-warning/30",
    packed: "bg-primary/10 text-primary border-primary/30",
    shipped: "bg-accent text-accent-foreground",
    out_for_delivery: "bg-accent text-accent-foreground",
    delivered: "bg-success/10 text-success border-success/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

const Shipments = ({
    items,
    shipments,
    shipmentItems,
    orderData
}: {
    items: OrderedItemsTypes[];
    shipments: OrderedShipmentsTypes[];
    shipmentItems: OrderedShipmentItemsTypes[];
    orderData: UserOrders;
}) => {

    const shippedQtyMap = useMemo(() => {
        const m: Record<string, number> = {};
        // @ts-ignore
        shipmentItems.forEach(si => { m[si.order_item_id] = (m[si.order_item_id] || 0) + si.quantity; });
        return m;
    }, [shipmentItems]);

    const remainingQty = (item: OrderedItemsTypes) => Math.max(0, Number(item.quantity) - (shippedQtyMap[item.id] || 0));

    const allShipped = items.length > 0 && items.every(it => remainingQty(it) === 0);

    const itemsByShipment = useMemo(() => {
        const m: Record<string, OrderedShipmentItemsTypes[]> = {};
        shipmentItems.forEach(si => { (m[si.shipment_id] ||= []).push(si); });
        return m;
    }, [shipmentItems]);

    const buildLabel = (
        shipment: OrderedShipmentsTypes
    ): LabelData => {
        const sItems: LabelItem[] = (
            itemsByShipment[shipment.id] || []
        ).map((si) => {
            const it = items.find(
                (x) => x.id === si.order_item_id
            );

            return {
                title: it?.product_title || "Item",
                quantity: Number(si.quantity),

                size: it?.size || "",
                thickness: it?.thickness || "",
                orientation: it?.orientation || "",
                mounting_method:
                    it?.mounting_method || "",
            };
        });

        return {
            orderNumber: orderData!.order_number,
            shipmentNumber: shipment.shipment_number,
            // @ts-ignore
            customerName: orderData!.customer_name,
            phone: orderData!.customer_phone,
            address: formatAddress(
                orderData!.shipping_address
            ),

            trackingId: shipment.tracking_id,
            courier: shipment.courier,

            items: sItems,
        };
    };

    const printOne = (s: OrderedShipmentsTypes, size: "A4" | "A6") => printLabels([buildLabel(s)], size);

    const openCreate = () => { }
    const deleteShipment = async (id: string) => { }
    const updateShipment = async (id: string, patch: Partial<OrderedShipmentsTypes>) => { }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4" />Shipments ({shipments.length})</CardTitle>
                <Button size="sm" onClick={openCreate} disabled={allShipped}><Plus className="h-4 w-4 mr-1" />Create Shipment</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {shipments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No shipments yet. Create one to start fulfilling.</p>
                    </div>
                ) : shipments.map((s: OrderedShipmentsTypes) => {
                    const sItems = itemsByShipment[s.id] || [];
                    return (
                        <div key={s.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between flex-wrap gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{s.shipment_number}</span>
                                        <Badge variant="outline" className={`capitalize ${shipmentStatusColors[s.status] || ""}`}>{s.status.replace(/_/g, " ")}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Created {new Date(s.created_at).toLocaleString()}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" onClick={() => printOne(s, "A6")}><Printer className="h-3 w-3 mr-1" />A6</Button>
                                    <Button size="sm" variant="outline" onClick={() => printOne(s, "A4")}><Printer className="h-3 w-3 mr-1" />A4</Button>
                                    <Button size="sm" variant="ghost" onClick={() => deleteShipment(s.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-2">
                                <div>
                                    <Typography variant='body-lg'>Courier</Typography>
                                    <Input
                                        defaultValue={s.courier || ""}
                                        onBlur={(e) =>
                                            e.target.value !== (s.courier || "") &&
                                            updateShipment(s.id, {
                                                courier: e.target.value || undefined,
                                            })
                                        }
                                        placeholder="e.g. Delhivery"
                                    />
                                </div>
                                <div>
                                    <Typography variant='body-lg'>Tracking ID</Typography>
                                    <Input
                                        defaultValue={s.tracking_id || ""}
                                        onBlur={(e) =>
                                            e.target.value !== (s.tracking_id || "") &&
                                            updateShipment(s.id, {
                                                tracking_id: e.target.value || undefined,
                                            })
                                        }
                                        placeholder="Tracking number"
                                    />
                                </div>
                                <div>
                                    <Typography variant='body-lg'>Status</Typography>
                                    <Select value={s.status} onValueChange={v => updateShipment(s.id, { status: v as any })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="packed">Packed</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="border rounded">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted/30">
                                        <tr><th className="p-2 text-left">Item</th><th className="p-2 text-left">Variant</th><th className="p-2 text-right">Qty</th></tr>
                                    </thead>
                                    <tbody>
                                        {sItems.map(si => {
                                            const it = items.find(x => x.id === si.order_item_id);
                                            return (
                                                <tr key={si.id} className="border-t">
                                                    <td className="p-2">{it?.product_title}</td>
                                                    <td className="p-2 text-muted-foreground">{it ? variantOf(it) : "-"}</td>
                                                    <td className="p-2 text-right">{si.quantity}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    )
}

export default Shipments